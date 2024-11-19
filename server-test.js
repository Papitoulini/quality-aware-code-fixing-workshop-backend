import fs from "node:fs";
import path from "node:path";

import { getCodeSection, PythonBackend, generateMarkdownTree, generateDirectoryTreeJSON, formatJSONWithLineBreaks } from "#utils";

const repoFolderPath = "C:\\Users\\panpa\\Desktop\\thesis-vol-2\\thesis\\backend-node\\tmp\\bf7918d73f57789adf9dab28dd2f7c50bf791";
const findingsFileName = "findings.json";
const reposiotryName = "cross-git";
const findingsFilePath = path.join(repoFolderPath, findingsFileName);
const repositoryBasePath = path.join(repoFolderPath, reposiotryName);
const unParsedFindings = fs.readFileSync(findingsFilePath);
const { clones: { code_clones: codeClones } } = JSON.parse(unParsedFindings);
console.log(codeClones);

try {
	for (const clone of codeClones) {
		const parsedClone = {
			...clone,
			files: await Promise.all(clone.files.map(async (cC) => {
				const { filePath, start_line: sL, end_line: eL } = cC;
				const startLine = parseInt(sL, 10);
				const endLine = parseInt(eL, 10);
				const absoluteFilePath = path.join(repositoryBasePath, filePath);
				const codePart = await getCodeSection(absoluteFilePath, startLine, endLine);
				return { ...cC, codePart };
			})),
		};

		const formattedJSON = formatJSONWithLineBreaks(parsedClone, 80);
		fs.writeFileSync("thesis/backend-node/clones.json", formattedJSON, "utf8");
		const codeTree = generateMarkdownTree(repositoryBasePath);
		console.log(codeTree);

		// const messages = [
		// 	{ role: "user", message: "Hello, my name is george how are you?" },
		// 	{ role: "assistant", message: "I'm fine, thank you." },
		// 	{ role: "user", message: "What's the weather like today?" },
		// ];

		// 'gpt': self._gpt_api,
		// 'llama': self._llama_api,
		// 'claude': self._claude_api

		// const pythonBackend = await PythonBackend();
		// const { body: unparsedResponse } = await pythonBackend.post("send_message", {
		// 	json: { messages, model: "claudi" },
		// });

		// const { response: chatResponse } = JSON.parse(unparsedResponse);
	}
} catch (error) {
	console.log(error);
}
