/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import fs from "node:fs";
import cycloptViolations from "../../../temp-violations.js"; // TO_DO get from cyclopt

import queries from "./queries.js";
import { getCodeSection, LLM, injectCodePart, MODEL, groupLines, groupFiles } from "#utils";
import { logger } from "#logger";

const enhanceViolations = (violations = {}) => {
	return Object.entries(violations).map(([id, data]) => {
		const v = cycloptViolations.find((e) => e.ruleId === id) || {};
		return { ...data, ...v };
	});
}

const processViolations = async (violations, repositoryBasePath) => {
	try {

		const changedFiles = new Set();

		// Merge violation data with known cycloptViolations
		const enhancedViolations = enhanceViolations(violations);

		// Iterate over each violation
		let violationsCount = 0;
		for (const violation of enhancedViolations) {
			violationsCount += 1;
			logger.info(`Violation: ${violationsCount} of ${violationsCount.length}`);
			const { files, ...restViolationProps } = violation;
			const llm = await LLM();
			await llm.sendMessage(queries.initConversation(restViolationProps), true);

			// Group lines by file path
			const groupedFiles = groupFiles(files);

			// For each file, group "close" lines
			let filesCount = 0;
			for (const [filePath, lines] of Object.entries(groupedFiles)) {
				filesCount += 1;
				logger.info(`groupedFiles: ${filesCount} of ${Object.entries(groupedFiles).length}`);

				// 1) Group lines with threshold=10 (tweak as needed)
				const lineBatches = groupLines(lines);

				// 2) Process each group
				for (const group of lineBatches) {
				// e.g. group might be [140, 140, 141], or [330, 330], etc.
					const startLine = group[0];
					const endLine = group.at(-1);
					const absoluteFilePath = path.join(repositoryBasePath, filePath);

					// Retrieve code snippet for the entire group range
					const { offset, part: codePart } = await getCodeSection(
						absoluteFilePath,
						startLine,
						endLine
					);

					// Re-normalize lines for your code snippet
					const normalizedLines = group.map((line) => line - offset);

					// Ask LLM to fix them
					const response = await llm.sendMessage(
						queries.askToResolveViolations(codePart, normalizedLines),
					);
					// Extract snippet from code fences
					const snippetOnly = response
						.replaceAll(/```\r?\n\w*\s*([\S\s]*?)```/g, "$1")
						.trim();

					// Inject fixed code
					await injectCodePart(absoluteFilePath, startLine, endLine, snippetOnly);
					changedFiles.add(filePath);

					// (Optional) Save the response for debugging
					fs.writeFileSync(`server-test/${MODEL}-${startLine}.md`, response, "utf8");
				}
			}
		}

		return changedFiles;
	} catch (error) {
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processViolations;
