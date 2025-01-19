/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import cycloptViolations from "../../../temp-violations.js"; // TO_DO get from cyclopt

import queries from "./queries.js";
import { getCodeSection, LLM, injectCodePart, extractCodeBlock } from "#utils";
import { logger } from "#logger";

const enhanceViolations = (violations = {}) => {
	return Object.entries(violations).map(([id, data]) => {
		const v = cycloptViolations.find((e) => e.ruleId === id) || {};
		return { ...data, ...v };
	});
}

// function processFileLineData(data) {
// 	/**
//      * Processes an array of objects containing filenames and lines, returning
//      * an array of unique filenames and lines with their counts.
//      *
//      * @param {Array} data - Input data in the format [{ filename: ..., line: ... }, ...]
//      * @returns {Array} - Output in the format [{ uniqueFilename: ..., uniqueLine: ..., count: ... }, ...]
//      */

// 	// Create a Map to count occurrences of unique combinations
// 	const countMap = new Map();

// 	for (const { filePath, line } of data) {
// 		const key = `${filePath}||${line}`; // Use a unique delimiter to combine filename and line
// 		countMap.set(key, (countMap.get(key) || 0) + 1);
// 	}

// 	// Transform the Map into the desired output format
// 	const result = [...countMap.entries()].map(([key, count]) => {
// 		const [uniqueFilename, uniqueLine] = key.split('||');
// 		return { filePath: uniqueFilename, line: uniqueLine, count };
// 	});

// 	return result;
// }

const processViolations = async (violations, repositoryBasePath) => {
	const metaFilesFolderName = "meta-folder"
	const outputProcessFindings = []
	const metaFilesFolderPath = path.join(repositoryBasePath.split("\\").slice(0, -1).join("/"), metaFilesFolderName);
	
	// Check if the metaFilesFolderPath exists, if not, create it
	if (!fs.existsSync(metaFilesFolderPath)) {
		fs.mkdirSync(metaFilesFolderPath, { recursive: true });
	}
	try {

		logger.info(`Violation PROCESS STARTED`);

		const changedFiles = new Set();

		// Merge violation data with known cycloptViolations
		const enhancedViolations = enhanceViolations(violations);

		// console.log(enhancedViolations);

		const allViolationRulesIds = [ ... new Set(enhancedViolations.map((v) => v.ruleId))];
		fs.writeFileSync(path.join(metaFilesFolderPath, "violations-allViolationRulesIds.json"), JSON.stringify(allViolationRulesIds, null, 2))

		// Iterate over each violation
		let violationsTypeCount = 0;
		for (const violation of enhancedViolations) {
			violationsTypeCount += 1;
			const { files, ...restViolationProps } = violation;
			const llm = await LLM();
			await llm.sendMessage(queries.initConversation(restViolationProps), true);
			// For each file, group "close" lines
			let violationsCount = 0;
			const allViolations = files.length;
			// for (const {filePath, line, count} of processFileLineData(files).sort((a,b) => (a.filePath > b.filePath))) {
			for (const {filePath, line} of files.sort((a,b) => (a.filePath > b.filePath))) {
				violationsCount += 1;
				logger.info(`Violation type: ${violationsTypeCount} of ${enhancedViolations.length} | --- --- | Violation: ${violationsCount} of ${allViolations}`);
				const absoluteFilePath = path.join(repositoryBasePath, filePath);
				const { offset, part: codePart, totalLines, partLinesCount } = await getCodeSection(
					absoluteFilePath,
					line,
					line
				);

				console.log(`File: ${filePath}\nLine: ${line}\nTotal FileLines: ${totalLines}\n Code Part Lines: ${partLinesCount}`);

				const normalizedLine = line - offset;

				let attemptsUsed = 0;
				const maxAttempts = 5;
				let snippet = null;
				while (attemptsUsed < maxAttempts && !snippet) {
					attemptsUsed++;
					try {
						const response = await llm.sendMessage(
							queries.askToResolveViolations(codePart, normalizedLine),
						);
						snippet =  extractCodeBlock(response, codePart);
						const lineCountResponse = snippet.split(/\r?\n/).length;
						console.log(`Response Line Count: ${lineCountResponse}`);
						// Inject fixed code
						await injectCodePart(absoluteFilePath, line, line, snippet);
						changedFiles.add(filePath);
					} catch(error) {
						console.warn(error.message);
						logger.error(`Error llm communication: ${error.message}`);
					}
				}

				outputProcessFindings.push({
					restViolationProps,
					filePath,
					attempts: attemptsUsed,
					line,
				})

			}
		}

		fs.writeFileSync(path.join(metaFilesFolderPath, "violations-outputProcessFindings.json"), JSON.stringify(outputProcessFindings, null, 2))

		return changedFiles;
	} catch (error) {
		fs.writeFileSync(path.join(metaFilesFolderPath, "violations-outputProcessFindings.json"), JSON.stringify(outputProcessFindings, null, 2))
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processViolations;
