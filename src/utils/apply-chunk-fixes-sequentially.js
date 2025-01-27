import extractCodeBlock from "./extract-code-block.js";

async function applyChunkFixesSequentially(
	originalCode,
	chunkBoundaries,
	sastForPrompt,
	queries,
	llm,
) {

	// Split original code into lines
	let lines = originalCode.split(/\r?\n/);
  
	// Process chunks in ascending order of startLine
	chunkBoundaries.sort((a, b) => a.startLine - b.startLine);
  
	for (let i = 0; i < chunkBoundaries.length; i++) {
		let { codePart, startLine, endLine } = chunkBoundaries[i];

		const chunkSastForPrompt = sastForPrompt.filter(({ lines }) => {
			return lines.some(({ start, end }) => {
				return start.line >= startLine && end.line <= endLine;
			});
		}).map(({ lines, ...rest }) => {
			return { ...rest, lines: lines.map(({ start, end }) => {
				return { start: {...start, line: start.line - startLine}, end: { ...end, line: end.line - endLine } };
			})};
		});
  
		// Validate bounds
		if (startLine < 1) startLine = 1;
		if (endLine > lines.length) endLine = lines.length;
		if (startLine > endLine) {
			continue;
		}
  
		// Extract the chunk text from the current lines
		const chunkOriginalText = lines.slice(startLine - 1, endLine).join('\n');
  
		// Call your LLM to process this chunk
		// The prompt can include chunkOriginalText plus any relevant metadata about vulnerabilities
		// Example prompt generation — adjust as needed
		const response = await llm.sendMessage(
			queries.generateSASTFixTask(codePart, chunkSastForPrompt),
			// true,
		);
  
		// Extract the code snippet from the LLM's response (or fallback to original)
		const snippet = extractCodeBlock(response) || chunkOriginalText;
  
		// Convert snippet to lines
		const snippetLines = snippet.split(/\r?\n/);
  
		// Replace the original chunk lines with the snippet lines in-place
		const oldChunkSize = endLine - startLine + 1; // how many lines we're replacing
		lines.splice(startLine - 1, oldChunkSize, ...snippetLines);
  
		// Determine if the snippet expanded/contracted the line count
		const sizeDiff = snippetLines.length - oldChunkSize;

        console.log(startLine, endLine, snippetLines.length, oldChunkSize, sizeDiff);
  
		// Shift subsequent chunk boundaries if there's a size difference
		if (sizeDiff !== 0) {
			for (let j = i + 1; j < chunkBoundaries.length; j++) {
				chunkBoundaries[j].startLine += sizeDiff;
				chunkBoundaries[j].endLine += sizeDiff;
			}
		}
	}
  
	// Return the merged content
	return lines.join('\n');
}

export default applyChunkFixesSequentially;
