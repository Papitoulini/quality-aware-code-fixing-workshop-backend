/* eslint-disable security/detect-object-injection */
import mongoose from "mongoose";

import { findSimilarity } from "./utilities/index.js";

import { models } from "#dbs";

const { Snippet, Analysis, Cluster } = models;

const mappings = {
	"67436913d7109bc378f0dcad": "6743903b488570525c862405",
	"67437b4fc29c1096706eeeb1": "6743903c488570525c86241b",
	"67437c42c99243f30282c534": "6743903b488570525c862407",
	"67437e6525d11f9577dbfa4d": "6743903c488570525c862417",
	"674382cbc0b31370cd484152": "6743903c488570525c862419",
	"6744d0a53af7ef79a21d075a": "6744d47a4484f276d13189c4",
	"6744d1d0a382fcd9037f0a3c": "6744d48b4484f276d13189c5",
	"6744d2c1a382fcd9037f0a3f": "6744d49b4484f276d13189c6",
	"6744dd03f35a6098c1fde609": "6744de704484f276d13189c9",
	"6744de06f35a6098c1fde60c": "6744deb04484f276d13189ca",
};

const findSimilarSnippets = async (code, id) => {
	const similarityThreshold = 40;
	const cluster = await Cluster.findById(new mongoose.Types.ObjectId(mappings[id])).select("snippets");

	const similarSnippets = [];
	const clusterSnippets = await Snippet.find({ _id: { $in: cluster.snippets } }).select("_id code");
	for (const snippet of clusterSnippets) {
		const similarity = await findSimilarity(code, snippet.code);
		if (similarity >= similarityThreshold) {
			const analysis = await Analysis.findOne({ snippet: snippet._id }).select("-_id -__v -snippet -createdAt -updatedAt");
			similarSnippets.push({ ...snippet.toObject(), similarity, ...analysis.toObject() });
		}
	}

	similarSnippets.sort((a, b) => b.similarity - a.similarity);
	return similarSnippets;
};

export default findSimilarSnippets;
