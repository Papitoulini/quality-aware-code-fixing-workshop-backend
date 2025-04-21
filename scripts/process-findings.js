/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { Github } from "#utils";
import { init } from "#dbs";

const owner        = "Papitoulini";
const repoName     = "juice-shop";
const originalHash = "70a8d22b75e173df5f4ca1612bdcdaf692b7f125";
// const hash = "70a8d22b75e173df5f4ca1612bdcdaf692b7f125"; // orginal hash
// claude - violations - d338e53b1a3fb6bb92b6aed30261174d21db721f
// claude - sast - af1301d504ea6d9df802c34777441a9c1701a73e
// llama - violations - 0a87ce6c143aa72c1bb14676f7e85eb2e368690f
// llama - sast - 880bd514633f3fe0546c9e908c5e8a4234cc5921
// deepseek - sast- b821a3b384cf125829390cdfb062e7aaefc85620

const maskFilePath = (filePath) =>  filePath.replace(/\.[jt]s$/, "").replaceAll(/[/\\]/g, "__") + ".json";

function summarizeFindingsByPath(
	findings,
){
	return findings.reduce((acc, { path: filePath, severity, ...rest }) => {
		if (!acc[filePath]) {
			acc[filePath] = { total: 0, bySeverity: {}, findings: [] };
		}
		acc[filePath].total += 1;
		acc[filePath].findings.push({ severity, ...rest});
		acc[filePath].bySeverity[severity] = (acc[filePath].bySeverity[severity] || 0) + 1;
		return acc;
	}, {});
}

async function getCodeAndLine(
	ref,
	filePath 
) {
	try {
		const { rest } = Github(process.env.GITHUB_TOKEN);
		const { data } = await rest("GET /repos/{owner}/{repo}/contents/{path}", {
			owner,
			repo: repoName,
			path: filePath,
			ref,
		});

		if (typeof data.content !== "string" || data.encoding !== "base64") {
			throw new Error(`Bad content format for ${filePath}`);
		}

		const code = Buffer.from(data.content, "base64").toString("utf8");
		const lineCount = code.split(/\r\n|\r|\n/).length;
		return { code, lineCount };
	} catch (error) {
		console.error(`Failed to load ${filePath}@${ref}:`, error);
		return { code: null, lineCount: null };
	}
}

async function main() {
	// 1) initialize DB
	const db = await init();

	// 2) load pre‑computed fixes JSON
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
	const llamaFixes = JSON.parse(
		fs.readFileSync(path.join(dataDir, "enhanced-sast-llama-processed.json"), "utf8")
	);

	const claudeFixes = JSON.parse(
		fs.readFileSync(path.join(dataDir, "enhanced-sast-claude-processed.json"), "utf8")
	);

	// 3) pick which runs to process
	const runs = [
		{
			name: "llama",
			fixes: llamaFixes,
			fixesHash: "880bd514633f3fe0546c9e908c5e8a4234cc5921",
		},
		{
			name: "claude",
			fixes: claudeFixes,
			fixesHash: "af1301d504ea6d9df802c34777441a9c1701a73e",
		},
	];

	for (const run of runs) {
		const {
			name,
			fixes: {
				oldSast: { content: { sast: oldSast } },
				newSast: { content: { sast: newSast } },
			},
			fixesHash,
		} = run;

		// 4) summarize findings
		const oldSummary = summarizeFindingsByPath(oldSast);
		const newSummary = summarizeFindingsByPath(newSast);

		// 5) build combined record
		const combined = {};

		for (const [filePath, oldStats] of Object.entries(oldSummary)) {
			const newStats = newSummary[filePath] || { total: 0, bySeverity: {} };

			// Fetch both versions in parallel
			const [oldContent, newContent] = await Promise.all([
				getCodeAndLine(originalHash, filePath),
				getCodeAndLine(fixesHash,    filePath),
			]);

			combined[filePath] = {
				filePath,
				dif: newStats.total - oldStats.total,
				oldVersion: { ...oldStats, ...oldContent },
				newVersion: { ...newStats, ...newContent },
			};
		}

		// console.log(combined);

		// 6) do something with `combined`—for example:
		const outputDir = path.join(dataDir, "comparisons", name);

		// 2) Make sure it exists (recursive: true will create any missing parents)
		fs.mkdirSync(outputDir, { recursive: true });
		
		for (const [filePath, content] of Object.entries(combined)) {
			const safeName = maskFilePath(filePath); 
			const outFile = path.join(outputDir, safeName);

			fs.writeFileSync(outFile, JSON.stringify(content, null, 2), "utf8");
			console.info(`Wrote comparison for ${name} to ${outFile}`);
		}

	}

	await db.disconnect();
	console.info("All done.");
}

await main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
