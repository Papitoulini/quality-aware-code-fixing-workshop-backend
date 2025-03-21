/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import cycloptViolations from "../../../temp-violations.js"; // TO_DO get from cyclopt

import queries from "./queries-per-file.js";
import { 
	getCodeFromFile, 
	LLM, 
	breakCodeIntoChunkNodes, 
	injectCodePart, 
	extractCodeBlock, 
	TOTAL_ALLOWED_LINES, 
	parseCodeToAst 
} from "#utils";
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
 * Transform violation objects into aggregated maps:
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

		if (!aggregatedViolationsMap[ruleId]) {
			aggregatedViolationsMap[ruleId] = { ...otherProps };
		}

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
 * Process a file that is within the allowed line limit.
 * Sends the entire file to the LLM and injects the returned snippet.
 */
async function processFileNormally(absoluteFilePath, codeFile, violationsForPrompt, llm) {
	const maxAttempts = 5;
	let attemptsUsed = 0;
	let snippet = "";

	while (attemptsUsed < maxAttempts && !snippet) {
		attemptsUsed++;
		logger.debug(`[processViolations] LLM normal processing attempt #${attemptsUsed} for ${absoluteFilePath}`);
		try {
			const response = await llm.sendMessage(queries.askToResolveViolations(codeFile, violationsForPrompt));
			snippet = extractCodeBlock(response);
			// Validate the snippet by parsing it
			parseCodeToAst(snippet);
			await injectCodePart(absoluteFilePath, snippet);
			logger.info(`[processViolations] Successfully injected updated code into ${absoluteFilePath}.`);
			return true;
		} catch (error) {
			logger.warn(`[processViolations] Attempt #${attemptsUsed} failed for ${absoluteFilePath}: ${error.message}`);
			if (attemptsUsed === maxAttempts) {
				logger.error(`[processViolations] Max attempts reached for ${absoluteFilePath}.`);
				return false;
			}
		}
	}
}

/**
 * Process a large file by breaking it into maximal AST–derived chunks.
 * Each chunk is processed by the LLM and the resulting snippets are reassembled.
 */
async function processLargeFile(absoluteFilePath, codeFile, violationsForPrompt, llm) {
	logger.debug(`[processViolations] Breaking large file ${absoluteFilePath} into chunks...`);
	const chunks = breakCodeIntoChunkNodes(codeFile);

	// Optionally, write out the original and reassembled code for debugging purposes.
	fs.writeFileSync("old.js", codeFile);
	const reassembledCode = chunks.map(chunk => chunk.codePart).join("\n");
	fs.writeFileSync("new.js", reassembledCode);

	const maxAttempts = 5;
	let attemptsUsed = 0;
	let combinedSnippet = "";

	while (attemptsUsed < maxAttempts && !combinedSnippet) {
		attemptsUsed++;
		logger.debug(`[processViolations] LLM chunk processing attempt #${attemptsUsed} for ${absoluteFilePath}`);
		combinedSnippet = "";

		// Process each chunk sequentially to ensure order is preserved.
		for (const chunk of chunks) {
			const { codePart, startLine, endLine } = chunk;
			// Filter violations that fall within this chunk's boundaries.
			const violationsForChunk = violationsForPrompt.filter(v => v.lines.some(l => l >= startLine && l <= endLine));

			if (violationsForChunk.length === 0) {
				combinedSnippet += codePart;
				continue;
			}

			try {
				const response = await llm.sendMessage(queries.askToResolveViolations(codePart, violationsForChunk));
				const chunkSnippet = extractCodeBlock(response);
				// If the extraction fails, fallback to using the original chunk.
				combinedSnippet += "\n\n" + (chunkSnippet || codePart);
			} catch (chunkError) {
				logger.warn(`[processViolations] Error processing chunk (${startLine}-${endLine}) for ${absoluteFilePath}: ${chunkError.message}. Using original chunk.`);
				combinedSnippet += codePart;
			}
		}
		try {
			// Validate the combined snippet.
			parseCodeToAst(combinedSnippet);
			await injectCodePart(absoluteFilePath, combinedSnippet);
			logger.info(`[processViolations] Successfully injected updated code for large file ${absoluteFilePath}.`);
			return true;
		} catch (validationError) {
			logger.warn(`[processViolations] Validation error on combined snippet for ${absoluteFilePath}: ${validationError.message}`);
			combinedSnippet = "";
		}
	}
	return false;
}

/**
 * Process violations:
 * 1) Enhance violations,
 * 2) Transform them into aggregated maps,
 * 3) Loop over each file and process it using either a normal or large file approach,
 * 4) Inject the returned code snippet back into the file.
 */
const processViolations = async (violations, repositoryBasePath) => {
	logger.info("[processViolations] Starting violation processing...");
	const metaFilesFolderPath = "meta-folder";

	if (!fs.existsSync(metaFilesFolderPath)) {
		fs.mkdirSync(metaFilesFolderPath, { recursive: true });
		logger.debug("[processViolations] Created meta files directory.");
	}

	const changedFiles = new Set();

	try {
		logger.debug(`[processViolations] Number of initial violations: ${Object.keys(violations).length}`);
		const enhancedViolations = enhanceViolations(violations);
		const { violationsMap, filesMap } = transformViolations(enhancedViolations);

		// Initialize LLM once for the processing session.
		const llm = await LLM();
		logger.info("[processViolations] Beginning per-file analysis");

		for (const [filePath, findings_] of Object.entries(filesMap)) {
			logger.info(`[processViolations] Analyzing file: ${filePath}`);
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const violationsForPrompt = [];

			// Map file violations using the aggregated violations map.
			for (const [ruleId, lines] of Object.entries(findings_)) {
				const violation = violationsMap[ruleId] || null;
				if (violation) {
					violationsForPrompt.push({ ...violation, lines });
				}
			}

			if (violationsForPrompt.length > 0) {
				const { part: codeFile, totalLines } = await getCodeFromFile(absoluteFilePath);
				// if (totalLines < 500) continue; // Skip files with less than 500 lines
				logger.debug(`[processViolations] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);

				const success = totalLines <= TOTAL_ALLOWED_LINES 
					? await processFileNormally(absoluteFilePath, codeFile, violationsForPrompt, llm)
					: await processLargeFile(absoluteFilePath, codeFile, violationsForPrompt, llm);
				if (success) {
					changedFiles.add(filePath);
				}
			} else {
				logger.debug(`[processViolations] No relevant violations for file ${filePath}.`);
			}
		}

		logger.info("[processViolations] Violation processing complete.");
		return changedFiles;
	} catch (error) {
		logger.error(`[processViolations] Error during process: ${error.message}`);
		throw error;
	}
};

export default processViolations;
