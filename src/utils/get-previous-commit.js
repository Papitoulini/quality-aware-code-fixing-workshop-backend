// import fs from "node:fs";

import Github from "./github.js";

const getPreviousCommitHash = async (owner, name, user, hash, type) => {
	let oldCommit = null;
	if (type === "github") {
		const { rest } = Github(user.github.token);
		try {
			const { data } = await rest("GET /repos/{owner}/{repo}/commits/{ref}", {
				owner, repo: name, ref: hash, headers: { "X-GitHub-Api-Version": "2022-11-28" },
			});
			oldCommit = data.parents?.[0].sha;
			return oldCommit;
		} catch (error) {
			console.log(error)
			return null;
		}
	}

	return null;
};

export default getPreviousCommitHash;
