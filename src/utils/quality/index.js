import path from "node:path";

import analyzers from "./analyzers/index.js";

const analyzeFile = async (folder, fileName) => {
	const toAnalyze = new Set(["sast"]);
	const filePath = path.join(folder, fileName);
	const results = await Promise.all(
		Object.keys(analyzers).map(async (key) => {
			if (toAnalyze.has(key)) {
				return { [key]: await analyzers[key](filePath, folder) }; // Run the function if it is in `toAnalyze`
			}

			return { [key]: null }; // Return null for the functions not in `toAnalyze`
		}),
	);
	const finalResults = results.reduce((acc, result) => Object.assign(acc, result), {});

	const scores = {
		CC: finalResults?.metrics?.metricsScores?.ESCOMP_CC?.avgScore || 0,
		MI: finalResults?.metrics?.metricsScores?.ESCOMP_MI?.avgScore || 0,
		CD: finalResults?.metrics?.metricsScores?.ESCOMP_CD?.avgScore || 0,
		LOC: finalResults?.metrics?.metricsScores?.ESCOMP_LOC?.avgScore || 0,
		PAR: finalResults?.metrics?.metricsScores?.ESCOMP_PAR?.avgScore || 0,
		IMPORTS: finalResults?.metrics?.metricsScores?.ESCOMP_IMPORTS?.avgScore || 0,
		VIOLATIONS: finalResults?.violations?.violationsScores?.ESLINT_ERR?.avgScore || 0,
	};

	const sumOfSquaredQuality = Math.sqrt(
		Object.values(scores).reduce((acc, score) => acc + score ** 2, 0) / 7,
	);

	const harmonicMeanQuality = 7 / Object.values(scores).reduce((acc, score) => acc + 1 / (score === 0 ? 0.0001 : score), 0);

	return { sumOfSquaredQuality, harmonicMeanQuality, scores, ...finalResults };
};

export { analyzeFile };
