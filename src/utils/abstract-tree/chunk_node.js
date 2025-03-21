import { parse } from "@babel/parser";
import generate from "@babel/generator";

/**
 * Recursively chunks a single AST node if its span exceeds maxLines.
 * If the node is small enough, returns it as a single chunk.
 * If the node has a body (an array of child nodes), groups its children
 * maximally (without exceeding maxLines) and returns those chunks.
 * Otherwise, falls back to an arbitrary line-based split.
 *
 * @param {object} node - The AST node to chunk.
 * @param {string[]} codeLines - The array of code lines.
 * @param {number} maxLines - Maximum allowed lines per chunk.
 * @returns {Array<{ codePart: string, startLine: number, endLine: number }>}
 */
function chunkNode(node, codeLines, maxLines = 100) {
	const start = node.loc.start.line;
	const end = node.loc.end.line;
	const nodeLineCount = end - start + 1;

	// If the node fits within the limit, return it as a chunk.
	if (nodeLineCount <= maxLines) {
		const codePart = codeLines.slice(start - 1, end).join("\n");
		return [{ codePart, startLine: start, endLine: end }];
	}

	// If the node is too large but has children (like a BlockStatement or Program),
	// try to group its children maximally.
	if (node.body && Array.isArray(node.body) && node.body.length > 0) {
		return chunkNodes(node.body, codeLines, maxLines);
	}

	// If no further granularity is available, split arbitrarily.
	const chunks = [];
	let currentStart = start;
	while (currentStart <= end) {
		const currentEnd = Math.min(currentStart + maxLines - 1, end);
		const codePart = codeLines.slice(currentStart - 1, currentEnd).join("\n");
		chunks.push({ codePart, startLine: currentStart, endLine: currentEnd });
		currentStart = currentEnd + 1;
	}
	return chunks;
}

/**
 * Groups an array of AST nodes (assumed to be sorted by start location)
 * into as large as possible chunks that do not exceed maxLines.
 * Each chunk’s boundaries are derived from the first node’s start and the last node’s end.
 *
 * @param {object[]} nodes - Array of AST nodes.
 * @param {string[]} codeLines - The array of code lines.
 * @param {number} maxLines - Maximum allowed lines per chunk.
 * @returns {Array<{ codePart: string, startLine: number, endLine: number }>}
 */
function chunkNodes(nodes, codeLines, maxLines = 100) {
	const chunks = [];
	let currentChunkStart = nodes[0].loc.start.line;
	let currentChunkEnd = nodes[0].loc.end.line;

	for (let i = 1; i < nodes.length; i++) {
		const node = nodes[i];
		// If adding this node would still be within the allowed lines, extend the current chunk.
		if (node.loc.end.line - currentChunkStart + 1 <= maxLines) {
			currentChunkEnd = node.loc.end.line;
		} else {
			// Finalize the current chunk.
			const codePart = codeLines.slice(currentChunkStart - 1, currentChunkEnd).join("\n");
			chunks.push({ codePart, startLine: currentChunkStart, endLine: currentChunkEnd });
			// Start a new chunk with the current node.
			currentChunkStart = node.loc.start.line;
			currentChunkEnd = node.loc.end.line;
		}
	}

	// Flush the last grouping.
	const codePart = codeLines.slice(currentChunkStart - 1, currentChunkEnd).join("\n");
	chunks.push({ codePart, startLine: currentChunkStart, endLine: currentChunkEnd });
	return chunks;
}

/**
 * Splits the provided code into contiguous chunks of maximal size (up to maxLines).
 * The algorithm works at the AST level so that chunks correspond to valid code blocks.
 * If a top-level node is too big, it will be broken down recursively.
 * When concatenated in order, the chunks reassemble the original code.
 *
 * @param {string} code - The full source code to be chunked.
 * @param {number} maxLines - Maximum allowed lines per chunk (default is 100).
 * @returns {Array<{ codePart: string, startLine: number, endLine: number }>}
 */
function chunkCodeMaximal(code, maxLines = 100) {
	const codeLines = code.split(/\r?\n/);

	// Parse the code into an AST.
	const ast = parse(code, {
		sourceType: "module",
		plugins: ["jsx", "typescript"],
	});

	const chunks = [];

	// Process each top-level node.
	// We try to group adjacent nodes maximally.
	let currentGroup = [];
	for (const node of ast.program.body) {
		const nodeLineCount = node.loc.end.line - node.loc.start.line + 1;
		if (nodeLineCount > maxLines) {
			// If there's an existing group, flush it.
			if (currentGroup.length > 0) {
				chunks.push(...chunkNodes(currentGroup, codeLines, maxLines));
				currentGroup = [];
			}
			// Process the oversized node recursively.
			chunks.push(...chunkNode(node, codeLines, maxLines));
		} else {
			// Add the node to the current grouping.
			currentGroup.push(node);
			// Check if grouping them so far still fits within maxLines.
			const groupStart = currentGroup[0].loc.start.line;
			const groupEnd = currentGroup.at(-1).loc.end.line;
			if (groupEnd - groupStart + 1 > maxLines) {
				// Remove the last node from the group and flush the current group.
				const lastNode = currentGroup.pop();
				chunks.push(...chunkNodes(currentGroup, codeLines, maxLines));
				// Start a new group with the last node.
				currentGroup = [lastNode];
			}
		}
	}
	// Flush any remaining group.
	if (currentGroup.length > 0) {
		chunks.push(...chunkNodes(currentGroup, codeLines, maxLines));
	}
	return chunks;
}

export default chunkCodeMaximal;
