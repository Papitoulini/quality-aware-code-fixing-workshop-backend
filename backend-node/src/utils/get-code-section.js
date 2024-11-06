/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs/promises";

const margin = 5; // Define the margin for extra lines

// Get Code Section Operation with margin
const getCodeSection = async (absolutePath, startLine, endLine) => {
	try {
		if (absolutePath) {
			const data = await fs.readFile(absolutePath, "utf-8");
			const lines = data.split(/\r?\n/);

			// Calculate start and end lines with margin
			const adjustedStartLine = Math.max(0, startLine - margin - 1);
			const adjustedEndLine = Math.min(lines.length, endLine + margin);

			const selectedLines = lines.slice(adjustedStartLine, adjustedEndLine);
			console.group("Retrieved Code Section:");
			console.log("Start_line:", adjustedStartLine + 1, selectedLines[0]);
			console.log("End_line :", adjustedEndLine, selectedLines[selectedLines.length - 1]);
			console.groupEnd();

			return {
				part: selectedLines.join("\n"),
				startLine: adjustedStartLine + 1,
				endLine: adjustedEndLine,
			};
		}

		return null;
	} catch (error) {
		console.log(`Error retrieving code section: ${error.message}`);
		throw error;
	}
};

export default getCodeSection;
