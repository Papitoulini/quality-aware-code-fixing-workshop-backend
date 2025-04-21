import "dotenv/config.js";
import path from "node:path";
import fs from "node:fs";

import queries from "../src/processors/sast/queries-per-file.js";
import { LLMS } from "#utils";
import { models, init } from "#dbs";

const { Question, Cluster, Snippet } = models;

// Helper to create a safe filename for JSON dumps
// Masks file extensions and path separators
const maskFilePath = (filePath, includeExt = true) =>
	filePath
		.replace(/\.[jt]s$/, "")
		.replaceAll(/[/\\]/g, "__") +
	(includeExt ? ".json" : "");

// We only need two variants per model: a bad example and a good example
const createSomeExamplesMapping = [
	[
		"Please give a bad example if the following query was your prompt",
		"bSnippets"
	],
	[
		"Please give a good example if the following query was your prompt",
		"gSnippets"
	],
	[
		"Please give a bad example if the following query was your prompt",
		"bSnippets"
	],
	[
		"Please give a good example if the following query was your prompt",
		"gSnippets"
	],
	[
		"Please give a bad example if the following query was your prompt",
		"bSnippets"
	],
	[
		"Please give a good example if the following query was your prompt",
		"gSnippets"
	],
];

/**
 * For a given code snippet and its SAST findings, generate illustrative
 * bad/good examples via your LLM service.
 * @param {string} code - the source code text
 * @param {Array<Object>} findings - SAST findings array
 * @param {string} model - LLM model name ('llama'|'claude')
 * @returns {Promise<Array<{type: string, response: string}>>}
 */
async function createSomeExamples(code, findings, model) {
	console.log(`Generating examples for model: ${model}`);
	const baseQuery = queries.generateSASTFixTask(code, findings);
	const llm = LLMS();
	const results = [];

	for (const [subQuery, type] of createSomeExamplesMapping) {
		console.log(`	-> Subtask: ${type}`);
		const enhancedQuery = `
--- SYSTEM ---
You are a world-class software security engineer. Your job is to read a prompt and then craft either a good or bad illustrative example based on it.

--- USER TASK ---
${subQuery}

--- CONTEXT (Original Prompt) ---
${baseQuery.trim()}

--- RESPONSE ---
`;
		try {
			console.log("		Sending prompt to LLM...");
			const res = await llm
				.post("", {
					json: {
						model,// e.g. "llama" or "claude"
						message: enhancedQuery
					}
				})
				.json();

			// Support APIs that return { response } or { message }
			const response = res.response ?? res.message ?? res;
			console.log(`		Received ${type} response.`);
			results.push({ type, response });
		} catch (error) {
			console.error(`		Error generating ${type} for ${model}:`, error);
		}
	}

	console.log(`Completed example generation for ${model}`);
	return results;
}

async function main() {
	console.log("Starting main process...");

	// 1) Connect to the database
	console.log("Initializing database connection...");
	const db = await init();
	console.log("Database initialized.");

	// 2) Load your precomputed fixes and collect unique file paths
	const dataDir = path.join(
		"C:",
		"Users",
		"panpa",
		"Desktop",
		"WorkSpace",
		"Cyclopt",
		"dimos-giorgos",
		"thesis",
		"workshop-data"
	);
	console.log(`Loading fixes from ${dataDir}`);
	const fixes = JSON.parse(
		fs.readFileSync(path.join(dataDir, "enhanced-sast-claude-processed.json"), "utf8")
	);
	const filePaths = [...new Set(fixes.oldSast.content.sast.map(s => s.path))];
	console.log(`Found ${filePaths.length} unique file paths.`);

	// 3) Ensure the analysis output folder exists
	const analysisDir = path.join(dataDir, "analysis", "claude");
	fs.mkdirSync(analysisDir, { recursive: true });
	console.log(`Analysis directory: ${analysisDir}`);

	let indexCounter = 0;
	// Process a subset for testing
	for (const filePath of filePaths.slice(0, 3)) {
		console.log(`\nProcessing file: ${filePath}`);
		let fileContent;
		try {
			const safeName = maskFilePath(filePath);
			console.log(`	Reading filtered JSON: ${safeName}`);
			fileContent = JSON.parse(
				fs.readFileSync(path.join(dataDir, "filtered", safeName), "utf8")
			);
		} catch {
			console.warn(`	Skipping ${filePath}: could not read or parse.`);
			continue;
		}

		const code = fileContent.oldVersion.code;
		if (typeof code !== "string") {
			console.warn(`	Skipping ${filePath}: missing code string.`);
			continue;
		}

		indexCounter++;
		// 4a) Save the original snippet
		console.log("	Saving original snippet...");
		const originalSnippet = await Snippet.create({ code, original: true });
		console.log(`	Original snippet ID: ${originalSnippet._id}`);

		// 4b) For each model, build a cluster and generate examples
		for (const model of ["llama", "claude"]) {
			console.log(`	Creating cluster for model: ${model}`);
			const cluster = await Cluster.create({
				centroid: originalSnippet._id,
				model
			});

			console.log("	Generating illustrative examples...");
			const examples = await createSomeExamples(
				code,
				fileContent.oldVersion.findings,
				model
			);
			console.log(`	Received ${examples.length} example(s).`);

			for (const { type, response } of examples) {
				console.log(`		Saving snippet for type: ${type}`);
				const targetSnippet = await Snippet.create({ code: response });
				cluster[type].push(targetSnippet._id);
				console.log(`		Added snippet ID: ${targetSnippet._id}`);
			}

			console.log("	Saving cluster document...");
			await cluster.save();
			console.log("	Cluster saved.");
		}

		// 5) Persist a Question document
		console.log("	Creating Question document...");
		const questionDoc = await Question.create({
			index: indexCounter,
			code: originalSnippet._id,
			description: "init description",
			question: "init question",
			analysis: fileContent.oldVersion.findings
		});
		console.log(`	Question ID: ${questionDoc._id}`);
	}

	// 6) Disconnect
	console.log("Disconnecting database...");
	await db.disconnect();
	console.info("All analyses completed.");
}

// Kick off the main process
await main().catch(error => {
	console.error("Fatal error in main():", error);
});