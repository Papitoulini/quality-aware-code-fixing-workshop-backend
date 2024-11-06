/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs/promises";
// Get Code Section Operation
const getCodeSection = async (absolutePath, startLine, endLine) => {
	try {
		if (absolutePath) {
			const data = await fs.readFile(absolutePath, "utf-8");
			const lines = data.split(/\r?\n/);
			const selectedLines = lines.slice(startLine - 1, endLine);
			console.group("Retrieved Code Section:");
			console.log("Start_line:", startLine, selectedLines[0]);
			console.log("End_line :", endLine, selectedLines[selectedLines.length - 1]);
			console.groupEnd();
			return selectedLines.join("\n");
		}

		return null;
	} catch (error) {
		console.log(`Error retrieving code section: ${error.message}`);
		throw error;
	}
};

export default getCodeSection;
