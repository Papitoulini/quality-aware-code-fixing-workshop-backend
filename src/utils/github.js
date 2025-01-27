import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";
import simpleGit from "simple-git";

import { logger } from "#logger";

// Create a custom Octokit class with the Throttling and Retry plugins
const MyOctokit = Octokit.plugin(throttling, retry);

const Github = (auth, authenticatedUrl, clonePath) => {
	const octokit = new MyOctokit({
		auth,
		userAgent: "Cyclopt Platform",
		throttle: {
			onRateLimit: (retryAfter, options) => {
				logger.warn(`Rate quota reached. Will retry after ${retryAfter} seconds.`);
				// Retry once
				return options.request.retryCount === 0;
			},
			onSecondaryRateLimit: (retryAfter, options) => {
				logger.warn(`Secondary rate limit (abuse). Will retry after ${retryAfter} seconds.`);
				// Retry once
				return options.request.retryCount === 0;
			},
		},
	});

	const cloneRepo = async (branch = "main") => {
		try {
			// For initial clone, we do *not* pass a path because it doesn't exist yet.
			const gitInstance = simpleGit();
			await gitInstance.clone(authenticatedUrl, clonePath, ["-b", branch]);
			logger.info(`Successfully cloned branch "${branch}" into "${clonePath}".`);
		} catch (error) {
			logger.error(`Error during git clone: ${error.message}`);
			throw error;
		}
	};

	// ----------------------------------------------------------------------------
	// GITHUB OPERATIONS
	// ----------------------------------------------------------------------------

	const preProcess = async (productionBranch, newBranch) => {
		try {
			// For initial clone, we do *not* pass a path because it doesn't exist yet.
			const gitInstance = simpleGit(clonePath);
			await gitInstance.checkout(productionBranch);
			try {
				await gitInstance.checkoutLocalBranch(newBranch);
			} catch { /* */}
			logger.info("------------------------");
			logger.info(`Successfully created branch "${newBranch}" from branch "${productionBranch}".`);
			logger.info("------------------------");
		} catch (error) {
			logger.error(`Error during git clone: ${error.message}`);
			throw error;
		}
	};

	// const simpleGit = require('simple-git');
	// const { Octokit } = require('@octokit/rest');
	// const logger = require('your-logger'); // Replace with your actual logger
	// const authenticatedUrl = 'your-authenticated-url'; // Replace with your authenticated URL
	// const clonePath = 'your-clone-path'; // Replace with your actual clone path
	
	const afterProcess = async (githubOptions) => {
		// const octokit = new Octokit({ auth: 'your-token' }); // Initialize Octokit with your token
	
		try {
			const { 
				// owner,
				// repo,
				// commitMsg,
				// prTitle,
				// prBody,
				// newBranch,         // e.g. "violations-fixes"
				// productionBranch,  // e.g. "main"
				changedArray: filePatterns,
			} = githubOptions;
	
			const gitInstance = simpleGit(clonePath);
			await gitInstance.addConfig("commit.gpgSign", "false");
	
			// Sanitize file patterns
			const sanitized = filePatterns.map((f) => (f.startsWith("/") ? f.slice(1) : f));
			await gitInstance.add(sanitized);
	
			// Check the status to determine if there are changes
			const status = await gitInstance.status();
	
			if (status.staged.length === 0) {
				logger.info("========= Info =========");
				logger.info("No files changed - skipping commit, push, and PR creation.");
				logger.info("========================");
				return; // Exit the function early since there's nothing to do
			}

			logger.info("========= Info =========");
			logger.info("DONE");
			logger.info("========================");
	
			// // Commit changes
			// const commitResult = await gitInstance.commit(commitMsg);
			// logger.info("========= Git Operations =========");
			// logger.info(`Files staged for commit: ${sanitized.join(', ')}`);
			// logger.info(`Commit summary: ${JSON.stringify(commitResult.summary)}`);
			// logger.info("===============================");
	
			// // Push the new branch
			// logger.info(`Preparing to push changes to branch "${newBranch}"...`);
	
			// // Remove existing 'origin-auth' remote if it exists
			// const remotes = await gitInstance.getRemotes(true);
			// if (remotes.some((remote) => remote.name === "origin-auth")) {
			// 	logger.info("Removing existing 'origin-auth' remote...");
			// 	await gitInstance.removeRemote("origin-auth");
			// }
	
			// // Add an authenticated remote
			// logger.info("Adding 'origin-auth' remote...");
			// await gitInstance.addRemote("origin-auth", authenticatedUrl);
	
			// // Push changes
			// logger.info(`Pushing changes to branch "${newBranch}"...`);
			// await gitInstance.push(['-u', 'origin-auth', newBranch]);
			// logger.info(`Successfully pushed changes to branch "${newBranch}".`);
			// logger.info("===============================");
	
			// // Create a Pull Request
			// logger.info("========= Pull Request Operations =========");
			// const response = await octokit.rest.pulls.create({
			// 	owner,
			// 	repo,
			// 	title: prTitle,
			// 	body: prBody,
			// 	head: newBranch,         // e.g. "violations-fixes"
			// 	base: productionBranch,  // e.g. "main"
			// });
	
			// logger.info(`Pull Request created successfully: ${response.data.html_url}`);
			// logger.info("===========================================");
	
		} catch (error) {
			logger.error("========= Error Occurred =========");
			logger.error(`Error during git operations: ${error.message}`);
			logger.error(`Stack Trace: ${error.stack}`);
			logger.error("==================================");
			throw error; // Re-throw the error after logging
		}
	};
	
	const rest = async (route, params) => {
		return octokit.request(route, params);
	};

	return {
		// Octokit handles
		octokit, // You can directly use octokit.rest, octokit.graphql, octokit.paginate, etc.
		preProcess,
		cloneRepo,
		afterProcess,
		rest,
	};
};

export default Github;
