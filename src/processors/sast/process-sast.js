/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";

import queries from "./queries.js";
import { getCodeSection, LLM, injectCodePart } from "#utils";
import { logger } from "#logger";

const extractSingleCodeBlockAndCheck = (response, originalSnippet) => {
	const singleBlockRegex = /```[\dA-Za-z]*\s*[\n\r]+([\S\s]*?)```/;
	const match = singleBlockRegex.exec(response);
	if (!match) throw new Error("No triple-backtick code block found in LLM response");
	// match[1] is the code snippet inside the backticks
	const snippet = match[1].trimEnd();

	const originalLineCount = originalSnippet.split(/\r?\n/).length;
	const snippetLineCount = snippet.split(/\r?\n/).length;
	if (originalLineCount !== snippetLineCount) throw new Error("No triple-backtick code block found in LLM response")

	return snippet;
}

const processSast = async (codeVulnerabilities, repositoryBasePath) => {
	try {

		const changedFiles = new Set();

		for (const codeVulnerability of codeVulnerabilities) {
			const { path: filePath, start: { line: startLine }, end: { line: endLine } } = codeVulnerability;
			const llm = await LLM();
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const { offset, part: codePart } = await getCodeSection(
				absoluteFilePath,
				startLine,
				endLine
			);

			const normalizedStartLine = startLine - offset;
			const normalizedEndLine = endLine - offset;

			let retries = 5;
			let snippet = null;

			while (retries-- > 0 && !snippet ) {
				try {
					const response = await llm.sendMessage(
						queries.askToResolveViolations(codeVulnerability, codePart, normalizedStartLine, normalizedEndLine),
					);
					snippet =  extractSingleCodeBlockAndCheck(codeVulnerability, response, codePart);
					// Inject fixed code
					await injectCodePart(absoluteFilePath, normalizedStartLine, normalizedEndLine, snippet);
					changedFiles.add(filePath);
				} catch(error) {
					logger.error(`Error llm communication: ${error.message}`);
				}
			}
		}

		// Merge violation data with known cycloptViolations
		// const enhancedViolations = enhanceViolations(violations);

		// // Iterate over each violation
		// let violationsTypeCount = 0;
		// for (const violation of enhancedViolations) {
		// 	violationsTypeCount += 1;
		// 	const { files, ...restViolationProps } = violation;
		// 	const llm = await LLM();
		// 	await llm.sendMessage(queries.initConversation(restViolationProps), true);
		// 	// For each file, group "close" lines
		// 	let violationsCount = 0;
		// 	const allViolations = files.length;
		// 	for (const {filePath, line} of files.sort((a,b) => (a.filePath > b.filePath))) {
		// 		violationsCount += 1;
		// 		logger.info(`Violation type: ${violationsTypeCount} of ${enhancedViolations.length} | --- --- | Violation: ${violationsCount} of ${allViolations}`);
		// 		const absoluteFilePath = path.join(repositoryBasePath, filePath);
		// 		const { offset, part: codePart } = await getCodeSection(
		// 			absoluteFilePath,
		// 			line,
		// 			line
		// 		);

		// 		const normalizedLine = line - offset;

		// 		let retries = 5;
		// 		let snippet = null;

		// 		while (retries-- > 0 && !snippet ) {
		// 			try {
		// 				const response = await llm.sendMessage(
		// 					queries.askToResolveViolations(codePart, normalizedLine),
		// 				);
		// 				snippet =  extractSingleCodeBlockAndCheck(response, codePart);
		// 				// Inject fixed code
		// 				await injectCodePart(absoluteFilePath, line, line, snippet);
		// 				changedFiles.add(filePath);
		// 			} catch(error) {
		// 				logger.error(`Error llm communication: ${error.message}`);
		// 			}
		// 		}

		// 	}
		// }

		return changedFiles;
	} catch (error) {
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processSast;
