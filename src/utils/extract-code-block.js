/**
 * Attempts to extract a code snippet between triple backticks from the response.
 * Supports:
 *	 1) Full code block with backticks at both start & end, with optional language identifiers.
 *	 2) Partial code block with only the start or only the end backticks.
 *	 3) Fallback to the entire response if no backticks are found.
 *
 * Additionally, it handles trailing artifacts like "``` 2323" by cleaning them.
 *
 * @param {string} response - The raw response containing the code.
 * @param {string} [originalSnippet] - (Optional) The original snippet for line-count comparison.
 * @returns {string} - The extracted or fallback code snippet.
 */
const extractCodeBlock = (response, originalSnippet = '') => {
	// console.log(response, 2323); // Debugging log to inspect the raw response
	
	// Step 1: Clean trailing artifacts like "``` 2323" or similar
	// This regex looks for triple backticks possibly followed by spaces and digits at the end of the string
	const cleanedResponse = response.replace(/```[\d\s]*$/, '```');
	
	// Step 2: Attempt to extract full code block with optional language identifier
	// This regex captures:
	//	 - Group 1: Optional language identifier (e.g., TypeScript, ts, js)
	//	 - Group 2: The code content between the backticks
	const fullBlockRegex = /```([\w+\-]*)?\s*([\S\s]*?)```/;
	let match = fullBlockRegex.exec(cleanedResponse);
	
	if (match) {
		const snippet = match[2].trimEnd();
		_checkLineCount(originalSnippet, snippet);
		return snippet;
	}
	
	// Step 3: Attempt to extract code if only starting backticks are present
	const startsWithTriple = /^```([\w+\-]*)?\s*/.test(cleanedResponse);
	if (startsWithTriple) {
		// Remove the starting backticks and optional language identifier
		const snippet = cleanedResponse.replace(/^```([\w+\-]*)?\s*/, '').trim();
		console.warn("Found only starting triple backticks. Extracting from start.");
		_checkLineCount(originalSnippet, snippet);
		return snippet;
	}
	
	// Step 4: Attempt to extract code if only ending backticks are present
	const endsWithTriple = cleanedResponse.endsWith('```');
	if (endsWithTriple) {
		// Remove the ending backticks
		const snippet = cleanedResponse.replace(/```$/, '').trim();
		console.warn("Found only ending triple backticks. Extracting until end.");
		_checkLineCount(originalSnippet, snippet);
		return snippet;
	}
	
	// Step 5: Fallback to returning the entire response trimmed
	console.warn("No (full or partial) triple-backtick code block found. Returning best effort.");
	return cleanedResponse.trim();
};
	
/**
	 * (Optional) Checks if the line counts match between the original snippet and the extracted code.
	 * Throws an error if there's a mismatch.
	 *
	 * @param {string} originalSnippet - The original code snippet.
	 * @param {string} extractedSnippet - The extracted code snippet.
	 */
function _checkLineCount(originalSnippet, extractedSnippet) {
	if (!originalSnippet) return; // Only perform check if originalSnippet is provided
	
	const originalLineCount = originalSnippet.split(/\r?\n/).length;
	const snippetLineCount = extractedSnippet.split(/\r?\n/).length;
	
	if (originalLineCount !== snippetLineCount) {
		console.warn(
			`Warning: Code lines mismatch. Original = ${originalLineCount}, Extracted = ${snippetLineCount}`
		);
		throw new Error("Code lines mismatch");
	}
}
	
export default extractCodeBlock;
