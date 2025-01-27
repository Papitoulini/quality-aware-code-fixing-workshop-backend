import { parse } from "@babel/parser";

/**
 * Attempts to parse a code snippet directly, and falls back to wrapping in a dummy class if needed.
 * @param {string} codeString - The code snippet to parse.
 * @returns {Object} - An object containing an array of AST nodes parsed from the snippet.
 */
const parseCodeToAst = (codeString) => {
	// Try parsing without a wrapper
	const ast = parse(codeString, {
		sourceType: "module",
		plugins: [
			"typescript",					// Support for TypeScript syntax
			"jsx",								 // Support for JSX syntax (if needed)
			["decorators-legacy"], // Support for legacy decorators
			"classProperties",		 // Support for class properties (optional)
		],
	});
	return { ast };
	// } catch {
	// 	return { astNodes: null };
	// 	// If direct parsing fails, wrap the code in a dummy class
	// 	// const wrappedCode = `(${codeString})`;
	// 	// const wrappedAst = parse(wrappedCode, {
	// 	// 	sourceType: "module",
	// 	// 	plugins: ["typescript", "jsx"],
	// 	// });

	// 	// const classDeclaration = wrappedAst.program.body.find(
	// 	// 	(node) => node.type === "ClassDeclaration" && node.id.name === "Dummy"
	// 	// );

	// 	// if (!classDeclaration) {
	// 	// 	throw new Error("Failed to parse code snippet with dummy class wrapper.");
	// 	// }

	// 	// // Extract nodes from the dummy class body
	// 	// const newNodes = classDeclaration.body.body;
	// 	// return { astNodes: newNodes };
	// }
};

export default parseCodeToAst;