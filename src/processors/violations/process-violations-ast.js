/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";

const traverse = _traverse.default;
const generate = _generate.default;

import cycloptViolations from "../../../temp-violations.js"; // If you have a file with known rules
import queries from "./queries-ast.js"; // <-- Updated queries with arrays

import { logger } from "#logger";

// These are placeholders for your actual LLM helpers:
import { LLM, extractCodeBlock } from "#utils";

/**
 * Parse an isolated code snippet from the LLM into a Babel AST node.
 * We assume the snippet is a single top-level statement or declaration
 * (like a class, function, or variable declaration).
 */
export function parseSnippet(snippetCode) {
	const snippetAst = parse(snippetCode, {
		sourceType: "module",
		plugins: ["typescript", "jsx"],
	});

	const [firstStmt] = snippetAst.program.body;
	if (!firstStmt) {
		throw new Error("LLM snippet is empty or invalid.");
	}

	return firstStmt;
}

/**
 * Parse a file into a Babel AST with TS/JSX plugins (adjust as needed).
 */
function parseFileToAst(filePath) {
	const code = fs.readFileSync(filePath, "utf8");
	return parse(code, {
		sourceType: "module",
		plugins: ["typescript", "jsx"],
	});
}

/**
 * For each violation { filePath, line }, find which node(s) cover that line.
 */
function attachViolationsToAst(violations, fileAstInfo) {
	const augmented = [];
	
	for (const v of violations) {
		const { filePath, line } = v;
		const normViPath = path.normalize(v.filePath);
		const nodes = fileAstInfo[filePath] || null;

		if (nodes) {
			// Which nodes cover this line?
			const matches = nodes.filter((n) => line >= n.startLine && line <= n.endLine);
	
			augmented.push({
				...v,
				astNodes: matches, // Possibly an empty array if none found
			});
		}
	}

	return augmented;
}

/**
 * Identify the AST nodes we care about (class, function, arrow, etc.).
 */
export function getNodesOfInterest(ast) {
	const results = [];
	
	function addResult({ type, name, loc, path }) {
		if (!loc) return;
		results.push({
			type,
			name: name || "Anonymous",
			startLine: loc.start.line,
			endLine: loc.end.line,
			nodePath: path,
			getCode: () => generate(path.node).code,
		});
	}
	
	traverse(ast, {
		// Already existing visitors for classes, functions, etc...
	
		// A) ImportDeclaration: "import fs from 'fs';"
		ImportDeclaration(path) {
			const { loc, specifiers, source } = path.node;
			let name = "ImportDeclaration";
			if (specifiers && specifiers[0]?.local?.name) {
			// e.g. "fs" in "import fs from 'fs';"
				name += `_${specifiers[0].local.name}`;
			}
			addResult({ type: "import-declaration", name, loc, path });
		},
	
		// B) IfStatement: "if (condition) { ... }"
		IfStatement(path) {
			const { loc } = path.node;
			addResult({ type: "if-statement", name: "IfStatement", loc, path });
		},
	
		// C) ForStatement: "for (let i = 0; i < 10; i++) { ... }"
		ForStatement(path) {
			const { loc } = path.node;
			addResult({ type: "for-statement", name: "ForStatement", loc, path });
		},
	
		// D) WhileStatement
		WhileStatement(path) {
			const { loc } = path.node;
			addResult({ type: "while-statement", name: "WhileStatement", loc, path });
		},
	
		// E) ReturnStatement
		ReturnStatement(path) {
			const { loc } = path.node;
			// "return 42;" 
			// This snippet is not top-level code, so to re-parse it you might need wrapping.
			addResult({ type: "return-statement", name: "Return", loc, path });
		},
	
		// F) TSEnumDeclaration: "enum Color { Red, Green, Blue }"
		TSEnumDeclaration(path) {
			const { loc, id } = path.node;
			addResult({
				type: "ts-enum",
				name: id?.name || "AnonymousEnum",
				loc,
				path,
			});
		},
	
		// G) TSModuleDeclaration: "declare module 'foo' { ... }"
		TSModuleDeclaration(path) {
			const { loc, id } = path.node;
			let name = "AnonymousModule";
			if (id?.name) {
				name = id.name;
			}
			addResult({
				type: "ts-module",
				name,
				loc,
				path,
			});
		},
	
		// you can keep adding more visitors as needed...
	});
	
	return results;
}

/**
 * A simple function to merge incoming "violations" with known cycloptViolations.
 */
function enhanceViolations(violations = {}) {
	return Object.entries(violations).map(([id, data]) => {
		const known = cycloptViolations.find((e) => e.ruleId === id) || {};
		return { ...data, ...known };
	});
}

