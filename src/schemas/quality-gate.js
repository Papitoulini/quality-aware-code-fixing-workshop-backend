/* eslint-disable indent */
import mongoose from "mongoose";

const { Schema } = mongoose;

const qualityGateConditionSchema = new Schema(
	{
		// metric: { type: String, required: true },
		metric: { type: [{ type: String }], required: true },
		operator: { type: String, enum: ["<", "<=", "=", ">=", ">", "!="], required: true },
		threshold: { type: Schema.Types.Mixed, required: true },
	},
);

const qualityGateSchema = new Schema(
	{
		name: { type: String, unique: true, required: true },
		conditions: {
			_id: false,
			type: [qualityGateConditionSchema],
			required: true },
		references: {
			organizations: { type: Schema.Types.ObjectId, ref: "Organization", default: null },
			projects: { type: Schema.Types.ObjectId, ref: "Project", default: null },
		},
		branches: { type: [{ type: String }], default: undefined },
		linkedRepositories: { type: [{ type: Schema.Types.ObjectId, ref: "Repository" }], default: undefined },
		isTemplate: { type: Boolean },
		isActive: { type: Boolean },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

export default qualityGateSchema;
