const extractCodeBlock = (response, originalSnippet) => {
	const singleBlockRegex = /```[\dA-Za-z]*\s*[\n\r]+([\S\s]*?)```/;
	const match = singleBlockRegex.exec(response);
	if (!match) throw new Error("No triple-backtick code block found in LLM response");
	// match[1] is the code snippet inside the backticks
	const snippet = match[1].trimEnd();

	const originalLineCount = originalSnippet.split(/\r?\n/).length;
	const snippetLineCount = snippet.split(/\r?\n/).length;
	if (originalLineCount !== snippetLineCount) throw new Error("Code lines mismatch")

	return snippet;
}

export default extractCodeBlock;