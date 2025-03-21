import path from "node:path/posix";

// eslint-disable-next-line import/no-unresolved
import { parse } from "csv-parse/sync";
import { Storage } from "@google-cloud/storage";

import { models } from "#dbs";

const { Analysis } = models;

const { GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_ENVIRONMENT, GOOGLE_CLOUD_CLIENT_EMAIL, GOOGLE_CLOUD_PRIVATE_KEY } = process.env;
export const storage = new Storage({
	credentials: {
		private_key: String(Buffer.from(GOOGLE_CLOUD_PRIVATE_KEY, "base64")),
		client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
	},
	projectId: GOOGLE_CLOUD_PROJECT_ID,
	retryOptions: {
		autoRetry: true,
		maxRetries: 5,
	},
});

export const generateAnalysisCloudPath = (analysis, file, includeInternalId = true) => {
	const language = analysis.language === "C#" ? "csharp" : analysis.language.toLowerCase();
	const processedFilename = path.join(
		GOOGLE_CLOUD_ENVIRONMENT,
		language || "global",
		analysis.internalId,
		file
			? includeInternalId
				? `${analysis?.internalId}_${file}`
				: file
			: "",
	);
	return processedFilename;
};

export const getCloudAnalysis = async (dbAnalysis, options) => {
	try {
		const metricsRecommendations = options?.metricsRecommendations ?? true;
		const violations = options?.violations ?? true;

		const analysis = (typeof dbAnalysis === "string")
			? await Analysis.findById(dbAnalysis).lean().exec()
			: dbAnalysis;

		if (analysis?.metricsRecommendations && analysis?.violationsInfo?.violations) return analysis;

		const processedFilename = generateAnalysisCloudPath(analysis, "report.json");
		const file = await storage.bucket("cyclopt-platform").file(processedFilename).download();
		const { violations: v, metricsRecommendations: m = JSON.parse(file)?.metricsRecommendation } = JSON.parse(file);
		if (metricsRecommendations) analysis.metricsRecommendations = m;
		if (violations) analysis.violationsInfo = { ...analysis.violationsInfo, violations: v };

		return analysis;
	} catch (error) { console.log(error); return null; }
};

export const getAnalysisFolderFile = async (dbAnalysis, fileName, options) => {
	const ignoreInternalId = options?.ignoreInternalId;

	const file = {
		path: null,
		content: (fileName.endsWith(".txt")) ? ""
			: (fileName.endsWith(".csv")) ? [] : {},
	};

	try {
		const analysis = (typeof dbAnalysis === "string")
			? await Analysis.findById(dbAnalysis).lean().exec()
			: dbAnalysis;

		const analysisPath = generateAnalysisCloudPath(analysis, fileName, !ignoreInternalId);
		const [files] = await storage.bucket("cyclopt-platform").getFiles({ prefix: analysisPath });
		file.path = files.find((f) => f?.name?.endsWith(fileName))?.name;

		if (file?.path) {
			const fileContent = await storage.bucket("cyclopt-platform").file(file.path).download();
			if (file.path?.endsWith(".json")) {
				file.content = JSON.parse(fileContent);
			} else if (file.path?.endsWith(".txt")) {
				file.content = fileContent.toString();
			} else if (file.path?.endsWith(".csv")) {
				file.content = parse(fileContent.toString(), { columns: true });
			}
		}

		return file;
	} catch (error) { console.log(error); return file; }
};
