import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import Sentry from "@sentry/node";
import express from "express";
import multer from "multer";

import { analyzeFile } from "#utils";
import { models } from "#dbs";

const { Snippet, UserResponse } = models;

const uploadRoot = path.join(
	path.dirname(url.fileURLToPath(import.meta.url)),
	"..",
	"assets/uploads"
);

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadRoot),
	filename: async (req, file, cb) => {
		const userId = req.body.userId || "unknown";
		const questionId = req.body.questionId || "unknown";

		// **NEW**: fixed subfolder under each question
		const subfolder = "analysis";

		// clean up original name
		const cleanName = file.originalname.replaceAll(/\s+/g, "");
		const timestamp = Date.now().toString();
		const saveName = `${timestamp}-quality-${cleanName}`;

		// build the relative path: <userId>/<questionId>/<subfolder>
		const relDir = path.join(userId, questionId, subfolder);
		const absDir = path.join(uploadRoot, relDir);

		// ensure it exists
		await fs.mkdir(absDir, { recursive: true });

		// stash for later handlers
		req.body.saveName = saveName;
		req.body.folder = relDir;   // e.g. "123/456/analysis"

		// final on‐disk path is <uploadRoot>/<relDir>/<saveName>
		cb(null, path.join(relDir, saveName));
	},
});

const upload = multer({ storage }).fields([
	{ name: "file", maxCount: 1 }
]);

const router = express.Router({ mergeParams: true });

// POST: upload and start analysis
router.post("/", upload, async (req, res) => {
	const { saveName, folder, questionId, userId } = req.body;
	if (!saveName) return res.json({ success: false, message: "File Not Found" });

	const folderPath = path.join(uploadRoot, folder);
	const filePath = path.join(folderPath, saveName);

	try {
		const code = await fs.readFile(filePath, "utf8");
		const snippet = await Snippet.create({ code, original: false });
		const userResponse = await UserResponse.create({
			question: questionId,
			snippet: snippet._id,
			user: userId,
			status: "inprogress",
		});

		res.json({ success: true, userResponseId: userResponse._id });

		const analysisResults = await analyzeFile(folderPath, saveName);
		await UserResponse.findByIdAndUpdate(userResponse._id, {
			analysis: analysisResults?.sast?.sast || [],
			status: "completed",
		});

		// 4) clean up
		await fs.rm(folderPath, { recursive: true, force: true });
		return;
	} catch (error) {
		Sentry.captureException(error);
		// best effort cleanup
		try { await fs.rm(folderPath, { recursive: true, force: true }); } catch {}
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

// GET: poll analysis status
router.get("/:USER_RESPONSE_ID", async (req, res) => {
	const { USER_RESPONSE_ID } = req.params;

	try {
		const userResponse = await UserResponse.findById(USER_RESPONSE_ID);
		if (!userResponse) return res.json({ success: false, message: "User Response Not Found" });
		return res.json({ success: true, status: userResponse.status, quality: userResponse.analysis || [] });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

export default router;
