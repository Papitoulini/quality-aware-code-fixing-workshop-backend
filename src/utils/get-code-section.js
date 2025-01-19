/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs/promises";

import { logger }  from "#logger";
import { CODE_SNIPPET_MARGIN }  from "#utils";

// Get Code Section Operation with margin and location of exact requested part
const getCodeSection = async (absolutePath, startLine, endLine) => {
	try {
		const data = await fs.readFile(absolutePath, "utf8");
		const lines = data.split(/\r?\n/);

		// Calculate start and end lines with margin
		const adjustedStartLine = Math.max(0, Number(startLine) - CODE_SNIPPET_MARGIN); // Start of context section
		const adjustedEndLine = Math.min(lines.length, Number(endLine) + CODE_SNIPPET_MARGIN); // End of context section

		// Get full section with margin
		const fullSection = lines.slice(adjustedStartLine, adjustedEndLine).join("\n");

		return {
			part: fullSection, // Full code with margin
			offset: adjustedStartLine, // Start of requested lines within full section
			totalLines: lines.length,
			partLinesCount: fullSection.split(/\r?\n/).length,
		};
	} catch (error) {
		logger.error(`Error during "retrieving" code section from local repo: ${error.message}`);
		return {
			part: null, // Full code with margin
			offset: null, // Start of requested lines within full section
			totalLines: null,
		};
	}
};

export default getCodeSection;
