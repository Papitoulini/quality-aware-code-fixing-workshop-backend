import mongoose from "mongoose";

const { Schema } = mongoose;

const vulnerabilitySchema = new Schema({
	name: { type: String, required: true },
	severity: { type: String, required: true },
	firstPatchedVersion: { type: String },
	vulnerableVersionRange: { type: String, required: true },

}, { timestamps: false, toObject: { versionKey: false } });

const advisorySchema = new Schema(
	{
		ecosystem: { type: String, required: true, enum: ["COMPOSER", "PHP", "GO", "MAVEN", "NPM", "NUGET", "PIP", "RUBYGEMS", "PUB"] },
		cve: { type: String, required: true },
		description: { type: String, required: true },
		ghsaId: { type: String, required: true },
		permalink: { type: String, required: true },
		publishedAt: { type: Date, required: true },
		summary: { type: String, required: true },
		withdrawnAt: { type: Date },
		vulnerabilities: [vulnerabilitySchema],
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

export default advisorySchema;
