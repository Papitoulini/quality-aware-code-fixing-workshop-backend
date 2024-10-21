/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-sync */
import fs from "node:fs";
import path from "node:path";

import { models } from "#dbs";
import { getAnalysisFolderFile, getCloudAnalysis, constructAuthUrl, Github, getCodeSection, PythonBackend } from "#utils";

const { Analysis, Commit } = models;

const language = "JavaScript";

const analyzer = async (_, __, sha) => {
	const {
		_id: commitId,
		repositories: [{ owner, name, productionBranch, addedBy: { _id: userId, github: { token }, username } }],
		hash,
		files: [file],
	} = await Commit.findOne({ hash: sha })
		.populate({
			path: "repositories",
			select: "owner name providerId addedBy productionBranch",
			populate: { path: "addedBy", model: "User", select: "_id username github" },
		})
		.select("_id files hash createdAt") // Selecting top-level fields
		.lean();
	console.log("commitID", commitId);
	console.log("owner", owner);
	console.log("name", name);
	console.log("hash", hash);
	console.log("userId", userId);
	console.log("username", username);
	const analysis = await Analysis.findOne({ commit: commitId, language }).lean();
	const [
		{ content: clones },
		{ content: { findings: vulnerabilities } },
		analysisResults,
	] = await Promise.all([
		getAnalysisFolderFile(analysis, "clones.json"),
		getAnalysisFolderFile(analysis, "vulnerabilities.json"),
		getCloudAnalysis(analysis, { isMaintainabilityPal: true, violations: true }),
	]);

	const authUrl = constructAuthUrl(token, owner, name);
	const localPath = path.resolve("tmp", analysis.internalId);
	const localRepoPath = path.resolve(localPath, name);

	const findingsPath = path.resolve(localPath, "findings.json");

	const github = Github(token, authUrl);

	if (fs.existsSync(localRepoPath)) {
		console.log("Repo already exists");
	} else {
		await github.gitClone(productionBranch);
	}

	fs.writeFileSync(findingsPath, JSON.stringify({ analysis, clones, vulnerabilities, analysisResults }, null, 2));
	console.log("authUrl", authUrl);
	const absolutePath = path.resolve(localRepoPath, file.filename);
	const part = await getCodeSection(absolutePath, 1, 5);

	const messages = [
		{ role: "user", message: "Hello, my name is george how are you?" },
		{ role: "assistant", message: "I'm fine, thank you." },
		{ role: "user", message: "What's the weather like today?" },
	];

	const pythonBackend = await PythonBackend();
	const { body: unparsedResponse } = await pythonBackend.post("send_message", {
		json: { messages },
	});

	const { response: chatResponse } = JSON.parse(unparsedResponse);

	console.log(chatResponse);

	messages.push({ role: "assistant", message: chatResponse });
	messages.push({ role: "user", message: "What is my name?" });
	// const mes

	const { body: unparsedResponse1 } = await pythonBackend.post("send_message", {
		json: { messages },
	});

	const { response: chatResponse1 } = JSON.parse(unparsedResponse1);

	console.log("part", part);
	console.log(chatResponse1);

	return analysis;
};

export default analyzer;
