/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs/promises";

import { logger }  from "#logger";

const margin = 5; // Default margin for extra lines

// Get Code Section Operation with margin and location of exact requested part
const getCodeSection = async (absolutePath, startLine, endLine) => {
	try {
		const data = await fs.readFile(absolutePath, "utf8");
		const lines = data.split(/\r?\n/);

		// Calculate start and end lines with margin
		const adjustedStartLine = Math.max(0, startLine - margin); // Start of context section
		const adjustedEndLine = Math.min(lines.length, endLine + margin); // End of context section

		// Get full section with margin
		const fullSection = lines.slice(adjustedStartLine, adjustedEndLine).join("\n");

		return {
			part: fullSection, // Full code with margin
			offset: adjustedStartLine, // Start of requested lines within full section
		};
	} catch (error) {
		logger.error(`Error during "retrieving" code section from local repo: ${error.message}`);
		return {
			part: null, // Full code with margin
			offset: null, // Start of requested lines within full section
		};
	}
};

export default getCodeSection;
