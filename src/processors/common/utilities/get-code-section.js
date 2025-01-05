/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs/promises";

const margin = 5; // Default margin for extra lines

// Get Code Section Operation with margin and location of exact requested part
const getCodeSection = async (absolutePath, startLine, endLine) => {
	try {
		if (absolutePath) {
			const data = await fs.readFile(absolutePath, "utf8");
			const lines = data.split(/\r?\n/);

			// Calculate start and end lines with margin
			const adjustedStartLine = Math.max(0, startLine - margin); // Start of context section
			const adjustedEndLine = Math.min(lines.length, endLine + margin); // End of context section

			// Get full section with margin
			const fullSection = lines.slice(adjustedStartLine, adjustedEndLine).join("\n");
			// const actualPart = lines.slice(startLine, endLine).join("\n");

			// Calculate position of the requested lines within the full section

			// console.group("Retrieved Code Section:");
			// console.log("Full Section Start Line:", adjustedStartLine + 1, lines[adjustedStartLine]);
			// console.log("Full Section End Line:", adjustedEndLine, lines[adjustedEndLine - 1]);
			// console.groupEnd();

			return {
				// actualPart,
				part: fullSection, // Full code with margin
				offset: adjustedStartLine, // Start of requested lines within full section
			};
		}

		return null;
	} catch (error) {
		console.log(`Error retrieving code section: ${error.message}`);
		throw error;
	}
};

export default getCodeSection;
