/* eslint-disable security/detect-object-injection */
import { models } from "#dbs";

const { Snippet, Analysis, Cluster } = models;

const findSimilarSnippets = async (question, model = "llama", isBadExample = false) => {
	const field = isBadExample ? "bSnippets" : "gSnippets";
	const cluster = await Cluster.findOne({ centroid: question.code, model }).select(field);
	console.log(cluster, question._id )

	const similarSnippets = [];
	const clusterSnippets = await Snippet.find({ _id: { $in: cluster[field] } }).select("_id code");
	for (const snippet of clusterSnippets) {
		// const analysis = await Analysis.findOne({ snippet: snippet._id }).select("-_id -__v -snippet -createdAt -updatedAt");
		// similarSnippets.push({ ...snippet.toObject(), ...analysis.toObject() });
		similarSnippets.push({ ...snippet.toObject() });
	}

	similarSnippets;
	return similarSnippets;
};

export default findSimilarSnippets;
