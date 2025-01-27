/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import cycloptViolations from "../../../temp-violations.js"; // TO_DO get from cyclopt

import queries from "./queries-per-file.js";
import { getCodeFromFile, LLM, injectCodePart, extractCodeBlock, TOTAL_ALLOWED_LINES, parseCodeToAst } from "#utils";
import { logger } from "#logger";

/**
 * Enhance the violations with additional data from `cycloptViolations`.
 */
const enhanceViolations = (violations = {}) => {
	logger.debug("[processViolations] Enhancing violations...");
	const result = Object.entries(violations).map(([id, data]) => {
		const matchedCyclopt = cycloptViolations.find((e) => e.ruleId === id) || {};
		return { ...data, ...matchedCyclopt };
	});
	logger.debug(`[processViolations] Enhanced ${result.length} violation(s)`);
	return result;
};

/**
 * Transform violation objects into aggregated structures:
 * 1) violationsMap (keyed by ruleId)
 * 2) filesMap (keyed by filePath)
 */
function transformViolations(violations_) {
	logger.debug("[processViolations] Transforming violations into aggregated maps...");
	const aggregatedViolationsMap = {};
	const aggregatedFilesMap = {};

	for (const violation of violations_) {
		const { files, ...otherProps } = violation;
		const ruleId = violation.ruleId || (violation.restViolationProps && violation.restViolationProps.ruleId) || "N/A";

		// If this ruleId hasn't been added to violationsMap, add it.
		if (!aggregatedViolationsMap[ruleId]) {
			aggregatedViolationsMap[ruleId] = { ...otherProps };
		}

		// Process files for the current violation
		if (Array.isArray(files)) {
			for (const { filePath, line } of files) {
				if (!aggregatedFilesMap[filePath]) {
					aggregatedFilesMap[filePath] = {};
				}
				const fileLinesMap = aggregatedFilesMap[filePath];

				if (!fileLinesMap[ruleId]) {
					fileLinesMap[ruleId] = [];
				}
				fileLinesMap[ruleId].push(line);
			}
		}
	}

	logger.debug(`[processViolations] Transformation result: ${Object.keys(aggregatedFilesMap).length} file(s) with violations`);
	return {
		violationsMap: aggregatedViolationsMap,
		filesMap: aggregatedFilesMap
	};
}

/**
 * Process violations:
 * 1) Enhance them,
 * 2) Transform them,
 * 3) Loop over each file, 
 * 4) Send them to LLM for potential fixes,
 * 5) Inject the returned code snippet back into the file.
 */
