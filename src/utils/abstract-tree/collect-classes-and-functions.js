// gatherRepoClasses.js
import path from "node:path";
import fs from "node:fs";
import { parseFileForClassesAndFunctions } from "./parse-file-for-classes.js";

function getAllJsTsFiles(dir) {
	// E.g. a simple sync recursion.
	// Real-world usage: handle ignoring node_modules, etc.
	let results = [];
	const list = fs.readdirSync(dir);
	for (const file of list) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			results = [...results, ...getAllJsTsFiles(filePath)];
		} else if (/\.(js|ts)$/.test(filePath)) {
			results.push(filePath);
		}
	}
	return results;
}

/**
 * Collect metadata for all classes and functions across the repo.
 *
 * @param {string} repositoryBasePath
 * @returns {Object} 
 *   E.g. {
 *     [absoluteFilePath]: [
 *       { type, name, startLine, endLine, totalLines, ... },
 *       ...
 *     ],
 *     ...
 *   }
 */
export default function collectClassesAndFunctions(repositoryBasePath) {
	const filePaths = getAllJsTsFiles(repositoryBasePath);
	const fileAstInfo = {};

	for (const filePath of filePaths) {
		try {
			const data = parseFileForClassesAndFunctions(filePath);
			fileAstInfo[filePath] = data;
		} catch (error) {
			// You might want to log an error or skip problematic files
			console.warn(`Failed to parse file ${filePath}`, error.message);
			fileAstInfo[filePath] = [];
		}
	}

	return fileAstInfo;
}
