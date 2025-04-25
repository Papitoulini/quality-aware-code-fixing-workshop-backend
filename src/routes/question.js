/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import Sentry from "@sentry/node";
import express from "express";
import multer from "multer";

import { analyzeFile } from "#utils";

import { models } from "#dbs";

const { Question } = models;

const uploadFolderPath = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..", "assets/uploads");

const storage = multer.diskStorage({
	destination: (req, _file, cb) => {
		cb(null, uploadFolderPath);
	},
	filename: (req, file, cb) => {
		req.body.originalName = file.originalname;

		let name = file.originalname;
		name = name.replaceAll(/\s/g, ""); // Replace the special characters

		const folder = Date.now().toString();
		const saveName = `${folder}-${name}`;

		req.body.saveName = saveName;

		// Create the folder with the project id if it does not exist
		try {
			fs.mkdirSync(path.join(uploadFolderPath, folder));
		} catch { /* empty */ }

		// Pass folder to the request body
		req.body.folder = folder;

		cb(null, path.join(folder, saveName));
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
		const { folder, saveName, description, question } = req.body;
		if (!saveName) {
			return res.json({ success: false, message: "File Not Found" });
		}

		if (!description || !question) {
			return res.json({ success: false, message: "Please Fill All Necessary Fields" });
		}

		const analysisResults = await analyzeFile(path.join(uploadFolderPath, folder), saveName);
		if (!analysisResults) {
			return res.json({ success: false, message: "File Analysis Was Not Completed" });
		}

		const code = fs.readFileSync(path.join(uploadFolderPath, folder, saveName), "utf8");

		const analysis = {
			sumOfSquaredQuality: analysisResults?.sumOfSquaredQuality || null,
			harmonicMeanQuality: analysisResults?.harmonicMeanQuality || null,
			...analysisResults?.scores,
		};

		const maxIndex = await Question.findOne().sort({ index: -1 }).lean();
		const index = maxIndex ? maxIndex.index + 1 : 1;

		const newQuestion = new Question({
			index,
			code,
			description,
			question,
			analysis,
		});
		await newQuestion.save();

		return res.json({
			success: true,
			message: "Query Was Not Found",
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.json({ message: "Something Went Wrong" });
	}
});

router.get("/:index", async (req, res) => {
	try {
		const { index } = req.params;

		const question = await Question.findOne({ index: Number.parseInt(index) }).populate("code").lean();
		console.log(question, { index: Number.parseInt(index) });
		question.code = question.code.code;
		if (!question) {
			return res.json({ success: false, message: "Query Not Found" });
		}

		const nextQuestion = await Question.exists({ index: question.index + 1 });

		return res.json({ success: true, question, hasNext: Boolean(nextQuestion) });
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

export default router;
