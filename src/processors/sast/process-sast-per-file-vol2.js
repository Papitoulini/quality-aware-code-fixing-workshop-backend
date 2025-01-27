/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import _traverse from "@babel/traverse";

const traverse = _traverse.default;

import queries from "./queries-per-file.js";
import { getCodeFromFile, applyChunkFixesSequentially, LLM, injectCodePart, extractCodeBlock, TOTAL_ALLOWED_LINES, parseCodeToAst, breakCodeIntoChunks } from "#utils";
import { logger } from "#logger";

/**
 * Finds the TypeScript entry point of a repository based on heuristics.
 * @param {string} repoBasePath - The base path of the repository.
 * @returns {string|null} - The path to the entry file or null if not found.
 */
function findEntryPoint(repoBasePath) {
	const packageJsonPath = path.join(repoBasePath, 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		let mainFile = packageJson.main;
	
		// If main exists and ends with .js, attempt to map to a .ts source file.
		if (mainFile && mainFile.endsWith('.js')) {
		// Replace .js with .ts and common build folders with src
			let candidate = mainFile.replace(/\.js$/, '.ts');
			candidate = candidate.replace(/^(dist|build)\//, 'src/');
			const candidatePath = path.join(repoBasePath, candidate);
			if (fs.existsSync(candidatePath)) {
				return candidatePath;
			}
		}
	}
	
	// Fallback heuristics for common TypeScript entry points.
	const commonEntries = [
		path.join(repoBasePath, 'src', 'index.ts'),
		path.join(repoBasePath, 'src', 'main.ts'),
		path.join(repoBasePath, 'src', 'main.ts'),
		path.join(repoBasePath, 'index.ts'),
		path.join(repoBasePath, 'server.ts')
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
		console.error('Entry point not found in repository.');
		return;
	}
	
	console.log(`Found entry point at: ${entryFilePath}`);
	
	let fileContent = fs.readFileSync(entryFilePath, 'utf8');
	
	// Check if dotenv is already imported or configured
	if (fileContent.includes("dotenv.config()") || fileContent.includes("import * as dotenv")) {
		console.log('dotenv already configured in the entry file.');
		return;
	}
	
	// Prepare dotenv injection code
	const dotenvSetup = `import * as dotenv from 'dotenv';\ndotenv.config();\n\n`;
	
	// Inject at the top of the file
	fileContent = dotenvSetup + fileContent;
	
	// Write the modified content back to the entry file
	fs.writeFileSync(entryFilePath, fileContent, 'utf8');
	console.log(`Injected dotenv configuration into ${entryFilePath}`);
}

const transformCodeVulnerabilities = (codeVulnerabilities) => {
	logger.debug("[processSast] Transforming violations into aggregated maps...");
	const aggregatedVulnerabilitiesMap = {};
	const aggregatedFilesMap = {};
	
	for (const codeVulnerability of codeVulnerabilities) {
		// Destructure to separate `files` from other properties.
		const { path, start, end, ...otherProps } = codeVulnerability;
	
		// Use 'message' as our unique key (similar to 'ruleId' in the original).
		const messageKey = codeVulnerability.message || "N/A";
	
		// If this message hasn't been added to aggregatedVulnerabilitiesMap, store it.
		if (!aggregatedVulnerabilitiesMap[messageKey]) {
			aggregatedVulnerabilitiesMap[messageKey] = { ...otherProps };
		}
		// Optional: if multiple violations share the same message, handle merging here if needed.
	
		// Process the `files` array for the current violation.
		// Initialize an object for this filePath if not already present.
		if (!aggregatedFilesMap[path]) {
			aggregatedFilesMap[path] = {};
		}
		const fileLinesMap = aggregatedFilesMap[path];
	
		// Initialize an array for this messageKey if not present.
		if (!fileLinesMap[messageKey]) {
			fileLinesMap[messageKey] = [];
		}
	
		// Push the `{ start, end }` object for this file/violation combination.
		fileLinesMap[messageKey].push({ start, end });
	}
	
	logger.debug(`[processSast] Transformation result: ${Object.keys(aggregatedFilesMap).length} file(s) with violations`);
	return {
		vulnerabilitiesMap: aggregatedVulnerabilitiesMap,
		filesMap: aggregatedFilesMap
	};
}

/**
 * Writes environment variables to a file in .env format.
 * @param envVarNames - Array of environment variable names.
 * @param filePath - The path of the file to write the variables.
 */
const writeEnvVariablesToFile = (envVarNames, repositoryBasePath) => {
	// Format each variable as VARIABLE_NAME=""
	const filePath = ".env.example";
	const absoluteFilePath = path.join(repositoryBasePath, filePath);
	const lines = envVarNames.map(varName => `${varName}=""`);
  
	// Join all lines with a newline character
	const fileContent = lines.join('\n');
  
	// Write the content to the specified file
	fs.writeFileSync(absoluteFilePath, fileContent, 'utf8');
	console.log(`Environment variables written to ${absoluteFilePath}`);
	return filePath;
}

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
				node.object &&
        node.object.type === 'MemberExpression' &&
        node.object.object.name === 'process' &&
        node.object.property.name === 'env' &&
        ((node.property.type === 'Identifier') || (node.property.type === 'StringLiteral'))
			) {
				const varName = node.property.name || node.property.value;
				if (varName) envVarNames.add(varName);
			}
		},
		VariableDeclarator(path) {
			// Catch destructuring: const { var1, var2 } = process.env;
			const { node } = path;
			if (
				node.init &&
        node.init.type === 'MemberExpression' &&
        node.init.object.name === 'process' &&
        node.init.property.name === 'env' &&
        node.id.type === 'ObjectPattern'
			) {
				for (const prop of node.id.properties) {
					if (prop.type === 'ObjectProperty') {
						let varName = null;
						if (prop.key.type === 'Identifier') {
							varName = prop.key.name;
						} else if (prop.key.type === 'StringLiteral') {
							varName = prop.key.value;
						}
						if (varName) envVarNames.add(varName);
					}
				}
			}
		}
	});

	return [...envVarNames];
}

