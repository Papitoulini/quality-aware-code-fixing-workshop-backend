import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const fileAnalysisSchema = new Schema(
	{
		snippet: { type: mongoose.Schema.Types.ObjectId, ref: "Snippet" },
	},
	{ timestamps: true, strict: false, toObject: { versionKey: false } },
);

fileAnalysisSchema.plugin(mongooseLeanDefaults.default);

export default fileAnalysisSchema;
