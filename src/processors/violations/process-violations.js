/* eslint-disable security/detect-non-literal-fs-filename */
import path from "node:path";
import cycloptViolations from "../../../temp-violations.js";
import fs from "node:fs";

import queries from "./queries.js";
import { getCodeSection, PythonBackend, injectCodePart, MODEL } from "#utils";

const processViolations = async (violations, repositoryBasePath) => {
	const changedFiles = new Set();

	const enhancedViolations = Object.entries(violations || {}).map(([id, data]) => {	
		const v = cycloptViolations.find((e) => e.ruleId === id) || {};
		return { ...data, ...v };
	});

	for (const violation of enhancedViolations.slice(0,1)) {
		const { files, ...restViolationProps } = violation;
		const groupedFiles = files.reduce((acc, file) => {
			if (!acc[file.filePath]) acc[file.filePath] = [];
			acc[file.filePath].push(file.line);
			return acc;

		}, {});

		for (const [filePath, lines] of Object.entries(groupedFiles).slice(0,1)) {

			lines.sort();
			const startLine = lines[0];
			const endLine = lines.at(-1);
			const absoluteFilePath = path.join(repositoryBasePath, filePath);
			const { offset, part: codePart } = await getCodeSection(absoluteFilePath, startLine, endLine);
			const normalizedLines = lines.map((line) => line - offset);

			const questions = [
				queries.initConversation(),
				queries.addViolationInfo(restViolationProps),
				queries.askToResolveViolations(codePart, normalizedLines),
			];

			for (const [index, question] of questions.entries()) {
				fs.writeFileSync(`server-test/questions/${index}.md`, question, "utf8");
			}
    
			const pythonBackend = await PythonBackend();
			if (!fs.existsSync(`server-test/${MODEL}`)) {
				fs.mkdirSync(`server-test/${MODEL}`, { recursive: true });
			}

			const messages = [];
    
			for (const [index, question] of questions.entries()) {
				messages.push({ role: "user", message: question });
				const { body: unparsedResponse } = await pythonBackend.post("send_message", {
					json: { messages: messages, model: MODEL },
				});
				const { response } = JSON.parse(unparsedResponse);
				messages.push({ role: "assistant", message: response });
				if (index === 2) {
					const snippetOnly = response.replaceAll(
						/```\r?\n\w*\s*([\S\s]*?)```/g,
						"$1"
					).trim();
					await injectCodePart(absoluteFilePath, startLine, endLine, snippetOnly);
					// Mark this file as changed
					changedFiles.add(filePath);
				}

				fs.writeFileSync(`server-test/${MODEL}/${index}.md`, response, "utf8");	
			}
		}
	}

	return changedFiles;

}

export default processViolations;
