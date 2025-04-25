import Sentry from "@sentry/node";
import express from "express";

import { models } from "#dbs";

const { Questionnaire } = models;

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
	try {
		const {
			id,
			qualityImprovement,
			quolyRecommendations,
			llmExperience,
			quolyLlmExperience,
			quolyLlmQuality,
			sus1,
			sus2,
			sus3,
			sus4,
			sus5,
			sus6,
			sus7,
			sus8,
			sus9,
			sus10,
		} = req.body;

		const existingQuestionnaire = await Questionnaire.findOne({ user: id });
		if (existingQuestionnaire) {
			existingQuestionnaire.qualityImprovement = qualityImprovement;
			existingQuestionnaire.quolyRecommendations = quolyRecommendations;
			existingQuestionnaire.llmExperience = llmExperience;
			existingQuestionnaire.quolyLlmExperience = quolyLlmExperience;
			existingQuestionnaire.quolyLlmQuality = quolyLlmQuality;
			existingQuestionnaire.sus1 = sus1;
			existingQuestionnaire.sus2 = sus2;
			existingQuestionnaire.sus3 = sus3;
			existingQuestionnaire.sus4 = sus4;
			existingQuestionnaire.sus5 = sus5;
			existingQuestionnaire.sus6 = sus6;
			existingQuestionnaire.sus7 = sus7;
			existingQuestionnaire.sus8 = sus8;
			existingQuestionnaire.sus9 = sus9;
			existingQuestionnaire.sus10 = sus10;
			await existingQuestionnaire.save();

			return res.json({
				success: true,
				message: "Questionnaire saved successfully",
			});
		}

		const newQuestionnaire = new Questionnaire({
			user: id,
			qualityImprovement,
			quolyRecommendations,
			llmExperience,
			quolyLlmExperience,
			quolyLlmQuality,
			sus1,
			sus2,
			sus3,
			sus4,
			sus5,
			sus6,
			sus7,
			sus8,
			sus9,
			sus10,
		});
		await newQuestionnaire.save();

		return res.json({
			success: true,
			message: "Questionnaire saved successfully",
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ message: "Something Went Wrong" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const existingQuestionnaire = await Questionnaire.findOne({ user: id });
		if (!existingQuestionnaire) {
			const newQuestionnaire = new Questionnaire({ user: id });
			await newQuestionnaire.save();
			return res.json({ success: true, questionnaire: newQuestionnaire });
		}

		return res.json({ success: true, questionnaire: existingQuestionnaire });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

export default router;
