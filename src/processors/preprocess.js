/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-sync */
import fs from "node:fs";
import path from "node:path";

import { models } from "#dbs";
import { getAnalysisFolderFile, getCloudAnalysis, constructAuthUrl, Github } from "#utils";

const { Analysis, Commit } = models;

const { GITHUB_TOKEN } = process.env;

const preprocess = async (sha) => {

	const token = GITHUB_TOKEN;
	const {
		_id: commitId,
		// repositories: [{ owner, name, productionBranch, addedBy: { _id: userId, github: { token }, username } }],
		repositories: [{ owner, name, productionBranch, addedBy: { _id: userId, username }, language }],
	} = await Commit.findOne({ hash: sha })
		.populate({
			path: "repositories",
			select: "owner name providerId addedBy productionBranch language",
			populate: { path: "addedBy", model: "User", select: "_id username github" },
		})
		.select("_id files createdAt") // Selecting top-level fields
		.lean();

	console.group("General Info:");
	console.log("commitID", commitId);
	console.log("owner", owner);
	console.log("name", name);
	console.log("hash", sha);
	console.log("userId", userId);
	console.log("username", username);
	console.groupEnd();

	const analysis = await Analysis.findOne({ commit: commitId, language, pending: true }).lean();

	const authUrl = constructAuthUrl(token, owner, name);
	const localPath = path.resolve("tmp", analysis.internalId);
	const localRepoPath = path.resolve(localPath, name);
	const findingsPath = path.resolve(localPath, "findings");

	const repoPaths = [localRepoPath, findingsPath];

	console.group("Contracted Paths:");
	console.log("authUrl", authUrl);
	console.log("localPath", localPath);
	console.log("repoPaths", repoPaths);
	console.groupEnd();

	const github = Github(token, authUrl, localRepoPath);

	if (!fs.existsSync(localRepoPath)) await github.cloneRepo(productionBranch);

	if (!fs.existsSync(findingsPath))  {
		fs.mkdirSync(findingsPath);
		const [
			{ content: clones },
			{ content: { findings: vulnerabilities } },
			{ content: { sast } },
			analysisResults,
		] = await Promise.all([
			getAnalysisFolderFile(analysis, "clones.json"),
			getAnalysisFolderFile(analysis, "vulnerabilities.json"),
			getAnalysisFolderFile(analysis, "sast.json", { ignoreInternalId: true }),
			getCloudAnalysis(analysis, { isMaintainabilityPal: true, violations: true }),
		]);
		console.log(sast);

		const findings = { analysis, clones, vulnerabilities, analysisResults };

		for (const [key, value] of Object.entries(findings)) {
			fs.writeFileSync(path.resolve(findingsPath, `${key}.json`), JSON.stringify(value, null, 2));
		}
	}

	const githubOptions = {
		owner,
		repo: name,
		token,
		authUrl,
		productionBranch,
	}

	return { repoPaths, githubOptions }
}

export default preprocess;
