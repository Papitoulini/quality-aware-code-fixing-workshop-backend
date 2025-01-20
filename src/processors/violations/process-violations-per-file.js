/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import cycloptViolations from "../../../temp-violations.js"; // TO_DO get from cyclopt

import queries from "./queries-per-file.js";
import { getCodeFromFile, LLM, injectCodePart, extractCodeBlock, TOTAL_ALLOWED_LINES } from "#utils";
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
	const metaFilesFolderName = "meta-folder";
	const outputProcessOutput = [];

	const metaFilesFolderPath = path.join(
		repositoryBasePath.split("/").slice(0, -1).join("/"), 
		metaFilesFolderName
	);

	logger.debug(`[processViolations] Ensuring metaFilesFolderPath exists at: ${metaFilesFolderPath}`);
	if (!fs.existsSync(metaFilesFolderPath)) {
		fs.mkdirSync(metaFilesFolderPath, { recursive: true });
		logger.debug("[processViolations] Created meta files directory.");
	}

	const changedFiles = new Set();

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

		// Initialize LLM only once before iteration
		const llm = await LLM();

		logger.info(`[processViolations] Beginning per-file analysis`);
		// Limit to the first 3 for demonstration or performance reasons
		const filesWithFindings = Object.entries(filesMap);

		for (const [filePath, findings_] of filesWithFindings) {
			logger.info(`[processViolations] Analyzing file: ${filePath}`);
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const violationsForPrompt = [];

			for (const [ruleId, lines] of Object.entries(findings_)) {
				const violation = violationsMap[ruleId] || null;
				if (violation) {
					violationsForPrompt.push({ ...violation, lines });
				}
			}

			if (violationsForPrompt.length > 0) {
				// Attempt to retrieve the file content
				const { part: codeFile, totalLines } = await getCodeFromFile(absoluteFilePath);
				logger.debug(`[processViolations] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);

				let attemptsUsed = 0;

				// Only proceed if within the lines limit
				console.log(`[processViolations] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				if (totalLines <= TOTAL_ALLOWED_LINES) {
					const maxAttempts = 5;
					let snippet = null;

					while (attemptsUsed < maxAttempts && !snippet) {
						attemptsUsed++;
						logger.debug(`[processViolations] LLM attempt #${attemptsUsed} for file ${filePath}`);
						console.log(`[processViolations] LLM attempt #${attemptsUsed}`)

						try {
							const response = await llm.sendMessage(
								queries.askToResolveViolations(codeFile, violationsForPrompt),
							);
							snippet = extractCodeBlock(response);
							
							const lineCountResponse = snippet.split(/\r?\n/).length;
							logger.debug(`[processViolations] LLM snippet returned ${lineCountResponse} lines.`);

							// Inject the fixed code
							await injectCodePart(absoluteFilePath, snippet);
							changedFiles.add(filePath);
							logger.info(`[processViolations] Successfully injected code snippet into ${filePath}.`);
						} catch (error) {
							logger.warn(`[processViolations] Attempt #${attemptsUsed} failed with error: ${error.message}`);
							logger.error(`Error communicating with LLM: ${error.message}`);
						}
					}
				} else {
					logger.warn(`[processViolations] Skipping file ${filePath}; it exceeds the allowed line limit.`);
				}

				outputProcessOutput.push({
					violations: violationsForPrompt,
					filePath,
					attempts: attemptsUsed,
					totalLines,
				});
			} else {
				logger.debug(`[processViolations] No relevant violations for file ${filePath}.`);
			}
		}

		fs.writeFileSync(
			path.join(metaFilesFolderPath, "violations-OUTPUT.json"),
			JSON.stringify(outputProcessOutput, null, 2)
		);
		logger.info("[processViolations] Wrote violations-OUTPUT.json");
		
		logger.info("[processViolations] Violation processing complete.");
		return changedFiles;
	} catch (error) {
		logger.error(`[processViolations] Error during process: ${error.message}`);
		fs.writeFileSync(
			path.join(metaFilesFolderPath, "violations-OUTPUT.json"),
			JSON.stringify(outputProcessOutput, null, 2)
		);
		throw error;
	}
};

export default processViolations;
