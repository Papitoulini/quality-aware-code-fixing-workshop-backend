/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

import queries from "./queries-per-file.js";
import {
	getCodeFromFile,
	breakCodeIntoChunkNodes,
	LLM,
	injectCodePart,
	extractCodeBlock,
	TOTAL_ALLOWED_LINES,
	parseCodeToAst
} from "#utils";
import { logger } from "#logger";

/**
 * Finds the TypeScript entry point of a repository based on heuristics.
 * @param {string} repoBasePath - The base path of the repository.
 * @returns {string|null} - The path to the entry file or null if not found.
 */
function findEntryPoint(repoBasePath) {
	const packageJsonPath = path.join(repoBasePath, "package.json");
	if (fs.existsSync(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
		let mainFile = packageJson.main;

		// If main exists and ends with .js, attempt to map to a .ts source file.
		if (mainFile && mainFile.endsWith(".js")) {
			// Replace .js with .ts and common build folders with src
			let candidate = mainFile.replace(/\.js$/, ".ts");
			candidate = candidate.replace(/^(dist|build)\//, "src/");
			const candidatePath = path.join(repoBasePath, candidate);
			if (fs.existsSync(candidatePath)) {
				return candidatePath;
			}
		}
	}

	// Fallback heuristics for common TypeScript entry points.
	const commonEntries = [
		path.join(repoBasePath, "src", "index.ts"),
		path.join(repoBasePath, "src", "main.ts"),
		path.join(repoBasePath, "index.ts"),
		path.join(repoBasePath, "server.ts")
	];

	for (const entry of commonEntries) {
		if (fs.existsSync(entry)) {
			return entry;
		}
	}

	return null;
}

/**
 * Injects dotenv configuration into the entry point of a TypeScript repo if not already present.
 * @param {string} repositoryBasePath - The base path of the target repository.
 */
function injectDotenvConfiguration(repositoryBasePath) {
	const entryFilePath = findEntryPoint(repositoryBasePath);
	if (!entryFilePath) {
		console.error("Entry point not found in repository.");
		return;
	}

	console.log(`Found entry point at: ${entryFilePath}`);
	let fileContent = fs.readFileSync(entryFilePath, "utf8");

	// Check if dotenv is already imported or configured
	if (fileContent.includes("dotenv.config()") || fileContent.includes("import * as dotenv")) {
		console.log("dotenv already configured in the entry file.");
		return;
	}

	// Prepare dotenv injection code
	const dotenvSetup = `import * as dotenv from 'dotenv';\ndotenv.config();\n\n`;
	// Inject at the top of the file
	fileContent = dotenvSetup + fileContent;
	// Write the modified content back to the entry file
	fs.writeFileSync(entryFilePath, fileContent, "utf8");
	console.log(`Injected dotenv configuration into ${entryFilePath}`);
}

/**
 * Writes environment variables to a file in .env format.
 * @param {string[]} envVarNames - Array of environment variable names.
 * @param {string} repositoryBasePath - The base path of the repository.
 * @returns {string} - The relative path of the .env.example file created/updated.
 */
const writeEnvVariablesToFile = (envVarNames, repositoryBasePath) => {
	// Format each variable as VARIABLE_NAME=""
	const filePath = ".env.example";
	const absoluteFilePath = path.join(repositoryBasePath, filePath);

	const uniqueVarNames = [...new Set(envVarNames)];
	const lines = uniqueVarNames.map((varName) => `${varName}=""`);

	// Join all lines with a newline character
	const fileContent = lines.join("\n");
	fs.writeFileSync(absoluteFilePath, fileContent, "utf8");

	console.log(`Environment variables written to ${absoluteFilePath}`);
	return filePath;
};

/**
 * Traverses the AST to extract environment variable names used in the code.
 * @param {object} ast - The AST object of the parsed code.
 * @returns {string[]} - Array of environment variable names found.
 */
const extractEnvVarNamesFromAST = (ast) => {
	const envVarNames = new Set();
	if (!ast) return [];

	traverse(ast, {
		MemberExpression(path) {
			// Catch direct usages like process.env.VAR or process.env["VAR"]
			const { node } = path;
			if (
				node.object?.type === "MemberExpression" &&
				node.object.object?.name === "process" &&
				node.object.property?.name === "env" &&
				(node.property.type === "Identifier" || node.property.type === "StringLiteral")
			) {
				const varName = node.property.name || node.property.value;
				if (varName) envVarNames.add(varName);
			}
		},
		VariableDeclarator(path) {
			// Catch destructuring: const { var1, var2 } = process.env;
			const { node } = path;
			if (
				node.init?.type === "MemberExpression" &&
				node.init.object?.name === "process" &&
				node.init.property?.name === "env" &&
				node.id.type === "ObjectPattern"
			) {
				for (const prop of node.id.properties) {
					if (prop.type === "ObjectProperty") {
						let varName = null;
						if (prop.key.type === "Identifier") {
							varName = prop.key.name;
						} else if (prop.key.type === "StringLiteral") {
							varName = prop.key.value;
						}
						if (varName) envVarNames.add(varName);
					}
				}
			}
		}
	});

	return [...envVarNames];
};

/**
 * Transform raw vulnerability objects into aggregated maps.
 * @param {object[]} codeVulnerabilities - Array of vulnerability objects (with path, start, end, message, etc.)
 * @returns {{ vulnerabilitiesMap: object, filesMap: object }}
 */
const transformCodeVulnerabilities = (codeVulnerabilities) => {
	logger.debug("[processSast] Transforming violations into aggregated maps...");
	const aggregatedVulnerabilitiesMap = {};
	const aggregatedFilesMap = {};

	for (const codeVulnerability of codeVulnerabilities) {
		// Destructure to separate `path`, `start`, `end`, from other properties.
		const { path: filePath, start, end, ...otherProps } = codeVulnerability;
		// Use 'message' as our unique key (similar to 'ruleId' in the original).
		const messageKey = codeVulnerability.message || "N/A";

		// If this message hasn't been added to aggregatedVulnerabilitiesMap, store it.
		if (!aggregatedVulnerabilitiesMap[messageKey]) {
			aggregatedVulnerabilitiesMap[messageKey] = { ...otherProps };
		}

		// Process the path + start/end lines
		if (!aggregatedFilesMap[filePath]) {
			aggregatedFilesMap[filePath] = {};
		}

		const fileLinesMap = aggregatedFilesMap[filePath];
		if (!fileLinesMap[messageKey]) {
			fileLinesMap[messageKey] = [];
		}

		fileLinesMap[messageKey].push({ start, end });
	}

	logger.debug(
		`[processSast] Transformation result: ${Object.keys(aggregatedFilesMap).length} file(s) with vulnerabilities`
	);

	return {
		vulnerabilitiesMap: aggregatedVulnerabilitiesMap,
		filesMap: aggregatedFilesMap
	};
};

/**
 * Process a smaller file (<= TOTAL_ALLOWED_LINES) in a single LLM call (with retries).
 * Returns the updated snippet and extracted environment variables, if any.
 */
async function processSmallFileForSAST(absoluteFilePath, codeFile, sastForPrompt, llm) {
	const maxAttempts = 5;
	let attemptsUsed = 0;
	let snippet = "";
	let envVarNames = [];

	while (attemptsUsed < maxAttempts && !snippet) {
		attemptsUsed++;
		logger.debug(
			`[processSast] LLM attempt #${attemptsUsed} (small file) for ${absoluteFilePath}`
		);

		try {
			const response = await llm.sendMessage(
				queries.generateSASTFixTask(codeFile, sastForPrompt)
			);
			snippet = extractCodeBlock(response) || codeFile;
			const { ast } = parseCodeToAst(snippet);

			// Extract environment variables
			envVarNames = extractEnvVarNamesFromAST(ast);
			await injectCodePart(absoluteFilePath, snippet);

			logger.info(`[processSast] Successfully injected updated code into ${absoluteFilePath}.`);
			return { snippet, envVarNames };
		} catch (error) {
			logger.warn(
				`[processSast] Attempt #${attemptsUsed} failed for ${absoluteFilePath}: ${error.message}`
			);
			if (attemptsUsed === maxAttempts) {
				logger.error(`[processSast] Max attempts reached for ${absoluteFilePath}.`);
			}
		}
	}

	return { snippet: "", envVarNames };
}

/**
 * Process a large file (> TOTAL_ALLOWED_LINES) by breaking it into AST chunks.
 * Returns the updated snippet (concatenation of chunk responses) and extracted environment variables.
 */
async function processLargeFileForSAST(absoluteFilePath, codeFile, sastForPrompt, llm) {
	const maxAttempts = 5;
	let attemptsUsed = 0;
	let combinedSnippet = "";
	let envVarNames = [];

	const chunks = breakCodeIntoChunkNodes(codeFile);
	// (Optional) Write out original and reassembled code for debugging
	fs.writeFileSync("old-large.js", codeFile);
	const reassembled = chunks.map((chunk) => chunk.codePart).join("\n");
	fs.writeFileSync("new-large.js", reassembled);

	while (attemptsUsed < maxAttempts && !combinedSnippet) {
		attemptsUsed++;
		logger.debug(
			`[processSast] LLM chunk processing attempt #${attemptsUsed} for ${absoluteFilePath}`
		);

		let localSnippet = ""; // build up chunk-by-chunk for this pass

		// Process each chunk sequentially
		for (const chunk of chunks) {
			const { codePart, startLine, endLine } = chunk;
			const localFindings = sastForPrompt.filter((v) =>
				v.lines.some((range) => range.start.line >= startLine && range.end.line <= endLine)
			);

			if (localFindings.length === 0) {
				localSnippet += codePart;
				continue;
			}

			try {
				const response = await llm.sendMessage(
					queries.generateSASTFixTask(codePart, localFindings)
				);
				const chunkSnippet = extractCodeBlock(response);
				localSnippet += "\n\n" + (chunkSnippet || codePart);
			} catch (error) {
				logger.warn(
					`[processSast] Error processing chunk (${startLine}-${endLine}) of ${absoluteFilePath}: ${error.message}. Using original chunk.`
				);
				localSnippet += codePart;
			}
		}

		try {
			const { ast } = parseCodeToAst(localSnippet);
			envVarNames = extractEnvVarNamesFromAST(ast);
			await injectCodePart(absoluteFilePath, localSnippet);
			combinedSnippet = localSnippet;
			logger.info(`[processSast] Successfully injected updated code for large file ${absoluteFilePath}.`);
		} catch (validationError) {
			logger.warn(
				`[processSast] Validation error on combined snippet for ${absoluteFilePath}: ${validationError.message}`
			);
			localSnippet = "";
		}
	}

	return { snippet: combinedSnippet, envVarNames };
}

/**
 * Main function to process SAST vulnerabilities on a per-file basis:
 * 1) Transform them into aggregated maps,
 * 2) Loop over each file, handle small or large files differently,
 * 3) Use LLM to generate fixes and inject them back,
 * 4) Extract environment variables and create an .env.example as needed,
 * 5) Inject dotenv configuration in the TS entry point if new variables are found.
 */
const processSastPerFile = async (codeVulnerabilities, repositoryBasePath) => {
	logger.info("[processSast] Starting SAST processing...");
	const metaFilesFolderPath = "meta-folder";

	logger.debug(`[processSast] Ensuring metaFilesFolderPath exists at: ${metaFilesFolderPath}`);
	if (!fs.existsSync(metaFilesFolderPath)) {
		fs.mkdirSync(metaFilesFolderPath, { recursive: true });
	}

	const changedFiles = new Set();
	let collectedEnvVariables = [];

	try {
		logger.debug(`[processSast] Number of initial code vulnerabilities: ${codeVulnerabilities.length}`);
		const { vulnerabilitiesMap, filesMap } = transformCodeVulnerabilities(codeVulnerabilities);

		// Initialize the LLM once for this session
		const llm = await LLM();
		logger.info("[processSast] Beginning per-file analysis");

		for (const [filePath, findings_] of Object.entries(filesMap)) {
			logger.info(`[processSast] Analyzing file: ${filePath}`);
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const sastForPrompt = [];

			// Build array of { messageKey, lines }
			for (const [messageKey, ranges] of Object.entries(findings_)) {
				const vulnerability = vulnerabilitiesMap[messageKey] || null;
				if (vulnerability) {
					sastForPrompt.push({ ...vulnerability, lines: ranges });
				}
			}

			if (sastForPrompt.length > 0) {
				// Load file contents
				const { part: codeFile, totalLines } = await getCodeFromFile(absoluteFilePath);
				// if (totalLines <= 300) continue; // Skip files with less than 500 lines
				logger.debug(
					`[processSast] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`
				);

				// Decide how to process the file based on line count
				let snippet = "";
				let envVarNames = [];

				if (totalLines <= TOTAL_ALLOWED_LINES) {
					// Process smaller files in one go
					const result = await processSmallFileForSAST(absoluteFilePath, codeFile, sastForPrompt, llm);
					snippet = result.snippet;
					envVarNames = result.envVarNames;
				} else {
					// Process larger files in AST-based chunks
					const result = await processLargeFileForSAST(
						absoluteFilePath,
						codeFile,
						sastForPrompt,
						llm
					);
					snippet = result.snippet;
					envVarNames = result.envVarNames;
				}

				if (snippet) {
					changedFiles.add(filePath);
					if (envVarNames && envVarNames.length > 0) {
						collectedEnvVariables.push(...envVarNames);
					}
				}
			} else {
				logger.debug(`[processSast] No relevant vulnerabilities for file ${filePath}.`);
			}
		}

		// If we discovered new environment variables, write them to .env.example and inject dotenv config
		if (collectedEnvVariables.length > 0) {
			const envFilePath = writeEnvVariablesToFile(collectedEnvVariables, repositoryBasePath);
			changedFiles.add(envFilePath);
			injectDotenvConfiguration(repositoryBasePath);
		}

		logger.info("[processSast] SAST processing complete.");
		return changedFiles;
	} catch (error) {
		logger.error(`[processSast] Error during process: ${error.message}`);
		throw error;
	}
};

export default processSastPerFile;
