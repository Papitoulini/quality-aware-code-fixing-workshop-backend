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

const qualityGateResultSchema = new Schema(
	{
		analysis: { type: Schema.Types.ObjectId, ref: "Analysis" },
		qualityGate: { type: Schema.Types.ObjectId, ref: "QualityGate" },
		status: { type: String, enum: ["passed", "failed", "not computed"] },
		testedConditions: [{
			_id: false,
			condition: { _id: false, type: qualityGateConditionSchema, required: true },
			status: { type: String, enum: ["passed", "failed", "not computed"] },
			value: { type: Schema.Types.Mixed, required: true },
		}],
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

export default qualityGateResultSchema;