/**
 * Recursively gather .js/.ts files from a directory.
 * Customize or filter out node_modules if needed.
 */
function getAllJsTsFiles(dir, repositoryBasePath) {
	let results = [];
	const list = fs.readdirSync(dir);
	for (const file of list) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			// Skip node_modules or other special folders if needed
			if (!filePath.endsWith("node_modules")) {
				results = [...results, ...getAllJsTsFiles(filePath, repositoryBasePath)];
			}
		} else if (/\.(js|ts)$/.test(filePath)) {
			const normalizedPath = path.normalize(filePath);
			const relativePath = path.relative(repositoryBasePath, normalizedPath);
			// Add leading slash or backslash depending on the platform
			const formattedPath = path.sep === "\\" ? "\\" + relativePath : "/" + relativePath;
			results.push(formattedPath);
		}
	}
	return results;
}

/**
 * Main function to process violations by AST node replacement.
 * 1) Merge & flatten violations
 * 2) Parse each file => gather nodes
 * 3) Attach violations to nodes by line
 * 4) Group all violations for each node
 * 5) Ask LLM to fix the code in a single pass
 * 6) Replace node, write updated file
 */
export default async function processViolations(violations, repositoryBasePath) {
	const processOutput = [];
	const metaFilesFolderPath =  "meta-folder";
	
	if (!fs.existsSync(metaFilesFolderPath)) fs.mkdirSync(metaFilesFolderPath, { recursive: true });
	logger.info(`Violation PROCESS STARTED`);
	
	// 1) Merge data
	const enhanced = enhanceViolations(violations);
	
	// 2) Flatten out the array
	const rawViolations = [];
	for (const eV of enhanced) {
		const { files, ...rest } = eV;
		for (const f of files) {
			rawViolations.push({ ...rest, ...f });
		}
	}
	
	// 3) Group by file
	const violationsByFile = {};
	for (const v of rawViolations) {
		const { filePath } = v;
		const normalizedPath = path.normalize(filePath);
		if (!violationsByFile[normalizedPath]) {
			violationsByFile[normalizedPath] = [];
		}
		violationsByFile[normalizedPath].push({
			...v,
			filePath: normalizedPath, // Override the filePath with the normalized version
		  });
	}
	
	const allFiles = getAllJsTsFiles(repositoryBasePath, repositoryBasePath);
	
	const changedFiles = new Set();
	const outputProcessFindings = [];
	let violationCounter = 0;

	const violationsPerNodeFindings = {};
	const nodeFilesFindings = {};

	for (const filePath of allFiles) {
		if (!violationsByFile[filePath]) continue;
		console.warn(filePath)
		const absoluteFilePath = path.join(repositoryBasePath, filePath);
		// console.info(violationsByFile[filePath])
		let ast;
		try {
			ast = parseFileToAst(absoluteFilePath);
		} catch(error) {
			console.log(error.message)
			logger.error(`Could not parse file: ${absoluteFilePath}, skipping...`);
			continue;
		}

		const nodes = getNodesOfInterest(ast);

		const fileViolations = attachViolationsToAst(
			violationsByFile[filePath],
			{ [filePath]: nodes }
		);

		if (
			fileViolations.some((v) => v.astNodes.length > 0) &&
			!violationsPerNodeFindings[filePath]
		) {
			violationsPerNodeFindings[filePath] = fileViolations
				.filter((v) => v.astNodes.length > 0)
				.map(({ astNodes, ...rest }) => ({...rest, nodes: astNodes.map(({nodePath, ...rest}) =>	rest)}));
		}

		if (!nodeFilesFindings[filePath]) nodeFilesFindings[filePath] = nodes.map(({nodePath, ...rest}) =>	rest);

	}

	fs.writeFileSync(
		path.join(metaFilesFolderPath, "violations-nodeFilesFindings.json"),
		JSON.stringify(nodeFilesFindings, null, 2)
	);
	
	fs.writeFileSync(
		path.join(metaFilesFolderPath, "violations-violationsPerNodeFindings.json"),
		JSON.stringify(violationsPerNodeFindings, null, 2)
	);
	
	// for (const filePath of allFiles) {
	// 	if (!violationsByFile[filePath]) {
	// 		continue;
	// 	}
	
	// 	logger.info(`Parsing file: ${filePath}`);
	// 	let ast;
	// 	try {
	// 		ast = parseFileToAst(filePath);
	// 	} catch {
	// 		logger.error(`Could not parse file: ${filePath}, skipping...`);
	// 		continue;
	// 	}
	
	// 	const nodes = getNodesOfInterest(ast);
	
	// 	// Attach line-based violations to these nodes
	// 	const fileViolations = attachViolationsToAst(
	// 		violationsByFile[filePath],
	// 		{ [filePath]: nodes }
	// 	);
	
	// 	// Group by node (the first node if multiple) + ruleId
	// 	// e.g., a Map of { nodePath => { ruleId => Array<violations> } }
	// 	const nodeGroups = new Map();
	
	// 	for (const violation of fileViolations) {
	// 		const { astNodes, ruleId } = violation;
	// 		if (astNodes.length === 0) {
	// 		// No matching node
	// 			continue;
	// 		}
	// 		// We'll assume the first node if multiple
	// 		const nodeObj = astNodes[0];
	// 		const nodeKey = nodeObj.nodePath;
	
	// 		if (!nodeGroups.has(nodeKey)) {
	// 			nodeGroups.set(nodeKey, new Map());
	// 		}
	
	// 		const ruleMap = nodeGroups.get(nodeKey);
	// 		if (!ruleMap.has(ruleId)) {
	// 			ruleMap.set(ruleId, []);
	// 		}
	
	// 		ruleMap.get(ruleId).push(violation);
	// 	}
	
	// 	// We'll create an LLM instance for each file (or reuse one overall)
	// 	const llm = await LLM();
	
	// 	// For each node => for each rule => fix
	// 	for (const [_, ruleMap] of nodeGroups.entries()) {
	// 		for (const [ruleId, violationsForNodeRule] of ruleMap.entries()) {
	// 			violationCounter++;
	
	// 			// Collect the lines for these violations
	// 			const lines = violationsForNodeRule.map((v) => v.line);
	// 			// All these share the same ruleId by definition
	// 			const ruleIds = [ruleId]; // or if you like, you can pass just the single
	
	// 			// Summaries
	// 			const lineSummary = lines.join(", ");
	// 			logger.info(
	// 				`[Violation #${violationCounter}] file: ${filePath} lines: ${lineSummary}, ruleId: ${ruleId}`
	// 			);
	
	// 			// Provide array of violations to initConversation
	// 			await llm.sendMessage(queries.initConversation(violationsForNodeRule), true);
	
	// 			let attemptsUsed = 0;
	// 			const maxAttempts = 3;
	// 			let success = false;
	
	// 			// The actual node object is in the first violation's astNodes[0]
	// 			// (They all share the same node by grouping)
	// 			const nodeObj = violationsForNodeRule[0].astNodes[0];
	// 			const snippetToFix = nodeObj.getCode();
	
	// 			while (attemptsUsed < maxAttempts && !success) {
	// 				attemptsUsed++;
	// 				try {
	// 					const fixPrompt = queries.askToResolveViolations(
	// 						snippetToFix,
	// 						lines,			// array of line numbers
	// 						ruleIds,		// single-element array of ruleId
	// 						"TypeScript"
	// 					);
	
	// 					const response = await llm.sendMessage(fixPrompt);
	// 					const fixedSnippet = extractCodeBlock(response, snippetToFix);
	// 					const newNode = parseSnippet(fixedSnippet);
	
	// 					nodeObj.nodePath.replaceWith(newNode);
	
	// 					success = true;
	// 					changedFiles.add(filePath);
	
	// 					// Log success for each violation
	// 					for (const viol of violationsForNodeRule) {
	// 						outputProcessFindings.push({
	// 							ruleId,
	// 							filePath,
	// 							line: viol.line,
	// 							attempts: attemptsUsed,
	// 							snippetFound: true,
	// 						});
	// 					}
	// 				} catch (error) {
	// 					logger.error(
	// 						`LLM fix attempt #${attemptsUsed} for node in file ${filePath}, rule ${ruleId} failed: ${error.message}`
	// 					);
	// 					if (attemptsUsed === maxAttempts) {
	// 						// Log failure for each violation
	// 						for (const viol of violationsForNodeRule) {
	// 							outputProcessFindings.push({
	// 								ruleId,
	// 								filePath,
	// 								line: viol.line,
	// 								attempts: attemptsUsed,
	// 								snippetFound: false,
	// 							});
	// 						}
	// 					}
	// 				}
	// 			} // end while
	// 		} // end ruleMap
	// 	} // end nodeGroups
	
	// 	// If this file changed, rewrite
	// 	if (changedFiles.has(filePath)) {
	// 		const { code: finalCode } = generate(ast);
	// 		fs.writeFileSync(filePath, finalCode, "utf8");
	// 		logger.info(`Updated file: ${filePath}`);
	// 	}
	// }
	
	// Summaries
	fs.writeFileSync(
		path.join(metaFilesFolderPath, "violations-outputProcessFindings.json"),
		JSON.stringify(outputProcessFindings, null, 2)
	);
	
	logger.info(`Done processing. Total changed files: ${changedFiles.size}`);
	return changedFiles;
}
