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

		console.log({
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
			alreadyRegistered,
		});

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			if (alreadyRegistered) {
				return res.json({
					success: true,
					message: "Ο χρήστης αποθηκεύτηκε με επιτυχία",
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
				message: "Ο χρήστης αποθηκεύτηκε με επιτυχία",
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
			message: "Ο χρήστης αποθηκεύτηκε με επιτυχία",
			id: newUser._id,
		});
	} catch (error) {
		console.log(error)
		Sentry.captureException(error);
		return res.json({ message: "Κάτι πήγε στραβά" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).lean();
		if (!user) {
			return res.json({ success: false, message: "Ο χρήστης δεν βρέθηκε" });
		}

		return res.json({ success: true, user });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Κάτι πήγε στραβά" });
	}
});

export default router;
