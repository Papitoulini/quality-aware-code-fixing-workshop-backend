/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs/promises";

import { logger }  from "#logger";
import { CODE_SNIPPET_MARGIN }  from "#utils";

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
async function injectCodePart(absolutePath, newCode, startLine = null, endLine = null) {
	try {
		if (!absolutePath) {
			console.error("No file path provided.");
			return null;
		}

		if (!startLine && !endLine) {
			await fs.writeFile(absolutePath, newCode, "utf8");
			return null;
		}

		// Read file
		const data = await fs.readFile(absolutePath, "utf8");
		const lines = data.split(/\r?\n/);
		// If no `newCode` is given, just return the specified lines (original behavior)
		if (!newCode) return null;

		// Otherwise, we are writing/replacing lines in-place:
		const adjustedStartLine = Math.max(0, Number(startLine) - CODE_SNIPPET_MARGIN); // Start of context section
		const adjustedEndLine = Math.min(lines.length, Number(endLine) + CODE_SNIPPET_MARGIN); // End of context section
		// Split newCode into array of lines for insertion
		const newLines = newCode.split(/\r?\n/);

		// Construct updated file content
		const updatedLines = [...lines.slice(0, adjustedStartLine), ...newLines, ...lines.slice(adjustedEndLine)];
		const updatedData = updatedLines.join("\n");

		// Overwrite the file with updated content
		await fs.writeFile(absolutePath, updatedData, "utf8");
		logger.info(`|===> Updated lines ${startLine}-${endLine} in ${absolutePath}`);

	} catch (error) {
		logger.error(`Error during "injecting" code section from local repo: ${error.message}`);
	}
}

export default injectCodePart;
