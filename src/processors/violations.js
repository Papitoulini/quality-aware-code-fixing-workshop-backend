/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { processViolationsPerFile } from "./violations/index.js"; 
import { Github, ATTEMPT } from "#utils";
import { logger } from "#logger";

const runViolations = async (repoPaths, githubOptions, selectedFiles, name, model) => {
	try {
		const { token, authUrl, productionBranch } = githubOptions;
		const newBranch = `${model}-${name}-${ATTEMPT}-violations-fixes`;
		const [localRepoPath, findingsPath] = repoPaths;

		const analysisFindingsPath = path.resolve(findingsPath, "analysis.json");
		const violationsFindings = JSON.parse(fs.readFileSync(analysisFindingsPath, "utf8"));
		const violations = violationsFindings.violationsInfo.violations;
	
		// // Create the GitHub client
		const gitInstance = Github(token, authUrl, localRepoPath);
		await gitInstance.preProcess(productionBranch, newBranch);
		const changedFiles = await processViolationsPerFile(violations, localRepoPath, selectedFiles, name);
		// 6. If we actually changed some files, commit + push + open PR
		if (changedFiles.size > 0) {
			const changedArray = [...changedFiles];
			const violationsGithubOptions = {
				commitMsg: `${model}-${name}-${ATTEMPT} Fixing code violations`,
				prTitle: `${model}-${name}-${ATTEMPT} Fix violations`,
				prBody: `${model}-${name}-${ATTEMPT} Automated fixes for code violations.`,
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

export default runViolations;