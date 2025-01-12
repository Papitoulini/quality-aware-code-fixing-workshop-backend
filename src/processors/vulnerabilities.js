/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { processVulnerabilities } from "./vulnerabilities/index.js"; 
import { Github, MODEL, ATTEMPT } from "#utils";
import { logger } from "#logger";

const runVulnerabilities = async (repoPaths, githubOptions) => {
	try {
		const { token, authUrl, productionBranch } = githubOptions;
		const newBranch = `${MODEL}-${ATTEMPT} \`vulnerabilities\`-fixes`;
		const [localRepoPath, findingsPath] = repoPaths;

		const vulnerabilitiesFindingsPath = path.resolve(findingsPath, "vulnerabilities.json");
		const vulnerabilities = JSON.parse(fs.readFileSync(vulnerabilitiesFindingsPath, "utf8"));

		// // Create the GitHub client
		const gitInstance = Github(token, authUrl, localRepoPath);
		await gitInstance.preProcess(productionBranch, newBranch);
		const changedFiles = await processVulnerabilities(vulnerabilities, localRepoPath);
		// 6. If we actually changed some files, commit + push + open PR
		if (changedFiles.size > 0) {
			const changedArray = [...changedFiles];
			const violationsGithubOptions = {
				commitMsg: `${MODEL}-${ATTEMPT} Fixing \`vulnerabilities\``,
				prTitle: `${MODEL}-${ATTEMPT} Fix \`vulnerabilities\``,
				prBody: `${MODEL}-${ATTEMPT} Automated fixes for \`vulnerabilities\``,
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

export default runVulnerabilities;