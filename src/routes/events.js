import express from "express";

import analyzer from "#analyzer";
import { attachJarvis } from "#middleware";

const router = express.Router({ mergeParams: true });

router.use(attachJarvis);

router.post("/jarvis", async (req, res) => {
	const { owner, name, hash, relatedHash } = req.body;
	console.log("relatedHash:", relatedHash);
	const response = await analyzer(owner, name, hash);

	return res.json(response);
});

export default router;
