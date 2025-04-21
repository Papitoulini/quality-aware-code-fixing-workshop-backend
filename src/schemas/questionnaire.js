import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Create the user related schema
const questionnaireSchema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
		qualityImprovement: { type: Number },
		quolyRecommendations: { type: Number },
		llmExperience: { type: Number },
		quolyLlmExperience: { type: Number },
		quolyLlmQuality: { type: Number },
		sus1: { type: Number },
		sus2: { type: Number },
		sus3: { type: Number },
		sus4: { type: Number },
		sus5: { type: Number },
		sus6: { type: Number },
		sus7: { type: Number },
		sus8: { type: Number },
		sus9: { type: Number },
		sus10: { type: Number },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

questionnaireSchema.plugin(mongooseLeanDefaults.default);

export default questionnaireSchema;
