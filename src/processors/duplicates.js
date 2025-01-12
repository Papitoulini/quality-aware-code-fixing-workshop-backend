/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { processDuplicates } from "./duplicates/index.js"; 
import { Github, MODEL, ATTEMPT } from "#utils";
import { logger } from "#logger";

const runDuplicates = async (repoPaths, githubOptions) => {
	try {
		const { token, authUrl, productionBranch } = githubOptions;
		const newBranch = `${MODEL}-${ATTEMPT} \`duplications\`-fixes`;
		const [localRepoPath, findingsPath] = repoPaths;

		const duplicatesFindingsPath = path.resolve(findingsPath, "clones.json");
		const duplicates = JSON.parse(fs.readFileSync(duplicatesFindingsPath, "utf8"));

		// // Create the GitHub client
		const gitInstance = Github(token, authUrl, localRepoPath);
		await gitInstance.preProcess(productionBranch, newBranch);
		const changedFiles = await processDuplicates(duplicates, localRepoPath);

		if (changedFiles.size > 0) {
			const changedArray = [...changedFiles];
			const violationsGithubOptions = {
				commitMsg: `${MODEL}-${ATTEMPT} Fixing Code \`duplications\``,
				prTitle: `${MODEL}-${ATTEMPT} Fix Code \`duplications\``,
				prBody: `${MODEL}-${ATTEMPT} Automated fix for Code \`duplications\``,
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

export default runDuplicates;