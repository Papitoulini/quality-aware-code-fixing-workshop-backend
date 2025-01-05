import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";
import simpleGit from "simple-git";
import winston from "winston";

// Configure Winston logger
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`),
	),
	transports: [
		new winston.transports.File({ filename: "git-operations.log" }),
		new winston.transports.Console(),
	],
});

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
		const gitInstance = simpleGit(clonePath);
		await gitInstance.checkout(productionBranch);
		await gitInstance.checkoutLocalBranch(newBranch);
	};

	const afterProcess = async (githubOptions) => {
		try {
			const  { 
				owner,
				repo,
				commitMsg,
				prTitle,
				prBody,
				newBranch,	// e.g. "violations-fixes"
				productionBranch, // e.g. "main"
				changedArray: filePatterns,
			}= githubOptions;
			const gitInstance = simpleGit(clonePath);
			await gitInstance.add(filePatterns.map((f) => f.startsWith("/") ? f.slice(1) : f));
			const commitResult = await gitInstance.commit(commitMsg);
			logger.info(`Successfully committed changes: ${commitResult.summary}`);
			console.log("Committed changes on new branch.");
	
			// Push the new branch
			// Remove existing 'origin-auth' remote if it exists
			const remotes = await gitInstance.getRemotes(true);
			if (remotes.some((remote) => remote.name === "origin-auth")) {
				await gitInstance.removeRemote("origin-auth");
			}

			// Add an authenticated remote
			await gitInstance.addRemote("origin-auth", authenticatedUrl);
			await gitInstance.push("origin-auth", newBranch);
			logger.info(`Successfully pushed changes to branch "${newBranch}".`);

			const response = await octokit.rest.pulls.create({
				owner,
				repo,
				title: prTitle,
				body: prBody,
				head: newBranch, // e.g. "violations-fixes"
				base: productionBranch, // e.g. "main"
			});
	
			console.log("Pull Request created:", response.data.html_url);
		} catch (error) {
			throw error;
		}
	};

	return {
		// Octokit handles
		octokit, // You can directly use octokit.rest, octokit.graphql, octokit.paginate, etc.
		preProcess,
		cloneRepo,
		afterProcess,
	};
};

export default Github;
