import Sentry from "@sentry/node";
import express from "express";

import { models } from "#dbs";

const { User } = models;
const router = express.Router({ mergeParams: true });

router.get("/attempt-auth/", (req, res) => res.json({ ok: true }));

router.post("/register", async (req, res) => {
	try {
		const {
			fullname,
			email,
			code,
			programmingExperience,
			programmingLevel,
			javascriptLevel,
			qualityLevel,
			llmLevel,
			llmHow,
			gpt,
			claude,
			llama,
			gemini,
			alreadyRegistered: aR,
		} = req.body;

		const alreadyRegistered = aR === "true";

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			if (alreadyRegistered) {
				return res.json({
					success: true,
					message: "User Saved Successfully",
					id: existingUser._id,
				});
			}
			existingUser.email = email;
			existingUser.code = code;
			existingUser.fullname = fullname;
			existingUser.experience = {
				programmingYears: programmingExperience,
				programmingLevel,
				javascriptLevel,
				qualityLevel,
				llmLevel,
				llmHow,
				llmUsage: {
					gpt,
					claude,
					llama,
					gemini,
				},
			};
			await existingUser.save();

			return res.json({
				success: true,
				message: "User Saved Successfully",
				id: existingUser._id,
			});
		}

		const newUser = new User({
			fullname,
			email,
			code,
			experience: {
				programmingYears: programmingExperience,
				programmingLevel,
				javascriptLevel,
				qualityLevel,
				llmLevel,
				llmHow,
				llmUsage: {
					gpt,
					claude,
					llama,
					gemini,
				},
			},
		});
		await newUser.save();

		return res.json({
			success: true,
			message: "User Saved Successfully",
			id: newUser._id,
		});
	} catch (error) {
		console.log(error)
		Sentry.captureException(error);
		return res.json({ message: "Something Went Wrong" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).lean();
		if (!user) {
			return res.json({ success: false, message: "User Not Found" });
		}

		return res.json({ success: true, user });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

export default router;
