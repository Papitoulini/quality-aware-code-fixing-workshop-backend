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

const git = (repoPath) => simpleGit(repoPath);

const Github = (auth, authenticatedUrl, clonePath) => {
	const octokit = new MyOctokit({
		auth,
		userAgent: "Cyclopt Platform",
		throttle: {
			onRateLimit: (retryAfter, options) => {
				logger.warn(`Rate quota reached. Will retry after ${retryAfter} seconds. User token: ${auth}.`);
				if (options.request.retryCount === 0) {
					// Retry once
					return true;
				}

				return false;
			},
			onSecondaryRateLimit: (retryAfter, options) => {
				logger.warn(`Abuse detected. Will retry after ${retryAfter} seconds.`);
				if (options.request.retryCount === 0) {
					return true;
				}

				return false;
			},
		},
	});

	// Wrap rest methods to return data directly
	const rest = async (endpoint, params) => {
		try {
			const response = await octokit.request(endpoint, params);
			return response.data;
		} catch (error) {
			logger.error(`Error in Octokit request: ${error.message}`);
			throw error;
		}
	};

	const api = octokit.rest;					// REST API methods
	const graphql = octokit.graphql;		// GraphQL API
	const paginate = octokit.paginate;	// Pagination helper

	// Initialize simple-git with the repository path
	// Git Operations using simple-git
	const gitClone = async (branch = "main") => {
		try {
			const gitInstance = simpleGit();
			await gitInstance.clone(authenticatedUrl, clonePath, ["-b", branch]);
			logger.info(`Git Clone Successful: Cloned ${branch} to ${clonePath}`);
		} catch (error) {
			logger.error(`Error during git clone: ${error.message}`);
		}
	};

	const gitPush = async (branch = "main") => {
		try {
			const gitInstance = git(clonePath);

			// Remove existing 'origin-auth' remote if it exists to avoid duplicates
			const remotes = await gitInstance.getRemotes(true);
			if (remotes.some((remote) => remote.name === "origin-auth")) {
				await gitInstance.removeRemote("origin-auth");
			}

			// Add authenticated remote
			await gitInstance.addRemote("origin-auth", authenticatedUrl);

			// Push to the authenticated remote
			const pushResult = await gitInstance.push("origin-auth", branch);
			logger.info(`Git Push Successful: ${pushResult.summary}`);
			return pushResult;
		} catch (error) {
			logger.error(`- Error during git push: ${error.message}`);
		}

		return null;
	};

	const gitCommit = async (commitMessage, filePatterns = ["."]) => {
		try {
			const gitInstance = git(clonePath);

			// Stage files
			await gitInstance.add(filePatterns);
			logger.info(`Staged files: ${filePatterns.join(", ")}`);

			// Commit changes
			const commitResult = await gitInstance.commit(commitMessage);
			logger.info(`Git Commit Successful: ${commitResult.summary}`);
			return commitResult;
		} catch (error) {
			logger.error(`Error during git commit: ${error.message}`);
			throw error;
		}
	};

	return { rest, graphql, paginate, api, gitClone, gitPush, gitCommit };
};

export default Github;