const processViolations = async (violations, repositoryBasePath) => {
	logger.info("[processViolations] Starting violation processing...");
	const metaFilesFolderPath = "meta-folder";

	logger.debug(`[processViolations] Ensuring metaFilesFolderPath exists at: ${metaFilesFolderPath}`);
	if (!fs.existsSync(metaFilesFolderPath)) {
		fs.mkdirSync(metaFilesFolderPath, { recursive: true });
		logger.debug("[processViolations] Created meta files directory.");
	}

	// Define paths for violation-related files
	const processedFilesPath = path.join(metaFilesFolderPath, "violations-processed-files.json");
	const ignoredFilesPath = path.join(metaFilesFolderPath, "violations-ignored-files.json");
	const outputPath = path.join(metaFilesFolderPath, "violations-OUTPUT.json");

	// Load already processed and ignored files
	const alreadyProcessedFilesUnparsed = fs.existsSync(processedFilesPath);
	const alreadyProcessedFiles = alreadyProcessedFilesUnparsed
		? JSON.parse(fs.readFileSync(processedFilesPath, 'utf8'))
		: [];
	const alreadyIgnoredFilesUnparsed = fs.existsSync(ignoredFilesPath);
	const alreadyIgnoredFiles = alreadyIgnoredFilesUnparsed
		? JSON.parse(fs.readFileSync(ignoredFilesPath, 'utf8'))
		: [];
	const alreadyIgnoredFilesSet = new Set(alreadyIgnoredFiles);
	const alreadyProcessedFilesSet = new Set([...alreadyProcessedFiles, ...alreadyIgnoredFiles]);
	const changedFiles = new Set(alreadyProcessedFiles);

	// Load existing processOutput if available
	let processOutput = [];
	if (fs.existsSync(outputPath)) {
		try {
			processOutput = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
			logger.debug(`[processViolations] Loaded existing processOutput with ${processOutput.length} entries.`);
		} catch {
			logger.warn(`[processViolations] Failed to parse existing violations-OUTPUT.json. Initializing as empty array.`);
			processOutput = [];
		}
	}

	try {
		logger.debug(`[processViolations] Number of initial violations: ${Object.keys(violations).length}`);
		const enhancedViolations = enhanceViolations(violations);
		const { violationsMap, filesMap } = transformViolations(enhancedViolations);

		fs.writeFileSync(
			path.join(metaFilesFolderPath, "violations-enhanced.json"),
			JSON.stringify(enhancedViolations, null, 2)
		);
		logger.debug("[processViolations] Wrote violations-enhanced.json");

		fs.writeFileSync(
			path.join(metaFilesFolderPath, "violations-violationsMap.json"),
			JSON.stringify(violationsMap, null, 2)
		);
		logger.debug("[processViolations] Wrote violations-violationsMap.json");

		fs.writeFileSync(
			path.join(metaFilesFolderPath, "violations-filesMap.json"),
			JSON.stringify(filesMap, null, 2)
		);
		logger.debug("[processViolations] Wrote violations-filesMap.json");

		// Initialize LLM
		const llm = await LLM();

		logger.info(`[processViolations] Beginning per-file analysis`);
		
		// Define files to process by filtering out already processed or ignored files
		const filesToProcess = Object.entries(filesMap).filter(([filePath, findings_]) => {
			// Skip already processed files
			if (alreadyProcessedFilesSet.has(filePath)) {
				logger.info(`[processViolations] File ${filePath} already processed. Skipping...`);
				return false;
			}

			// Skip files with no findings
			if (!findings_ || Object.keys(findings_).length === 0) {
				logger.info(`[processViolations] File ${filePath} has no findings. Skipping...`);
				return false;
			}

			// Skip files that do not exist
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			if (!fs.existsSync(absoluteFilePath)) {
				logger.warn(`[processViolations] File ${absoluteFilePath} does not exist. Skipping.`);
				return false;
			}

			return true; // Include this file in processing
		});

		// Process a subset or all files as needed
		for (const [filePath, findings_] of filesToProcess) { // Removed slice for full processing
			logger.info(`[processViolations] Analyzing file: ${filePath}`);
			if (alreadyProcessedFilesSet.has(filePath)) {
				logger.info(`[processViolations] File ${filePath} already processed. Skipping...`);
				continue;
			}
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const violationsForPrompt = [];

			for (const [ruleId, lines] of Object.entries(findings_)) {
				const violation = violationsMap[ruleId] || null;
				if (violation) violationsForPrompt.push({ ...violation, lines });
			}

			if (violationsForPrompt.length > 0) {
				const { part: codeFile, totalLines } = await getCodeFromFile(absoluteFilePath);
				logger.debug(`[processViolations] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				let attemptsUsed = 0;
				console.log(`[processViolations] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				if (totalLines <= TOTAL_ALLOWED_LINES) {
					const maxAttempts = 5;
					let snippet = "";

					while (attemptsUsed < maxAttempts && !snippet) {
						attemptsUsed++;
						logger.debug(`[processViolations] LLM attempt #${attemptsUsed} for file ${filePath}`);
						console.log(`[processViolations] LLM attempt #${attemptsUsed}`);

						try {
							const response = await llm.sendMessage(
								queries.askToResolveViolations(codeFile, violationsForPrompt),
							);
							snippet = extractCodeBlock(response);
							// console.log("Snippet:", snippet, 999);
							parseCodeToAst(snippet);
							if (!snippet || (snippet === codeFile)) continue;
							
							const lineCountResponse = snippet.split(/\r?\n/).length;
							logger.debug(`[processViolations] LLM snippet returned ${lineCountResponse} lines.`);

							// Inject the fixed code
							await injectCodePart(absoluteFilePath, snippet);
							changedFiles.add(filePath);
							logger.info(`[processViolations] Successfully injected code snippet into ${filePath}.`);
						} catch (error) {
							logger.warn(`[processViolations] Attempt #${attemptsUsed} failed with error: ${error.message}`);
							snippet = null;
							if (attemptsUsed === maxAttempts) {
								alreadyIgnoredFilesSet.add(filePath);
								logger.warn(`[processViolations] Max attempts reached for file ${filePath}. Marking as ignored.`);
							}
						}
					}
				} else {
					logger.warn(`[processViolations] Skipping file ${filePath}; it exceeds the allowed line limit.`);
					alreadyIgnoredFilesSet.add(filePath);
				}
				// Append to processOutput
				processOutput.push({
					violations: violationsForPrompt,
					filePath,
					attempts: attemptsUsed,
					totalLines,
				});
			} else {
				logger.debug(`[processViolations] No relevant violations for file ${filePath}.`);
			}
		}

		// Write updated processOutput to violations-OUTPUT.json
		fs.writeFileSync(
			outputPath,
			JSON.stringify(processOutput, null, 2)
		);
		logger.info(`[processViolations] Updated violations-OUTPUT.json with ${processOutput.length} entries.`);

		// Write updated changedFiles to violations-processed-files.json
		fs.writeFileSync(
			processedFilesPath,
			JSON.stringify([...changedFiles], null, 2)
		);
		logger.info(`[processViolations] Updated violations-processed-files.json with ${changedFiles.size} files.`);

		// Write updated alreadyIgnoredFilesSet to violations-ignored-files.json
		fs.writeFileSync(
			ignoredFilesPath,
			JSON.stringify([...alreadyIgnoredFilesSet], null, 2)
		);
		logger.info(`[processViolations] Updated violations-ignored-files.json with ${alreadyIgnoredFilesSet.size} files.`);
		logger.info("[processViolations] Violation processing complete.");
		return changedFiles;
	} catch (error) {
		logger.error(`[processViolations] Error during process: ${error.message}`);
		// Attempt to write whatever is in processOutput
		try {
			fs.writeFileSync(
				outputPath,
				JSON.stringify(processOutput, null, 2)
			);
			logger.info(`[processViolations] Wrote partial violations-OUTPUT.json with ${processOutput.length} entries.`);
		} catch (writeError) {
			logger.error(`[processViolations] Failed to write violations-OUTPUT.json: ${writeError.message}`);
		}
		throw error;
	}
};
export default processViolations;
