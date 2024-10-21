import mongoose from "mongoose";

const { Schema } = mongoose;

const configurationSchema = new Schema({
	name: { type: String, required: true },
	url: { type: String, required: true },
	organization: { type: String, required: true },
	thresholds: {
		disk: {
			value: { type: Number, default: 75 },
			notified: { type: Boolean, default: false },
		},
		cpu: {
			value: { type: Number, default: 95 },
			notified: { type: Boolean, default: false },
		},
		ram: {
			value: { type: Number, default: 95 },
			notified: { type: Boolean, default: false },
		},
	},
	timeinterval: { type: Number, default: 5 },
	collectAt: { type: Date, default: null },
}, { timestamps: true, toObject: { versionKey: false } });

export default configurationSchema;
