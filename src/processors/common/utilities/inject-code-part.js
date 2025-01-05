/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs/promises";

const margin = 5; // Default margin for extra lines

/**
 * Reads or replaces a code section from `startLine` to `endLine`.
 *
 * @param {string} absolutePath - The absolute file path.
 * @param {number} startLine - The starting line number (1-based).
 * @param {number} endLine - The ending line number (inclusive, 1-based).
 * @param {string} [newCode] - If provided, will replace lines [startLine..endLine] with `newCode`.
 * @returns {Promise<string|null>} - If reading, returns the extracted snippet.
 *                                   If writing, returns null.
 */
async function injectCodePart(absolutePath, startLine, endLine, newCode) {
	try {
		if (!absolutePath) {
			console.error("No file path provided.");
			return null;
		}

		// Read file
		const data = await fs.readFile(absolutePath, "utf8");
		const lines = data.split(/\r?\n/);
		// If no `newCode` is given, just return the specified lines (original behavior)
		if (!newCode) return null;

		// Otherwise, we are writing/replacing lines in-place:
		const adjustedStartLine = Math.max(0, startLine - margin); // Start of context section
		const adjustedEndLine = Math.min(lines.length, endLine + margin); // End of context section
		// Split newCode into array of lines for insertion
		const newLines = newCode.split(/\r?\n/);

		// Construct updated file content
		const updatedLines = [...lines.slice(0, adjustedStartLine), ...newLines, ...lines.slice(adjustedEndLine)];
		const updatedData = updatedLines.join("\n");

		// Overwrite the file with updated content
		await fs.writeFile(absolutePath, updatedData, "utf8");
		console.log(`Updated lines ${startLine}-${endLine} in ${absolutePath}`);

		return null;
	} catch (error) {
		console.error(`Error reading/writing code section: ${error.message}`);
		throw error;
	}
}

export default injectCodePart;
