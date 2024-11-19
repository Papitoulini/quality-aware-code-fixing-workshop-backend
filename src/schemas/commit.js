import mongoose from "mongoose";

const { Schema } = mongoose;

const fileSchema = new Schema({
	filename: String,
	additions: { type: Number, default: 0 },
	deletions: { type: Number, default: 0 },
}, { toObject: { versionKey: false } });

const noteEditSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now },
}, { _id: false, toObject: { versionKey: false } });

const commitSchema = new Schema(
	{
		repositories: [{ type: Schema.Types.ObjectId, ref: "Repository", required: true }],
		branches: [{ type: String }],
		hash: { type: String, required: true },
		authoredAt: Date,
		author: { type: String, required: true },
		message: { type: String, default: "" },
		note: {
			body: { type: String, default: "" },
			edits: [noteEditSchema],
		},
		additions: { type: Number, default: 0 },
		deletions: { type: Number, default: 0 },
		files: [fileSchema],
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

export default commitSchema;
