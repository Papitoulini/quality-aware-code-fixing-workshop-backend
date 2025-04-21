import { models } from "#dbs";

const { Analysis, Commit } = models;

const fetchLatestAnalysis = async (commitsQuery, analysisQuery, select, page = 0, docsPerPage = 100) => {
	if (page > 10) return null;

	const commitsBatch = await Commit.find(commitsQuery)
		.sort({ authoredAt: -1 })
		.select("authoredAt hash")
		.skip(page * docsPerPage)
		.limit(docsPerPage)
		.lean()
		.exec();

	const [analysis] = await Analysis.aggregate([
		{ $match: { commit: { $in: commitsBatch.map((c) => c._id) }, ...analysisQuery } },
		{ $lookup: { from: "commits", localField: "commit", foreignField: "_id", as: "commit" } },
		{ $unwind: { path: "$commit" } },
		{ $sort: { "commit.authoredAt": -1 } },
		...(Object.keys(select ?? {})?.length === 0 ? [] : [{ $project: select }]),
		{ $limit: 1 },
	]);

	if (!analysis) {
		const latestAnalysis = await fetchLatestAnalysis(commitsQuery, analysisQuery, select, page + 1, docsPerPage);
		return latestAnalysis;
	}

	return analysis;
};

export default fetchLatestAnalysis;
