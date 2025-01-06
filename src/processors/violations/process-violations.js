/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
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

const processViolations = async (violations, repositoryBasePath) => {
	try {

		const changedFiles = new Set();

		// Merge violation data with known cycloptViolations
		const enhancedViolations = enhanceViolations(violations);

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
			for (const {filePath, line} of files.sort((a,b) => (a.filePath > b.filePath))) {
				violationsCount += 1;
				logger.info(`Violation type: ${violationsTypeCount} of ${enhancedViolations.length} | --- --- | Violation: ${violationsCount} of ${allViolations}`);
				const absoluteFilePath = path.join(repositoryBasePath, filePath);
				const { offset, part: codePart } = await getCodeSection(
					absoluteFilePath,
					line,
					line
				);

				const normalizedLine = line - offset;

				let retries = 5;
				let snippet = null;

				while (retries-- > 0 && !snippet ) {
					try {
						const response = await llm.sendMessage(
							queries.askToResolveViolations(codePart, normalizedLine),
						);
						snippet =  extractCodeBlock(response, codePart);
						// Inject fixed code
						await injectCodePart(absoluteFilePath, line, line, snippet);
						changedFiles.add(filePath);
					} catch(error) {
						logger.error(`Error llm communication: ${error.message}`);
					}
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
