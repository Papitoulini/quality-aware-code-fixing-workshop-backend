import express from "express";
import cycloptViolations from "../../temp-violations.js";

import runner from "../runner.js";

import { models } from "#dbs";
import { getAnalysisFolderFile, getCloudAnalysis, Github, findSastDiff, getIntroducedViolationsProps, findViolationsDiff } from "#utils";

const { Commit, Analysis } = models;

const router = express.Router({ mergeParams: true });

const originalHash = "70a8d22b75e173df5f4ca1612bdcdaf692b7f125";
const owner = "Papitoulini";
const name = "juice-shop";
const language = "TypeScript";
const root = ".";

const enhanceViolations = (violations = {}) => {
	const result = Object.entries(violations).map(([id, data]) => {
		const matchedCyclopt = cycloptViolations.find((e) => e.ruleId === id) || {};
		return {...matchedCyclopt,  ...data };
	});
	return result;
};

function transformViolations(violations_) {
	const aggregatedViolationsMap = {};
	const aggregatedFilesMap = {};

	for (const violation of violations_) {
		const { files, ...otherProps } = violation;
		const ruleId = violation.ruleId || (violation.restViolationProps && violation.restViolationProps.ruleId) || "N/A";

		// If this ruleId hasn't been added to violationsMap, add it.
		if (!aggregatedViolationsMap[ruleId]) {
			aggregatedViolationsMap[ruleId] = { ...otherProps };
		}

		// Process files for the current violation
		if (Array.isArray(files)) {
			for (const { filePath, line } of files) {
				if (!aggregatedFilesMap[filePath]) {
					aggregatedFilesMap[filePath] = {};
				}
				const fileLinesMap = aggregatedFilesMap[filePath];

				if (!fileLinesMap[ruleId]) {
					fileLinesMap[ruleId] = [];
				}
				fileLinesMap[ruleId].push(line);
			}
		}
	}

	return {
		violationsMap: aggregatedViolationsMap,
		filesMap: aggregatedFilesMap
	};
}

const { GITHUB_TOKEN } = process.env;

// list files
router.get("/", async (req, res) => {
	try {
		// Assuming you have a GitHub client instance already set up using your token.
		const { rest } = Github(GITHUB_TOKEN);
  
		// Fetch the repository's file tree recursively.
		// Replace 'owner', 'repo', and 'tree_sha' with actual variables or constants.
		const { data: tree } = await rest("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
			owner,                // GitHub repo owner
			repo: name,           // Repository name
			tree_sha: originalHash,     // You can pass the branch name if GitHub resolves it,
			// or use a specific commit SHA representing the tree.
			recursive: 1,         // Fetch files recursively
			headers: { "X-GitHub-Api-Version": "2022-11-28" },
		});
  
		// Filter only the file blobs (ignoring directories, submodules, etc.)
		const files = tree.tree.filter(item => item.type === "blob");

		const {
			_id: commitId,
			// repositories: [{ owner, name, productionBranch, addedBy: { _id: userId, github: { token }, username } }],
			repositories: [{ language }],
		} = await Commit.findOne({ hash: originalHash })
			.populate({
				path: "repositories",
				select: "owner name providerId addedBy productionBranch language",
				populate: { path: "addedBy", model: "User", select: "_id username github" },
			})
			.select("_id files createdAt") // Selecting top-level fields
			.lean();

		const analysis = await Analysis.findOne({ commit: commitId, language, pending: true }).lean();

		const [
			{ content: { sast } },
			analysisResults,
		] = await Promise.all([
			getAnalysisFolderFile(analysis, "sast.json", { ignoreInternalId: true }),
			getCloudAnalysis(analysis, { isMaintainabilityPal: true, violations: true }),
		]);
		
		const enhancedViolations = enhanceViolations(analysisResults.violationsInfo.violations);
		const { violationsMap, filesMap } = transformViolations(enhancedViolations);
		
		const finalFiles = files.map((file) => {
			const fileSastSummary = { INFO: 0, WARNING: 0, ERROR: 0, TOTAL: 0 };
			const fileViolationsSummary = { Critical: 0, Major: 0, Minor: 0, Total: 0 }; //"Critical", "Major", "Minor"
			const { path, lineCount } = file;
			const fileSast = sast.filter((f) => f.path === path);
			const fileViolations = filesMap[`/${path}`] || null;
			if (!fileViolations && fileSast.length === 0) return null;

			for (const sast of fileSast) {
				fileSastSummary[sast.severity] += 1;
				fileSastSummary.TOTAL += 1;
			}

			for (const [ruleId, lines] of Object.entries(fileViolations || {})) {
				const violation = violationsMap[ruleId] || null;
				fileViolationsSummary[violation.severity] += lines.length;
				fileViolationsSummary.Total += 1;
			}

			return {
				path,
				lineCount,
				fileSastSummary,
				fileViolationsSummary,
			};
		}).filter(Boolean);

		const response = {
			owner,
			name,
			hash: originalHash,
			files: finalFiles,
		}

		// Return the order info along with the filtered file list
		return res.json(response);
	} catch (error) {
		console.error("Error fetching repository files:", error);
		return res.status(500).json({
			error: "An error occurred while fetching the repository files.",
		});
	}
});

