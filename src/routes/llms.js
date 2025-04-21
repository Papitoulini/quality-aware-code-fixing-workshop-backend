import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import Sentry from "@sentry/node";
import express from "express";
import multer from "multer";

import { LLMS } from "../utils/index.js";

const uploadFolderPath = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..", "assets/uploads");

const storage = multer.diskStorage({
	destination: (req, _file, cb) => {
		cb(null, uploadFolderPath);
	},
	filename: (req, file, cb) => {
		req.body.originalName = file.originalname;

		let name = file.originalname;
		name = name.replaceAll(/\s/g, ""); // Replace the special characters

		const folder = req?.body?.userId || "unknown";
		const questionFolder = req?.body?.questionId || "unknown";
		const timestamp = Date.now().toString();
		const saveName = `${timestamp}-llm-${name}`;

		req.body.saveName = saveName;

		// Create the folder with the project id if it does not exist
		try {
			fs.mkdirSync(path.join(uploadFolderPath, folder, questionFolder), { recursive: true });
		} catch { /* empty */ }

		const querySaveName = `${timestamp}-llm-query-${req?.originalUrl?.split("/").at(-1)}.txt`;
		fs.writeFileSync(path.join(uploadFolderPath, folder, questionFolder, querySaveName), req?.body?.query);

		// Pass folder to the request body
		req.body.folder = path.join(folder, questionFolder);

		cb(null, path.join(folder, questionFolder, saveName));
	},
});

const upload = multer({
	storage,
	fileFilter: (req, _, cb) => cb(null, true),
}).fields([
	{ name: "file", maxCount: 1 },
]);

const router = express.Router({ mergeParams: true });

router.post("/gpt", upload, async (req, res) => {
	try {
		const { query } = req.body;
		if (!query) return res.json({ success: false, message: "Δεν βρέθηκε το ερώτημα" });

		const { folder, saveName } = req.body;
		if (!saveName) {
			return res.json({ success: false, message: "Δεν βρέθηκε το αρχείο" });
		}

		const oldCode = fs.readFileSync(path.join(uploadFolderPath, folder, saveName), "utf8");
		const enhancedQuery = `${query}\n\n${oldCode}\n\nThe response should contain only the resulting code and nothing else`;

		const llm = LLMS();
		const response = await llm.post("", {
			json: {
				"model": "llama", // or claude
				"message": enhancedQuery
			},
		}).json();

		const newCode = response.response;
		const code = newCode.replace(/^```javascript\n/, "").replace(/\n```$/, "");
		const newName = saveName.replace(".js", "-new.js");
		fs.writeFileSync(path.join(uploadFolderPath, folder, newName), code);

		console.log(code)

		return res.json({ success: true, code: { old: oldCode, new: code } });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Κάτι πήγε στραβά" });
	}
});

router.post("/claude", upload, async (req, res) => {
	try {
		const { query } = req.body;
		if (!query) return res.status(400).json({ message: "Δεν βρέθηκε το ερώτημα" });

		const { folder, saveName } = req.body;
		if (!saveName) {
			return res.status(400).json({ message: "Δεν βρέθηκε το αρχείο" });
		}

		const oldCode = fs.readFileSync(path.join(uploadFolderPath, folder, saveName), "utf8");
		const enhancedQuery = `${query}\n\n${oldCode}\n\nThe response should contain only the resulting code and absolutely nothing else`;

		const llm = LLMS();
		const response = await llm.post("", {
			json: {
				"model": "claude", // or claude
				"message": enhancedQuery
			},
		}).json();

		console.log(response);

		const newCode = response.response;
		const code = newCode.replace(/^```javascript\n/, "").replace(/\n```$/, "");
		const newName = saveName.replace(".js", "-new.js");
		fs.writeFileSync(path.join(uploadFolderPath, folder, newName), code);

		return res.json({ success: true, code: { old: oldCode, new: code } });
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.json({ success: false, message: "Κάτι πήγε στραβά" });
	}
});

export default router;
