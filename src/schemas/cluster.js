import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const clusterSchema = new Schema(
	{
		centroid: { type: mongoose.Schema.Types.ObjectId, ref: "snippets", required: true },
		gSnippets: [{ type: mongoose.Schema.Types.ObjectId, ref: "snippets" }],
		bSnippets: [{ type: mongoose.Schema.Types.ObjectId, ref: "snippets" }],
		model: { type: String, enum: ["llama", "claude"], required: true }
	},
	{ timestamps: true, strict: false, toObject: { versionKey: false } },
);

clusterSchema.plugin(mongooseLeanDefaults.default);

export default clusterSchema;
