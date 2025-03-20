/* eslint-disable security/detect-object-injection */
import { Types } from "mongoose";
import getPreviousCommitHash from "./get-previous-commit.js"
import getPatchedInfo from "./get-patched-info.js"

import { models } from "#dbs";
import { APPLICATIONS, getCloudAnalysis } from "#utils";

const { Analysis, Commit, User } = models;

const APPLICATION = "platformStatistics";

const getIntroducedViolationsProps = async (currentCommitId, language, root, isMaintainabilityPal = false) => {
	const toCommit = await Commit.findById(new Types.ObjectId(currentCommitId)).populate("repositories").select("_id repositories hash files").lean()
		.exec();

	const { _id: toCommitId, hash: toCommitHash, repositories: [{ owner, name: repo, addedBy }] } = toCommit;

	const user = await User.findById({ _id: addedBy }).lean().exec();
	const type = "github";
	const fromCommitHash = await getPreviousCommitHash(owner, repo, user, toCommitHash, type);

	const fromCommit = await Commit.findOne({
		author: { $ne: "maintainability-pal" },
		hash: fromCommitHash,
	}).select("_id files").lean().exec();
	if (!fromCommit) return null;

	const fromAnalysisDB = await Analysis.findOne({
		_id: new Types.ObjectId("679790349d8f704d3b4a745c"),
		commit: fromCommit._id,
		language,
		root,
		"configuration.applications": APPLICATION,
		"configuration.subanalyzersCompleted": { $all: APPLICATIONS[APPLICATION] },
		hasError: false,
		isEmpty: false,
		archived: false,
	}).populate("commit").select("_id language internalId commit").lean().exec();
	const toAnalysisDB = await Analysis.findOne({
		commit: toCommitId,
		language,
		root,
		"configuration.applications": APPLICATION,
		"configuration.subanalyzersCompleted": { $all: APPLICATIONS[APPLICATION] },
		hasError: false,
		isEmpty: false,
		archived: false,
	}).populate("commit").select("_id language internalId commit").lean().exec();

	const { patches, changedFileNameMapping } = await getPatchedInfo(owner, repo, user, toCommitHash, type);

	const fromAnalysis = await getCloudAnalysis(fromAnalysisDB,
		{ isMaintainabilityPal, violations: true, metricsRecommendations: false });
	const toAnalysis = await getCloudAnalysis(toAnalysisDB,
		{ isMaintainabilityPal, violations: true, metricsRecommendations: false });

	const props = {
		fromAnalysis,
		toAnalysis,
		patches,
		changedFileNameMapping,
	};

	return props;
};

export default getIntroducedViolationsProps;