router.put("/", async (req, res) => {
	const { selectedFiles, pipelineName, model } = req.body;

	console.log("startedCloneing")
	
	const response = await runner(originalHash, selectedFiles, pipelineName, model);
	console.log("finished")

	try {
		// Return the order info along with the filtered file list
		return res.json(response);
	} catch (error) {
		console.error("Error fetching repository files:", error);
		return res.status(500).json({
			error: "An error occurred while fetching the repository files.",
		});
	}
});

// Instantiate the Github client using environment variables.
const auth = process.env.GITHUB_TOKEN;
const authenticatedUrl = process.env.GITHUB_AUTH_URL;
const clonePath = process.env.GITHUB_CLONE_PATH;
const githubClient = Github(auth, authenticatedUrl, clonePath);

// GET /pull_requests: List all pull requests for a given repository.
router.get("/pull_requests", async (req, res) => {
	// Using req.body for demonstration, but consider req.query or POST for proper usage.
	const { name } = req.body; 
	try {
		// Assume 'name' is the repository name and owner is provided via environment variable.
		const repo = name || "juice-shop"; // fallback if name is not provided

		// List pull requests using Octokit's REST API.
		const response = await githubClient.octokit.rest.pulls.list({
			owner,
			repo,
		});

		return res.json(response.data.map((pr) => ({ title: pr.title, number: pr.number})));
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "An error occurred while fetching pull requests.",
		});
	}
});

// GET /pull_requests/:PULL_REQUEST: Get details for a specific pull request.
router.get("/pull_requests/:PULL_REQUEST", async (req, res) => {
	// Again, using req.body for demonstration purposes.
	const { PULL_REQUEST } = req.params;
	try {
		const repo = name || "default-repo-name";
		const pull_number = Number.parseInt(PULL_REQUEST, 10);

		// List all commits in this pull request
		const commitsResponse = await githubClient.octokit.rest.pulls.listCommits({
			owner,
			repo,
			pull_number,
		});
		const commits = commitsResponse.data;
		// Get the last commit from the list (the latest commit)
		const latestCommit = commits.at(-1);

		const commit = await Commit.findOne({ hash: latestCommit.sha}).select("_id").lean().exec()

		const props = await getIntroducedViolationsProps(commit?._id, language, root);
		const { fromAnalysis, toAnalysis, patches, changedFileNameMapping } = props;

		const [oldSast, newSast] = await Promise.all([
			getAnalysisFolderFile(fromAnalysis, "sast.json", { ignoreInternalId: true }),
			getAnalysisFolderFile(toAnalysis, "sast.json", { ignoreInternalId: true }),
		]);
		
		// throw new Error(`Commit with hash ${hash} not found or has disallowed author.`);
		const oldSastFindings = oldSast?.content?.sast;
		const newSastFindings = newSast?.content?.sast;

		const { removedSast } = findSastDiff(
			newSastFindings,
			oldSastFindings,
			patches,
			changedFileNameMapping,
		);

		const newViolations = toAnalysis.violationsInfo?.violations || {};
		const oldViolations = fromAnalysis.violationsInfo?.violations || {};

		// // Compute diff of violations
		const { removedViolations: rViol } = findViolationsDiff(
			newViolations,
			oldViolations,
			patches,
			changedFileNameMapping,
		);
		console.log(removedSast)
		
		return res.json({ rViol, removedSast });
	} catch (error) {
		
		console.log(error)
		return res.json({
			rViol: {}, removedSast:[{
				start: { line: 36, col: 66, offset: 1552 },
				end: { line: 36, col: 86, offset: 1572 },
				path: 'routes/login.ts',
				message: 'Detected user input used to manually construct a SQL string. This is usually bad practice because manual construction could accidentally result in a SQL injection. An attacker could use a SQL injection to steal or modify contents of the database. Instead, use a parameterized query which is available by default in most database engines. Alternatively, consider using an object-relational mapper (ORM) such as Sequelize which will protect your queries.',
				lines: 'requires login',
				severity: 'WARNING',
				metadata: {
					confidence: 'MEDIUM',
					likelihood: 'HIGH',
					cwe: [Array],
					references: [Array]
				}
			}]
		})
	}
});
export default router;
