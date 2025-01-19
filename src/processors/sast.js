/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { processSast } from "./sast/index.js"; 
import { Github, MODEL, ATTEMPT } from "#utils";
import { logger } from "#logger";

const runSast = async (repoPaths, githubOptions) => {
	try {
		const { token, authUrl, productionBranch } = githubOptions;
		const newBranch = `${MODEL}-${ATTEMPT}-sast-fixes`;
		const [localRepoPath, findingsPath] = repoPaths;

		const sastFindingsPath = path.resolve(findingsPath, "sast.json");
		const sast = JSON.parse(fs.readFileSync(sastFindingsPath, "utf8"));

		// // Create the GitHub client
		const gitInstance = Github(token, authUrl, localRepoPath);
		await gitInstance.preProcess(productionBranch, newBranch);
		const changedFiles = await processSast(sast, localRepoPath);
		// 6. If we actually changed some files, commit + push + open PR
		if (changedFiles.size > 0) {
			const changedArray = [...changedFiles];
			const violationsGithubOptions = {
				commitMsg: `${MODEL}-${ATTEMPT} Fixing sast`,
				prTitle: `${MODEL}-${ATTEMPT} Fix sast`,
				prBody: `${MODEL}-${ATTEMPT} Automated fixes for sast`,
				newBranch,
				changedArray,
				...githubOptions,
			}

			await gitInstance.afterProcess(violationsGithubOptions);
		} else {
			logger.info("========= Info =========");
			logger.info("No files changed - skipping PR creation.");
			logger.info("========================");
		}
	} catch (error) {
		console.log(error);
	}
};

export default runSast;