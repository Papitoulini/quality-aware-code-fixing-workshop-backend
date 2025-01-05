/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-sync */
import fs from "node:fs";
import path from "node:path";

import { models } from "#dbs";
import { getAnalysisFolderFile, getCloudAnalysis, constructAuthUrl, Github } from "#utils";
import { logger } from "#logger";

const { Analysis, Commit } = models;

const { GITHUB_TOKEN } = process.env;

const preprocess = async (sha) => {
	try {
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

		logger.info(`General Info: ${JSON.stringify({commitId, owner, name, sha, userId, username}, null, 2)}`);

		const analysis = await Analysis.findOne({ commit: commitId, language, pending: true }).lean();

		const authUrl = constructAuthUrl(token, owner, name);
		const localPath = path.resolve("tmp", analysis.internalId);
		const localRepoPath = path.resolve(localPath, name);
		const findingsPath = path.resolve(localPath, "findings");

		const repoPaths = [localRepoPath, findingsPath];

		logger.info(`Contracted Paths: ${JSON.stringify({authUrl, localPath, repoPaths}, null, 2)}`);

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

			const findings = { analysis, clones, vulnerabilities, analysisResults, sast };

			for (const [key, value] of Object.entries(findings)) {
				fs.writeFileSync(path.resolve(findingsPath, `${key}.json`), JSON.stringify(value, null, 2));
			}
		}

		const githubOptions = { owner, repo: name, token, authUrl, productionBranch }
		logger.info(`Github Options: ${JSON.stringify(githubOptions, null, 2)}`);

		return { repoPaths, githubOptions }
	} catch (error) {
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
}

export default preprocess;
