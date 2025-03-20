/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { processSastPerFile } from "./sast/index.js"; 
import { Github, ATTEMPT } from "#utils";
import { logger } from "#logger";

const runSast = async (repoPaths, githubOptions, selectedFiles, name, model) => {
	try {
		const { token, authUrl, productionBranch } = githubOptions;
		const newBranch = `${model}-${name}-${ATTEMPT}-sast-fixes`;
		const [localRepoPath, findingsPath] = repoPaths;

		const sastFindingsPath = path.resolve(findingsPath, "sast.json");
		const sast = JSON.parse(fs.readFileSync(sastFindingsPath, "utf8"));

		// // Create the GitHub client
		const gitInstance = Github(token, authUrl, localRepoPath);
		await gitInstance.preProcess(productionBranch, newBranch);
		const changedFiles = await processSastPerFile(sast, localRepoPath, selectedFiles, name);
		// 6. If we actually changed some files, commit + push + open PR
		if (changedFiles.size > 0) {
			const changedArray = [...changedFiles];
			const violationsGithubOptions = {
				commitMsg: `${model}-${name}-${ATTEMPT} Fixing sast`,
				prTitle: `${model}-${name}-${ATTEMPT} Fix sast`,
				prBody: `${model}-${name}-${ATTEMPT} Automated fixes for sast`,
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