const processSastPerFile = async (codeVulnerabilities, repositoryBasePath) => {
	logger.info("[processSast] Starting sast processing...");
	const processOutput = [];
	const metaFilesFolderPath =	"meta-folder";
	
	logger.debug(`[processSast] Ensuring metaFilesFolderPath exists at: ${metaFilesFolderPath}`);
	if (!fs.existsSync(metaFilesFolderPath)) fs.mkdirSync(metaFilesFolderPath, { recursive: true });
	const changedFiles = new Set();
	
	try {
		logger.debug(`[processSast] Number of initial code vulnerabilities: ${codeVulnerabilities.length}`);
		// const changedFiles = new Set();
		const { vulnerabilitiesMap, filesMap } = transformCodeVulnerabilities(codeVulnerabilities);
		fs.writeFileSync(path.join(metaFilesFolderPath, "sast-vulnerabilitiesMap.json"), JSON.stringify(vulnerabilitiesMap, null, 2))
		logger.debug("[processSast] Wrote sast-vulnerabilitiesMap.json");
		fs.writeFileSync(path.join(metaFilesFolderPath, "sast-filesMap.json"), JSON.stringify(filesMap, null, 2))
		logger.debug("[processSast] Wrote sast-filesMap.json");

		// // Iterate over each violation
		const llm = await LLM();

		logger.info(`[processSast] Beginning per-file analysis`);
		const filesWithFindings = Object.entries(filesMap);

		let collectedEnvVariables = [];
		for (const [filePath, findings_] of filesWithFindings) {
			logger.info(`[processSast] Analyzing file: ${filePath}`);
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const sastForPrompt = [];
			for (const [ruleId, lines] of Object.entries(findings_)) {
				const codeVulnerability = vulnerabilitiesMap[ruleId] || null;
				if (codeVulnerability) sastForPrompt.push({ ...codeVulnerability, lines });
			}
			if (sastForPrompt.length > 0) {
				const { part: codeFile, totalLines } = await getCodeFromFile(absoluteFilePath);
				if (totalLines < 500) continue;
				logger.debug(`[processSast] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				let attemptsUsed = 0;
				console.log(`[processSast] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				// if (totalLines <= TOTAL_ALLOWED_LINES) {
				const maxAttempts = 5;
				let snippet = "";

				let envVarNames = null;
				while (attemptsUsed < maxAttempts && !snippet) {
					attemptsUsed++;
					envVarNames = null;
					logger.debug(`[processSast] LLM attempt #${attemptsUsed} for file ${filePath}`);
					console.log(`[processSast] LLM attempt #${attemptsUsed}`)

					try {
						if (totalLines >= TOTAL_ALLOWED_LINES) {
							const chunks = breakCodeIntoChunks(codeFile, TOTAL_ALLOWED_LINES);
							await applyChunkFixesSequentially(
								codeFile,
								chunks,
								sastForPrompt,
								queries,
								llm)
						} else {
							const response = await llm.sendMessage(
								queries.generateSASTFixTask(codeFile, sastForPrompt),
							);
							snippet = extractCodeBlock(response);
						}

						fs.writeFileSync(
							path.join(metaFilesFolderPath, `sast-${filePath}`),
							snippet
						);

						const { ast } = parseCodeToAst(snippet);
						envVarNames = extractEnvVarNamesFromAST(ast);
							
						const lineCountResponse = snippet.split(/\r?\n/).length;
						logger.debug(`[processSast] LLM snippet returned ${lineCountResponse} lines.`);

						// Inject the fixed code
						await injectCodePart(absoluteFilePath, snippet);
						changedFiles.add(filePath);
						logger.info(`[processSast] Successfully injected code snippet into ${filePath}.`);
					} catch (error) {
						console.log(error);
						logger.warn(`[processSast] Attempt #${attemptsUsed} failed with error: ${error.message}`);
					}
				}

				if (envVarNames && envVarNames.length > 0) {
					collectedEnvVariables.push(...envVarNames);
				}

				// }
				processOutput.push({
					sast: sastForPrompt,
					filePath,
					attempts: attemptsUsed,
					totalLines,
				})
			}
		}

		if (collectedEnvVariables.length > 0) {
			const envFilePath = writeEnvVariablesToFile(collectedEnvVariables, repositoryBasePath);
			injectDotenvConfiguration(repositoryBasePath);
			changedFiles.add(envFilePath);
		}

		fs.writeFileSync(
			path.join(metaFilesFolderPath, "sast-OUTPUT.json"),
			JSON.stringify(processOutput, null, 2)
		);
		fs.writeFileSync(
			path.join(metaFilesFolderPath, "sast-collectedEnvVariables.json"),
			JSON.stringify(collectedEnvVariables, null, 2)
		);
		logger.info("[processSast] Wrote sast-OUTPUT.json");
		
		logger.info("[processSast] Violation processing complete.");
		return changedFiles;
	} catch (error) {
		logger.error(`[processSast] Error during process: ${error.message}`);
		fs.writeFileSync(
			path.join(metaFilesFolderPath, "sast-OUTPUT.json"),
			JSON.stringify(processOutput, null, 2)
		);
		throw error;
	}
};

export default processSastPerFile;