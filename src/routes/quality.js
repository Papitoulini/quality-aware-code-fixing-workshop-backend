import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import Sentry from "@sentry/node";
import express from "express";
import multer from "multer";

import { analyzeFile } from "#utils";
import { models } from "#dbs";

const { Snippet, UserResponse } = models;

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
		const saveName = `${timestamp}-quality-${name}`;

		req.body.saveName = saveName;

		// Create the folder with the project id if it does not exist
		try {
			fs.mkdirSync(path.join(uploadFolderPath, folder, questionFolder), { recursive: true });
		} catch { /* empty */ }

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

router.post("/", upload, async (req, res) => {
	try {
		const { saveName, folder, questionId, userId, ...rest } = req.body;
		if (!saveName) {
			return res.json({ success: false, message: "File Not Found" });
		}

		const analysisResults = await analyzeFile(path.join(uploadFolderPath, folder), saveName);

		const code = fs.readFileSync(path.join(uploadFolderPath, folder, saveName), 'utf8');

		const snippet = await Snippet.create({
			code,
			original: false,
		})

		await UserResponse.create({
			question: questionId,
			snippet: snippet._id,
			user: userId,
			analysis: analysisResults?.sast?.sast || [],
		});

		return res.json({ success: true, quality: analysisResults?.sast?.sast || [] });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

export default router;
