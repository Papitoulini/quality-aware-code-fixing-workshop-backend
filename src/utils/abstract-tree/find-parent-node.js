import _traverse from "@babel/traverse";
import _generate from "@babel/generator";

const traverse = _traverse.default;
const generate = _generate.default;

/**
 * Helper to check if a node fully contains a (start -> end) range.
 * This checks both line and column boundaries.
 */
function nodeContainsRange(node, start, end) {
	if (!node.loc) return false;

	const { start: nodeStart, end: nodeEnd } = node.loc;

	// node.start must be <= range.start
	// node.end must be >= range.end
	if (nodeStart.line > start.line) return false;
	if (nodeEnd.line < end.line) return false;

	// If on the same line, compare columns
	if (nodeStart.line === start.line && nodeStart.column > start.column) {
		return false;
	}
	if (nodeEnd.line === end.line && nodeEnd.column < end.column) {
		return false;
	}

	return true;
}

/**
 * Computes a "size" of a node based on its line/column span.
 */
function getNodeSize(node) {
	const { start, end } = node.loc;
	const lineDiff = end.line - start.line;
	const columnDiff = end.column - start.column;
	return lineDiff * 1000 + columnDiff;
}

/**
 * Finds the smallest node fully containing the specified range, but **only** if
 * that node spans at least `minLineSpan` lines. Default is `2` (more than one line).
 * 
 * @param {object} ast - Babel AST
 * @param {object} range - { start: { line, column }, end?: { line, column } }
 * @param {number} [minLineSpan=2] - The minimum number of lines the node must span
 * @returns {object|null} An object with the path, codePart, start, and end,
 *                        or null if not found.
 */
const findParentNode = (ast, range, minLineSpan = 1) => {
	// Default `end` to the same as `start` if not provided
	const {
		start,
		end = { line: start.line, column: start.column },
	} = range;

	let smallestNodePath = null;
	let smallestNodeSize = Infinity;

	traverse(ast, {
		enter(path) {
			const { node } = path;
			if (!node.loc) return;

			// Check if this node fully contains the [start->end] range
			if (nodeContainsRange(node, start, end)) {
				// Calculate how many lines this node spans
				const nodeLineSpan = node.loc.end.line - node.loc.start.line + 1;

				// Only consider nodes that meet or exceed minLineSpan
				if (nodeLineSpan >= minLineSpan) {
					const size = getNodeSize(node);
					if (size < smallestNodeSize) {
						smallestNodeSize = size;
						smallestNodePath = path;
					}
				}
			}
		},
	});

	// If no candidate node was found, return null
	if (!smallestNodePath) {
		return null;
	}

	// Return just the smallest node that meets minLineSpan
	return {
		path: smallestNodePath,
		codePart: generate(smallestNodePath.node).code,
		start,
		end,
	};
};

export default findParentNode;