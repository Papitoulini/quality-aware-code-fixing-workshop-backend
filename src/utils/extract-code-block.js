const extractCodeBlock = (response, originalSnippet = '') => {
	// This regex:
	// - Matches triple backticks
	// - Optionally captures the language identifier (like "ts" or "js")
	// - Captures everything (including new lines) until the next triple backticks
	// eslint-disable-next-line security/detect-unsafe-regex
	const singleBlockRegex = /```([\w+\-]*)?\s*([\S\s]*?)```/m;
	
	const match = singleBlockRegex.exec(response);
	if (!match) {
		console.warn(response)
		throw new Error("No triple-backtick code block found in LLM response");
	}
	
	// match[2] is the code snippet inside the backticks
	const snippet = match[2].trimEnd();
	
	// Optional check: compare line counts only if you really need it.
	if (originalSnippet) {
		const originalLineCount = originalSnippet.split(/\r?\n/).length;
		const snippetLineCount = snippet.split(/\r?\n/).length;
		if (originalLineCount !== snippetLineCount) {
		// Instead of throwing, you can log or warn:
			console.warn(
				`Warning: Code lines mismatch. Original = ${originalLineCount}, ` +
			`Extracted = ${snippetLineCount}`
			);
			throw new Error("Code lines mismatch");
		}
	}
	
	// // Example: "catch" (i.e., find) the location of path.resolve(...) if it exists.
	// const pathRegex = /path\.resolve\s*\(\s*["'`](.*?)["'`]\s*\)/;
	// const pathMatch = pathRegex.exec(snippet);
	// if (pathMatch) {
	// 	console.log("Found path.resolve call with argument:", pathMatch[1]);
	// }
	
	return snippet;
};
	
export default extractCodeBlock;
