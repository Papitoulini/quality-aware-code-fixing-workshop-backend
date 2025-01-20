/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";

import queries from "./queries.js";
import { getCodeSection, LLM, injectCodePart, extractCodeBlock } from "#utils";
import { logger } from "#logger";

// function groupVulnerabilities(data) {
// 	/**
//      * Processes an array of objects containing filenames and lines, returning
//      * an array of unique filenames and lines with their counts.
//      *
//      * @param {Array} data - Input data in the format [{ filename: ..., line: ... }, ...]
//      * @returns {Array} - Output in the format [{ uniqueFilename: ..., uniqueLine: ..., count: ... }, ...]
//      */

// 	// Create a Map to count occurrences of unique combinations
// 	const countMap = new Map();

// 	for (const { path: filePath, start: { line: startLine }, end: { line: endLine } } of data) {
// 		const key = `${filePath}||${startLine}||${endLine}`; // Use a unique delimiter to combine filename and line
// 		countMap.set(key, (countMap.get(key) || 0) + 1);
// 	}

// 	// Transform the Map into the desired output format
// 	const result = [...countMap.entries()].map(([key, count]) => {
// 		const [uniqueFilename, startLine, endLine] = key.split('||');
// 		return { filePath: uniqueFilename, startLine, endLine, count };
// 	});

// 	return result;
// }

const processSast = async (codeVulnerabilities, repositoryBasePath) => {
	const metaFilesFolderName = "meta-folder"
	const outputProcessFindings = []
	const metaFilesFolderPath = path.join(repositoryBasePath.split("\\").slice(0, -1).join("/"), metaFilesFolderName);
	
	// Check if the metaFilesFolderPath exists, if not, create it
	if (!fs.existsSync(metaFilesFolderPath)) {
		fs.mkdirSync(metaFilesFolderPath, { recursive: true });
	}
	try {
		logger.info(`Sast PROCESS STARTED`);
		const changedFiles = new Set();

		for (const codeVulnerability of codeVulnerabilities) {
			const { path: filePath, start: { line: startLine }, end: { line: endLine } } = codeVulnerability;
			const llm = await LLM();
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const { offset, part: codePart, totalLines, partLinesCount } = await getCodeSection(
				absoluteFilePath,
				startLine,
				endLine
			);
			console.log(`File: ${filePath}\nStart-Line: ${startLine} <-> Start-Line: ${endLine}\nTotal FileLines: ${totalLines}\n Code Part Lines: ${partLinesCount}`);

			const normalizedStartLine = startLine - offset;
			const normalizedEndLine = endLine - offset;

			let attemptsUsed = 0;
			const maxAttempts = 5;
			let snippet = null;

			while (attemptsUsed < maxAttempts && !snippet) {
				attemptsUsed++;
				try {
					const response = await llm.sendMessage(
						queries.generateSASTFixTask(codeVulnerability, codePart, normalizedStartLine, normalizedEndLine),
					);

					snippet =  extractCodeBlock(response, codePart);
					// Inject fixed code
					await injectCodePart(absoluteFilePath, startLine, endLine, snippet);
					changedFiles.add(filePath);
				} catch(error) {
					console.warn(error.message);
					logger.error(`Error llm communication: ${error.message}`);
				}
			}

			outputProcessFindings.push({
				codeVulnerability,
				filePath,
				attempts: attemptsUsed,
				endLine,
			})
		}

		fs.writeFileSync(path.join(metaFilesFolderPath, "sast-outputProcessFindings.json"), JSON.stringify(outputProcessFindings, null, 2))

		return changedFiles;
	} catch (error) {
		console.log(error);
		fs.writeFileSync(path.join(metaFilesFolderPath, "sast-outputProcessFindings.json"), JSON.stringify(outputProcessFindings, null, 2))
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processSast;
