import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import Sentry from "@sentry/node";
import express from "express";
import multer from "multer";

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
		const { saveName } = req.body;
		if (!saveName) {
			return res.json({ success: false, message: "Δεν βρέθηκε το αρχείο" });
		}

		return res.json({ success: true });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Κάτι πήγε στραβά" });
	}
});

export default router;
