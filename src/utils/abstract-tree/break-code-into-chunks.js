import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default;

/**
 * Breaks code into chunks of approximately targetSize lines, 
 * ensuring top-level statements (like functions) are not split across chunks.
 * Each chunk is returned with its start and end line numbers (1-based),
 * and chunks do not overlap in line ranges.
 * 
 * @param {string} code - The full source code to split.
 * @param {number} targetSize - Approximate maximum number of lines per chunk.
 * @returns {Array} - An array of chunk objects:
 *   [{
 *     codePart: string,        // The chunked source code lines joined by newline
 *     length: number,          // Number of top-level nodes in this chunk
 *     startLine: number,       // 1-based inclusive starting line of this chunk in the original file
 *     endLine: number          // 1-based inclusive ending line of this chunk in the original file
 *   }, ...]
 */
function breakCodeIntoChunks(code, targetSize) {
	// 1. Parse the code into an AST.
	let ast;
	try {
		ast = parse(code, {
			sourceType: 'module',
			plugins: ['typescript', 'jsx'] // add other plugins if needed (decorators, etc.)
		});
	} catch (error) {
		console.error('Error parsing code:', error);
		return [];
	}

	// 2. Collect top-level nodes with their location info (start/end lines).
	const topLevelNodes = [];
	traverse(ast, {
		Program(path) {
			for (const node of path.node.body) {
				if (node.loc) {
					topLevelNodes.push({
						start: node.loc.start.line, // 1-based
						end: node.loc.end.line,     // 1-based
						node
					});
				}
			}
		}
	});

	// Sort nodes by ascending start line (should already be in order, but just to be safe).
	topLevelNodes.sort((a, b) => a.start - b.start);

	// 3. We'll build chunks by grouping top-level nodes until we reach ~targetSize lines.
	const lines = code.split(/\r?\n/);
	const chunks = [];
	let currentChunkStartLine = 1;
	let currentChunkNodes = [];

	for (const topLevelNode of topLevelNodes) {
		const { start, end } = topLevelNode;
		const nodeLineCount = end - start + 1;

		// Calculate how many lines are currently in the chunk
		const currentChunkLineCount = currentChunkNodes.length > 0
			? currentChunkNodes.at(-1).end - currentChunkStartLine + 1
			: 0;

		// If adding this node would exceed targetSize and we already have nodes in the current chunk:
		// finalize the current chunk before adding this new node.
		if ((currentChunkLineCount + nodeLineCount) > targetSize && currentChunkNodes.length > 0) {
			// The chunk ends at the end line of the last node in the chunk
			const previousNode = currentChunkNodes.at(-1);
			const chunkEndLine = previousNode.end;

			// Extract the lines for this chunk
			const chunkLines = lines.slice(currentChunkStartLine - 1, chunkEndLine);
			chunks.push({
				codePart: chunkLines.join('\n'),
				length: currentChunkNodes.length,
				startLine: currentChunkStartLine,
				endLine: chunkEndLine
			});

			// Start a new chunk from the current node
			currentChunkNodes = [];
			currentChunkStartLine = start;
		}

		// Now add the current node to the chunk (which might be newly started or continued)
		currentChunkNodes.push(topLevelNode);
	}

	// 4. If there are remaining nodes in the current chunk after the loop, finalize that chunk.
	if (currentChunkNodes.length > 0) {
		const lastNode = currentChunkNodes.at(-1);
		const chunkEndLine = lastNode.end;
		const chunkLines = lines.slice(currentChunkStartLine - 1, chunkEndLine);
		chunks.push({
			codePart: chunkLines.join('\n'),
			length: currentChunkNodes.length,
			startLine: currentChunkStartLine,
			endLine: chunkEndLine
		});
	}

	return chunks;
}

export default breakCodeIntoChunks;
