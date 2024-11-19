/* eslint-disable no-sync */
/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";

const defaultIgnorePatterns = [
	".git", // Ignore .git directory
	"node_modules", // Ignore node_modules directory
	/\.log$/, // Ignore all .log files
	/\.DS_Store$/, // Ignore macOS system files
	/\.git\.*/,
];

const shouldIgnore = (itemPath, ignorePatterns) => ignorePatterns.some((pattern) => {
	if (typeof pattern === "string") return itemPath.includes(pattern);
	if (pattern instanceof RegExp) return pattern.test(itemPath);
	return false;
});

export const generateMarkdownTree = (dirPath, prefix = "", ignorePatterns = defaultIgnorePatterns) => {
	let markdown = "";
	if (shouldIgnore(dirPath, ignorePatterns)) return null;
	const items = fs.readdirSync(dirPath, { withFileTypes: true });

	items.forEach((item, index) => {
		const isLastItem = index === items.length - 1;
		const connector = isLastItem ? "└── " : "├── ";
		const itemName = item.name;
		const newPrefix = prefix + (isLastItem ? "    " : "│   ");

		if (item.isDirectory()) {
		// Add directory name in bold
			const newTree = generateMarkdownTree(path.join(dirPath, itemName), newPrefix, ignorePatterns);
			markdown += newTree ? `${prefix}${connector}**${itemName}**\n${newTree}` : "";
		} else if (item.isFile()) {
		// Add file name
			markdown += `${prefix}${connector}${itemName}\n`;
		}
	});

	return markdown;
};

export const generateDirectoryTreeJSON = (dirPath, ignorePatterns = defaultIgnorePatterns) => {
	if (shouldIgnore(dirPath, ignorePatterns)) return null;

	const stats = fs.statSync(dirPath);

	const info = {
		name: path.basename(dirPath),
		path: dirPath,
		type: stats.isDirectory() ? "directory" : "file",
		size: stats.size,
		lastModified: stats.mtime.toISOString(),
	};

	if (stats.isDirectory()) {
		const children = fs.readdirSync(dirPath)
			.map((child) => generateDirectoryTreeJSON(path.join(dirPath, child), ignorePatterns))
			.filter(Boolean); // Remove null entries for ignored files/directories
		info.children = children;
	}

	return info;
};
