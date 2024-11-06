import fs from "node:fs";
import path from "node:path";

export const generateCodeTree = (dirPath, depth = 0) => {
	const tree = {};
	const items = fs.readdirSync(dirPath, { withFileTypes: true }); // eslint-disable-line security/detect-non-literal-fs-filename, no-sync, max-len

	items.forEach((item) => {
		const fullPath = path.join(dirPath, item.name);

		if (item.isDirectory()) {
			// Recursively build the tree for the directory
			tree[item.name] = generateCodeTree(fullPath, depth + 1);
		} else if (item.isFile()) {
			// Include the file path or simply the file name
			tree[item.name] = item.name; // or you could use item.name
		}
	});

	return tree;
};

export const generateMarkdownTree = (dirPath, depth = 0) => {
	let markdown = ""; // Initialize an empty string to build the markdown representation
	const items = fs.readdirSync(dirPath, { withFileTypes: true }); // eslint-disable-line security/detect-non-literal-fs-filename, no-sync, max-len

	items.forEach((item) => {
		const indent = "  ".repeat(depth); // Indentation for each depth level
		const itemName = item.name;

		if (item.isDirectory()) {
			// Add directory name in bold
			markdown += `${indent}- **${itemName}**\n`;
			// Recursively build the markdown tree for the directory
			markdown += generateMarkdownTree(path.join(dirPath, itemName), depth + 1);
		} else if (item.isFile()) {
			// Add file name as a regular list item
			markdown += `${indent}- ${itemName}\n`;
		}
	});

	return markdown;
};
