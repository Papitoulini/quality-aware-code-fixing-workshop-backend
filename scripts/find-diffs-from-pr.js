/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config.js";

import {  getAnalysisFolderFile, getIntroducedViolationsProps } from "#utils";
import { init, models } from "#dbs";

try {
	const folder = String.raw`C:\\Users\\panpa\\Desktop\\WorkSpace\Cyclopt\dimos-giorgos\thesis\workshop-data`;
	const language = "TypeScript";
	const root = ".";
	const hash = "af1301d504ea6d9df802c34777441a9c1701a73e";
	// claude - violations - d338e53b1a3fb6bb92b6aed30261174d21db721f
	// claude - sast - af1301d504ea6d9df802c34777441a9c1701a73e
	// llama - violations - 0a87ce6c143aa72c1bb14676f7e85eb2e368690f
	// llama - sast - 880bd514633f3fe0546c9e908c5e8a4234cc5921
	// deepseek - sast- b821a3b384cf125829390cdfb062e7aaefc85620
	// const proccesOutputFileName = "deepseek-quereis.json";
	const type = "sast";

	// Initialize DB and models
	const db = await init();
	const { Commit } = models;
	const commit = await Commit.findOne({ hash, author: { $ne: "maintainability-pal" } });

	if (!commit) {
		throw new Error(`Commit with hash ${hash} not found or has disallowed author.`);
	}
	
	// Retrieve violation properties
	const props = await getIntroducedViolationsProps(commit._id, language, root);
	const { fromAnalysis, toAnalysis } = props;
	
	if (type === "sast") {
		const [oldSast, newSast] = await Promise.all([
			getAnalysisFolderFile(fromAnalysis, "sast.json", { ignoreInternalId: true }),
			getAnalysisFolderFile(toAnalysis, "sast.json", { ignoreInternalId: true }),
		]);

		console.log(fromAnalysis, toAnalysis)
		
		// throw new Error(`Commit with hash ${hash} not found or has disallowed author.`);
		const oldSastFindings = oldSast?.content?.sast;
		const newSastFindings = newSast?.content?.sast;

		console.log(oldSastFindings, newSastFindings)

		fs.writeFileSync(
			path.join(folder, "enhanced-sast-claude-processed.json"),
			JSON.stringify({ oldSast, newSast, fromAnalysis, toAnalysis }, null, 2)
		);
	} else {}

	// Disconnect from the database
	await db.disconnect();
	console.info("Processing completed successfully.");
} catch (error) {
	console.log(error);
	console.error("An error occurred:", error);
	process.exit(1);
}
