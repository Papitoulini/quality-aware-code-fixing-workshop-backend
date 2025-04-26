import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const userResponseSchema = new Schema(
	{
		question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
		snippet: { type: mongoose.Schema.Types.ObjectId, ref: "Snippet" },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		analysis: { type: Array, required: true }
	},
	{ timestamps: true, strict: false, toObject: { versionKey: false } },
);

userResponseSchema.plugin(mongooseLeanDefaults.default);

export default userResponseSchema;
