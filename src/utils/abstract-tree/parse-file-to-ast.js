/* eslint-disable security/detect-non-literal-fs-filename */
import { parse } from "@babel/parser";
import fs from "node:fs/promises";

// Function to parse code into AST
const parseFileToAST = async (filePath) => {
	const code = await fs.readFile(filePath, "utf8");
	const ast = parse(code, {
		sourceType: "unambiguous",
		plugins: ["typescript", "jsx"], // Add other plugins as needed
	});
	return { ast, code };
};

export default parseFileToAST;