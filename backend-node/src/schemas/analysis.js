import mongoose from "mongoose";

const { Schema } = mongoose;

const analysisSchema = new Schema(
	{
		commit: { type: Schema.Types.ObjectId, ref: "Commit", required: true },
		root: { type: String, default: "." },
		internalId: { type: String, required: true },
		pending: { type: Boolean, default: true },
		csProjects: { type: Array, default: [] },
	},
	{ timestamps: true, strict: false, toObject: { versionKey: false } },
);

export default analysisSchema;
