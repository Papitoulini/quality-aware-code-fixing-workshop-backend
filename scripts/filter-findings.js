/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import { init } from "#dbs";

// const hash = "70a8d22b75e173df5f4ca1612bdcdaf692b7f125"; // orginal hash
// claude - violations - d338e53b1a3fb6bb92b6aed30261174d21db721f
// claude - sast - af1301d504ea6d9df802c34777441a9c1701a73e
// llama - violations - 0a87ce6c143aa72c1bb14676f7e85eb2e368690f
// llama - sast - 880bd514633f3fe0546c9e908c5e8a4234cc5921
// deepseek - sast- b821a3b384cf125829390cdfb062e7aaefc85620

const filename = process.argv[2];
const model = process.argv[3];

const maskFilePath = (filePath) =>  filePath.replace(/\.[jt]s$/, "").replaceAll(/[/\\]/g, "__") + ".json";

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
		"workshop-data",
	);

	const fixes = JSON.parse(
		fs.readFileSync(path.join(dataDir, filename), "utf8")
	);

	const comparisonFolder = path.join(
		dataDir,
		"comparisons",
		model,
	);

	const outputDir = path.join(
		dataDir,
		"filtered",
		model,
	);

	const filePaths = [... new Set(fixes.oldSast.content.sast.map((s) => s.path))]

	const filtered = [];

	for (const filePath of filePaths) {
		const safeFilePath = maskFilePath(filePath);
		const fileContent = JSON.parse(
			fs.readFileSync(path.join(comparisonFolder, safeFilePath), "utf8")
		);

		if (fileContent.dif < 0 && fileContent.oldVersion.lineCount < 300) {
			filtered.push(fileContent);
		}
	}

	fs.mkdirSync(outputDir, { recursive: true });
	for (const file of filtered) {
		// 2) Make sure it exists (recursive: true will create any missing parents)
		const safeName = maskFilePath(file.filePath); 
		const outFile = path.join(outputDir, safeName);

		fs.writeFileSync(outFile, JSON.stringify(file, null, 2), "utf8");
	}

	await db.disconnect();
}

await main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
