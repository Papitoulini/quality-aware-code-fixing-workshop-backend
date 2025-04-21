import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const questionSchema = new Schema(
	{
		index: { type: Number, required: true },
		code: { type: mongoose.Schema.Types.ObjectId, ref: "Snippet" },
		description: { type: String, required: true },
		question: { type: String, required: true },
		analysis: { type: Object, required: true },
		// // 
		// acceptedFix: { type: String, required: false },
		// rejectedFix: { type: String, required: false },
	},
	{ timestamps: true, strict: false, toObject: { versionKey: false } },
);

questionSchema.plugin(mongooseLeanDefaults.default);

export default questionSchema;
