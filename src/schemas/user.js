import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Create the user related schema
const userSchema = new Schema(
	{
		fullname: { type: String },
		email: { type: String },
		code: { type: String },
		experience: {
			programmingYears: { type: Number },
			programmingLevel: { type: Number },
			javascriptLevel: { type: Number },
			qualityLevel: { type: Number },
			llmLevel: { type: Number },
			llmHow: { type: String },
			llmUsage: {
				gpt: { type: Boolean },
				claude: { type: Boolean },
				llama: { type: Boolean },
				gemini: { type: Boolean },
			},
		},
	},
	{ timestamps: true, strict: false, toObject: { versionKey: false } },
);

userSchema.plugin(mongooseLeanDefaults.default);

export default userSchema;
