/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { processViolationsPerFile } from "./violations/index.js";

import { Github, ATTEMPT, MODEL } from "#utils";
import { logger } from "#logger";

const runViolations = async (repoPaths, githubOptions, selectedFiles, name = "default_name", md = MODEL) => {
	try {
		const { token, authUrl, productionBranch } = githubOptions;
		const newBranch = `${md}-${name}-${ATTEMPT}-violations-fixes`;
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
				commitMsg: `${md}-${name}-${ATTEMPT} Fixing code violations`,
				prTitle: `${md}-${name}-${ATTEMPT} Fix violations`,
				prBody: `${md}-${name}-${ATTEMPT} Automated fixes for code violations.`,
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