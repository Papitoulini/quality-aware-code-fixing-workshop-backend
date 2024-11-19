/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs/promises";
// Get Code Section Operation
const injectCodePart = async (absolutePath, startLine, endLine) => {
	try {
		if (absolutePath) {
			const data = await fs.readFile(absolutePath, "utf-8");
			const lines = data.split(/\r?\n/);
			const selectedLines = lines.slice(startLine - 1, endLine);
			console.log(`Retrieved lines ${startLine}-${endLine} from ${absolutePath}`);
			return selectedLines.join("\n");
		}

		return null;
	} catch (error) {
		console.log(`Error retrieving code section: ${error.message}`);
		throw error;
	}
};

export default injectCodePart;
