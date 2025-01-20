/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";

import queries from "./queries-per-file.js";
import { getCodeFromFile, LLM, injectCodePart, extractCodeBlock, TOTAL_ALLOWED_LINES } from "#utils";
import { logger } from "#logger";

function transformCodeVulnerabilities(codeVulnerabilities) {
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

		if (!aggregatedFilesMap[path]) {
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

const processSastPerFile = async (codeVulnerabilities, repositoryBasePath) => {
	logger.info("[processSast] Starting sast processing...");
	const processOutput = [];
	const metaFilesFolderPath =  "meta-folder";
	
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
				if (totalLines < 700) continue;
				logger.debug(`[processSast] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				let attemptsUsed = 0;
				console.log(`[processSast] File ${filePath} has ${totalLines} lines (allowed max: ${TOTAL_ALLOWED_LINES}).`);
				if (totalLines <= TOTAL_ALLOWED_LINES) {
					const maxAttempts = 5;
					let snippet = null;
					while (attemptsUsed < maxAttempts && !snippet) {
						attemptsUsed++;
						logger.debug(`[processSast] LLM attempt #${attemptsUsed} for file ${filePath}`);
						console.log(`[processSast] LLM attempt #${attemptsUsed}`)

						try {
							const response = await llm.sendMessage(
								queries.generateSASTFixTask(codeFile, sastForPrompt),
							);
							snippet = extractCodeBlock(response);
							
							const lineCountResponse = snippet.split(/\r?\n/).length;
							logger.debug(`[processSast] LLM snippet returned ${lineCountResponse} lines.`);

							// Inject the fixed code
							await injectCodePart(absoluteFilePath, snippet);
							changedFiles.add(filePath);
							logger.info(`[processSast] Successfully injected code snippet into ${filePath}.`);
						} catch (error) {
							logger.warn(`[processSast] Attempt #${attemptsUsed} failed with error: ${error.message}`);
							logger.error(`Error communicating with LLM: ${error.message}`);
						}
					}

				}
				processOutput.push({
					sast: sastForPrompt,
					filePath,
					attempts: attemptsUsed,
				})
			}
		}

		fs.writeFileSync(
			path.join(metaFilesFolderPath, "sast-OUTPUT.json"),
			JSON.stringify(processOutput, null, 2)
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