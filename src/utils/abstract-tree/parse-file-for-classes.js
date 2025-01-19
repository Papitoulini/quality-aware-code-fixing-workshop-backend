// parseFileForClasses.js
import fs from "node:fs";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

/**
 * Parse the given file to extract information about classes and functions.
 *
 * @param {string} filePath - Absolute path to a JS/TS file
 * @returns {Array} - An array of objects like:
 *   [
 *       {
 *         type: 'class' | 'function',
 *         name: string,
 *         startLine: number,
 *         endLine: number,
 *         totalLines: number,
 *         // ...any other useful properties
 *       },
 *       ...
 *   ]
 */
export function parseFileForClassesAndFunctions(filePath) {
	const code = fs.readFileSync(filePath, "utf8");

	// Adjust the parser config to match your use case
	const ast = parse(code, {
		sourceType: "module",
		plugins: [
			// Add as needed. For TS code, for instance:
			"typescript",
			// For React/JSX code:
			"jsx",
		],
	});

	const collected = [];

	traverse(ast, {
		// Capture class declarations (ES6 `class Foo {}`)
		ClassDeclaration(path) {
			const { loc, id } = path.node;
			// Some class declarations might not have an `id` if anonymous.
			const name = id?.name || "AnonymousClass";

			collected.push({
				type: "class",
				name,
				startLine: loc.start.line,
				endLine: loc.end.line,
				totalLines: loc.end.line - loc.start.line + 1,
			});
		},

		// Capture function declarations (e.g., `function bar() {}`)
		FunctionDeclaration(path) {
			const { loc, id } = path.node;
			const name = id?.name || "AnonymousFunction";

			collected.push({
				type: "function",
				name,
				startLine: loc.start.line,
				endLine: loc.end.line,
				totalLines: loc.end.line - loc.start.line + 1,
			});
		},

		// You might want to track arrow functions assigned to variables or
		// object methods, etc. That can get more advanced.
	});

	return collected;
}
