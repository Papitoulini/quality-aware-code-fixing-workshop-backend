import mongoose from "mongoose";
import * as Sentry from "@sentry/node";
import constructUrl from "@iamnapo/construct-url";

import {
	user,
	repository,
	commit,
	analysis,
	advisory,
	configuration,
	qualityGate,
	qualityGateResult,
	project,
} from "./schemas/index.js";

export const init = async (cluster_, dbName_) => {
	const { CLUSTER_URL, TEST_CLUSTER_URL, DB_NAME } = process.env;
	const cluster = cluster_ || CLUSTER_URL || TEST_CLUSTER_URL;
	const dbName = dbName_ || DB_NAME || "cyclopt";
	const clusterUri = constructUrl(cluster, "", {
		retryWrites: true,
		compressors: "zstd",
		w: "majority",
		readConcernLevel: "majority",
		authSource: "admin",
	});

	mongoose.set("strictQuery", false);

	try {
		return await mongoose.connect(clusterUri, { dbName });
	} catch (error_) {
		Sentry.captureException(error_);
		console.error("MongoDB connection error:", error_.message);
		return null;
	}
};

export const models = {
	User: mongoose.model("User", user),
	Repository: mongoose.model("Repository", repository),
	Commit: mongoose.model("Commit", commit),
	Analysis: mongoose.model("Analysis", analysis),
	Advisory: mongoose.model("Advisory", advisory),
	Configuration: mongoose.model("Configuration", configuration),
	QualityGate: mongoose.model("QualityGate", qualityGate),
	QualityGateResult: mongoose.model("QualityGateResult", qualityGateResult),
	Project: mongoose.model("Project", project),
};
