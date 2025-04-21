import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Create the user related schema
const snippetSchema = new Schema(
	{
		code: { type: String },
		original: { type: Boolean, default: false },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

snippetSchema.plugin(mongooseLeanDefaults.default);

export default snippetSchema;
