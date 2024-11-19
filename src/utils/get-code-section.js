/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs/promises";

const margin = 5; // Default margin for extra lines

// Get Code Section Operation with margin and location of exact requested part
const getCodeSection = async (absolutePath, startLine, endLine) => {
	try {
		if (absolutePath) {
			const data = await fs.readFile(absolutePath, "utf-8");
			const lines = data.split(/\r?\n/);

			// Calculate start and end lines with margin
			const adjustedStartLine = Math.max(0, startLine - margin - 1); // Start of context section
			const adjustedEndLine = Math.min(lines.length, endLine + margin); // End of context section

			// Get full section with margin
			const fullSection = lines.slice(adjustedStartLine, adjustedEndLine).join("\n");
			// const actualPart = lines.slice(startLine, endLine).join("\n");

			// Calculate position of the requested lines within the full section
			const relativeStartLine = startLine - adjustedStartLine; // Start of requested part within the full section
			const relativeEndLine = endLine - adjustedStartLine; // End of requested part within the full section

			console.group("Retrieved Code Section:");
			console.log("Full Section Start Line:", adjustedStartLine + 1, lines[adjustedStartLine]);
			console.log("Full Section End Line:", adjustedEndLine, lines[adjustedEndLine - 1]);
			console.log("Requested Section Relative Start Line:", relativeStartLine + 1);
			console.log("Requested Section Relative End Line:", relativeEndLine);
			console.groupEnd();

			return {
				// actualPart,
				part: fullSection, // Full code with margin
				requestedStart: relativeStartLine + 1, // Start of requested lines within full section
				requestedEnd: relativeEndLine, // End of requested lines within full section
			};
		}

		return null;
	} catch (error) {
		console.log(`Error retrieving code section: ${error.message}`);
		throw error;
	}
};

export default getCodeSection;
