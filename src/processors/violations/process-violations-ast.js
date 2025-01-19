/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import cycloptViolations from "../../../temp-violations.js"; // TO_DO get from cyclopt

import queries from "./queries.js";
import { LLM, extractCodeBlock, parseFileToAST, findParentNode, parseCodeToAST	} from "#utils";
import { logger } from "#logger";

import _generate from "@babel/generator";

const generate = _generate.default;

const enhanceViolations = (violations = {}) => {
	return Object.entries(violations).map(([id, data]) => {
		const v = cycloptViolations.find((e) => e.ruleId === id) || {};
		return { ...data, ...v };
	});
};
	
const mapViolationsToASTNodes = (ast, violations = {}) => {
	const mappedViolations = {};
	
	for (const [ruleId, ruleData] of Object.entries(violations)) {
		const uniqueLines = [...new Set(ruleData.lines)].sort(); // Remove duplicates
		for (const lineNumber of uniqueLines) {
		// Use column-aware findParentNode. Column=0 as a baseline if you only have line info.
			const mappedNode = findParentNode(ast, {
				start: { line: lineNumber, column: 0 },
			});
	
			if (mappedNode) {
				if (!mappedViolations[ruleId]) mappedViolations[ruleId] = [];
				mappedViolations[ruleId].push({
					line: lineNumber,
					path: mappedNode.path,
					codePart: mappedNode.codePart,
				});
			} else {
				logger.warn(
					`No enclosing AST node found for rule "${ruleId}" at line ${lineNumber}`
				);
			}
		}
	}
	
	return mappedViolations;
};
	
function groupViolationsByFile(violations = []) {
	const grouped = {};
	
	for (const violation of violations) {
		for (const file of violation.files) {
			const { filePath, line } = file;
			if (!grouped[filePath]) {
				grouped[filePath] = {};
			}
			if (!grouped[filePath][violation.ruleId]) {
				grouped[filePath][violation.ruleId] = {
					lines: [],
					explanation: violation.explanation,
					category: violation.category,
					title: violation.title,
					severity: violation.severity,
					language: violation.language,
					badExample: violation.badExample,
					goodExample: violation.goodExample,
					description: violation.description,
				};
			}
			grouped[filePath][violation.ruleId].lines.push(line);
		}
	}
	
	return grouped;
}
	
/**
	 * Injects the fixed code back into the specified file.
	 * @param {string} filePath - The path to the target file.
	 * @param {string} fixedCode - The complete fixed code to write to the file.
	 */
export const injectCodePart = async (filePath, fixedCode) => {
	try {
		// Overwrite the file with the updated code
		await writeFile(filePath, fixedCode, "utf8");
		logger.info(`Injected fixed code into ${filePath}`);
	} catch (error) {
		logger.error(`Error injecting code into ${filePath}: ${error.message}`);
		throw error;
	}
};
	
const processViolations = async (violations, repositoryBasePath) => {
	try {
		const changedFiles = new Set();
	
		// Merge violation data with known cycloptViolations
		const enhancedViolations = enhanceViolations(violations);
		const groupedViolationsPerFile = groupViolationsByFile(enhancedViolations);
	
		// Example: only process first 3 files
		for (const [filePath, fileViolationsMap] of Object.entries(
			groupedViolationsPerFile
		)) {
			try {

				logger.info(`Violations: Processing file ${filePath}`);
				const absoluteFilePath = path.join(repositoryBasePath, filePath);
				const { ast, code } = await parseFileToAST(absoluteFilePath);
	
				const mappedViolations = mapViolationsToASTNodes(ast, fileViolationsMap);
	
				// Count total lines across all rules in this file (for logging)
				const fileViolations = Object.values(fileViolationsMap).reduce(
					(acc, v) => acc + v.lines.length,
					0
				);
				let fileViolationsFixes = 0;
	
				// Example: only fix first 2 rules
				for (const [ruleId, violation] of Object.entries(fileViolationsMap)) {
					const lines = mappedViolations[ruleId] || [];
					if (lines.length === 0) continue;
					const llm = await LLM();
					await llm.sendMessage(queries.initConversation(violation), true);
					logger.info( `Violation type: ${fileViolationsFixes} of ${fileViolations}` );
	
					// Example: only fix the first instance of that rule
					for (const { codePart, path: astPath, line } of lines) {
						let retries = 5;
						let fixedCode = null;
						let fixedASTNodes = null;

						console.log("***************************************************")
						console.log("*******************-", filePath, "**********************")
						console.log("*******************-", line,"-*******************")
						console.log("Current Code Part:", codePart)
						console.log("***************************************************")
						console.log("***************************************************")

						const codePartLines = codePart.split("\n").length;
						if (codePartLines > 80) {
							console.log("Skipping code part as it exceeds 80 lines.");
							continue;
						}				
					
						while (retries-- > 0 && !fixedCode && !fixedASTNodes) {
							try {
								const response = await llm.sendMessage(
									queries.askToResolveViolations(codePart)
								);
								fixedCode = extractCodeBlock(response);
								const { astNodes } = parseCodeToAST(fixedCode);
								console.log("astNodes:", !!astNodes, 333);
	
								if (astNodes) {
									fixedASTNodes = astNodes;
									break;
								}
							} catch (error) {
								console.log(error);
								logger.error(`Error llm communication: ${error.message}`);
							}
						}
	
						try {
							if (fixedASTNodes) {
								astPath.replaceWithMultiple(fixedASTNodes);
								fileViolationsFixes++;
							} else {
								logger.warn("Failed to obtain valid fixed code after retries.");
							}

						} catch (error) {
							console.log(error);
							logger.error(`Error writing code. ${error.message}`);
						}
					}
				}
	
				// Generate the final code with all transformations
				const outputCode = generate(ast, {}, code).code;
				await injectCodePart(absoluteFilePath, outputCode);
				changedFiles.add(filePath);
			} catch(error) { logger.error(`Error during preprocess: ${error.message}`)}
		}
	
		console.log(changedFiles);
		return changedFiles;
	} catch (error) {
		console.log(error);
		logger.error(`Error during preprocess: ${error.message}`);
		// throw error;
	}
};

export default processViolations;