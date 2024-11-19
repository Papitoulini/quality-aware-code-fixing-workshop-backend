import mongoose from "mongoose";

const { Schema } = mongoose;

const repositorySchema = new Schema(
	{
		providerId: { type: String },
		name: { type: String, required: true },
		owner: { type: String, required: true },
		isPrivate: { type: Boolean, default: true },
		branches: { type: Array, default: [] },
		productionBranch: { type: String },
		addedBy: { type: Schema.Types.ObjectId, ref: "User" },
		language: { type: String, default: null },
		root: { type: String, default: "." },
		csProjects: { type: Array, default: [] },
		isActive: { type: Boolean, default: true },
		vcType: { type: String, default: "git", enum: ["git", "tfvc"] },
		tags: { type: Array, default: [] },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

export default repositorySchema;
