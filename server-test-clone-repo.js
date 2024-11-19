/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-sync */
import "dotenv/config.js";
import fs from "node:fs";
import path from "node:path";

import { models, init } from "#dbs";
import { getAnalysisFolderFile, getCloudAnalysis, constructAuthUrl, Github } from "#utils";

const { Analysis, Commit } = models;

const language = "JavaScript";

const { GITHUB_TOKEN } = process.env;

const cloneRepo = async (_, __, sha) => {
	let analysis = {};
	try {
		const token = GITHUB_TOKEN;
		const {
			_id: commitId,
			// repositories: [{ owner, name, productionBranch, addedBy: { _id: userId, github: { token }, username } }],
			repositories: [{ owner, name, productionBranch, addedBy: { _id: userId, username } }],
			hash,
		} = await Commit.findOne({ hash: sha })
			.populate({
				path: "repositories",
				select: "owner name providerId addedBy productionBranch",
				populate: { path: "addedBy", model: "User", select: "_id username github" },
			})
			.select("_id files hash createdAt") // Selecting top-level fields
			.lean();

		console.group("General Info:");
		console.log("commitID", commitId);
		console.log("owner", owner);
		console.log("name", name);
		console.log("hash", hash);
		console.log("userId", userId);
		console.log("username", username);
		console.groupEnd();

		analysis = await Analysis.findOne({ commit: commitId, language }).lean();
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
		const findingsPath = path.resolve(localPath, "findings");

		console.group("Contracted Paths:");
		console.log("authUrl", authUrl);
		console.log("localPath", localPath);
		console.log("localRepoPath", localRepoPath);
		console.log("findingsPath", findingsPath);
		console.groupEnd();

		const github = Github(token, authUrl, localRepoPath);

		if (!fs.existsSync(localRepoPath)) await github.gitClone(productionBranch);
		fs.writeFileSync(path.resolve(localPath, "analysis.json"), JSON.stringify({ analysis }, null, 2));
		fs.writeFileSync(path.resolve(localPath, "clones.json"), JSON.stringify({ clones }, null, 2));
		fs.writeFileSync(path.resolve(localPath, "vulnerabilities.json"), JSON.stringify({ vulnerabilities }, null, 2));
		fs.writeFileSync(path.resolve(localPath, "analysisResults.json"), JSON.stringify({ analysisResults }, null, 2));
	} catch (error) {
		console.log(error);
	}

	return analysis;
};

const db = await init();
const analysis = await cloneRepo(null, null, "274d99ed8c0f2421a0ede8dcdfd5c7a6f0783813");

console.log("test:", analysis);
await db.disconnect();
