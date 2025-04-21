import "dotenv/config.js";
import path from "node:path";
import fs from "node:fs";

import { analyzeFile } from "#utils";
import { models, init } from "#dbs";
// after your other imports
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const uploadFolderPath = path.join(__dirname, "..", "assets/uploads");

const { Question } = models;

// helper from your snippet
const maskFilePath = (filePath, includeExt = true) => {
    console.log(filePath)
	return filePath.replace(/\.[jt]s$/, "").replaceAll(/[/\\]/g, "__") + (includeExt ? ".json" : "")
};

// your analysCodePart (unchanged)
const analysCodePart = async (code, originalPath) => {
	const folder = "unknown";
	const questionFolder = "unknown";
	const timestamp = Date.now().toString();
	const safeName = maskFilePath(originalPath, false);
	const filename = `${timestamp}-llm-${safeName}.ts`; // keep .ts so analyzeFile sees code

	const targetDir = path.join(uploadFolderPath, folder, questionFolder);
	const targetFile = path.join(targetDir, filename);
	fs.mkdirSync(targetDir, { recursive: true });
	fs.writeFileSync(targetFile, code, "utf8");
	console.info(`Wrote code snippet to ${targetFile}`);

	const analysisResults = await analyzeFile(targetDir, filename);
	return analysisResults;
};

async function main() {
	// 1) initialize DB
	const db = await init();

	// 2) load pre‑computed fixes & identify all unique paths
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
	const fixes = JSON.parse(
		fs.readFileSync(path.join(dataDir, "enhanced-sast-processed.json"), "utf8")
	);
	const filePaths = [
		...new Set(fixes.oldSast.content.sast.map((s) => s.path)),
	];

	// 3) prepare an output folder for all analyses
	const analysisDir = path.join(dataDir, "analysis", "llama");
	fs.mkdirSync(analysisDir, { recursive: true });

	// 4) for each path: read the filtered JSON, extract code, analyze, then save
	for (const filePath of filePaths.slice(0,1 )) {
		try {
			// a) read the filtered JSON (which contains your snippet under e.g. `.code`)
			const safeFileName = maskFilePath(filePath);
            console.log(safeFileName)
			const fileContent = JSON.parse(
				fs.readFileSync(path.join(dataDir, "filtered", "llama", safeFileName), "utf8")
			);

			// b) extract the raw code field (adjust if your JSON uses another key)
			const code = fileContent.oldVersion.code;
			if (typeof code !== "string") {
				console.warn(`Skipping ${filePath}: no code field found.`);
				continue;
			}

			// c) run your analyzer
			const analysis = await analysCodePart(code, filePath);

			// d) write the analysis result to disk
			const outName = safeFileName.replace(/\.json$/, ".analysis.json");
			const outPath = path.join(analysisDir, outName);
			fs.writeFileSync(outPath, JSON.stringify(analysis || {}, null, 2), "utf8");
			console.info(`→ Analysis for ${filePath} saved to ${outPath}`);

			// e) optionally, record in MongoDB via your Question model
			console.log({
				filePath,
				run: "llama",
				analysis,
				createdAt: new Date(),
			})
		} catch (error) {
			console.error(`Failed to process ${filePath}:`, error);
		}
	}

	// 5) clean up
	await db.disconnect();
	console.info("All analyses completed.");
}

await main().catch((error) => {
	console.error("Fatal error in main():", error);
});
