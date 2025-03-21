/* eslint-disable security/detect-object-injection */
import Github from "./github.js";

const tokenizeCode = (line) => line.split(/\W+/).filter(Boolean);

function jaccardSimilarity(set1, set2) {
	const intersection = new Set([...set1].filter((x) => set2.has(x)));
	const union = new Set([...set1, ...set2]);
	return intersection.size / union.size;
}

const findUniqueBestFuzzyMatchPairs = (fromArray, toArray, startingFromLine, startingToLine) => {
	const pairs = {};
	const usedIndexes = new Set(); // To keep track of used indices from toArray

	for (const [i, element] of fromArray.entries()) {
		const tokens1 = new Set(tokenizeCode(element));
		let bestMatches = [];
		let maxSimilarity = 0;

		// Find the best match in toArray for the current line in fromArray
		for (const [j, element] of toArray.entries()) {
			if (usedIndexes.has(j)) { continue; } // eslint-disable-line no-continue

			const tokens2 = new Set(tokenizeCode(element));
			const similarity = jaccardSimilarity(tokens1, tokens2);

			if (similarity > maxSimilarity) {
				maxSimilarity = similarity;
				bestMatches = [j]; // Start a new list of best matches
			} else if (similarity === maxSimilarity) {
				bestMatches.push(j); // Add to the list of equally good matches
			}
		}

		if (bestMatches.length > 0) {
			// Randomly select one of the best matches if there's a tie
			const chosenMatchIndex = bestMatches[Math.floor(Math.random() * bestMatches.length)];
			pairs[i + startingFromLine] = chosenMatchIndex + startingToLine;
			usedIndexes.add(chosenMatchIndex); // Mark this index as used
		}
	}

	return pairs;
};

const processFiles = (files, patches) => {
	const patchRegex = /@@\s*-(\d+),\d*\s\+(\d+),?\d*\s@@(.*?)(?=(\r?\n@@\s*-\d+,\d+\s\+\d+,\d+\s@@|$))/gs;

	// const allPatchSections = [];

	for (const item of files) {
		const fileName = `/${item.filename}`;
		if (!patches[fileName]) patches[fileName] = [];

		const patchSections = item.patch ? [...item.patch.matchAll(patchRegex)] : [];
		// allPatchSections.push(patchSections);
		for (const patch of patchSections) {
			const [_, patchStartingFrom, patchStartingTo, content] = patch;
			const lines = content.split(/\r?\n/);
			const initialFromLine = Number.parseInt(patchStartingFrom, 10) - 1;
			const initialToLine = Number.parseInt(patchStartingTo, 10) - 1;

			let startingFromLine = 0;
			let startingToLine = 0;
			let finishFromLine = 0;
			let finishToLine = 0;
			let startedChange = false;
			let fromLineCount = initialFromLine;
			let toLineCount = initialToLine;
			const additions = [];
			const deletions = [];

			for (const line of lines) {
				const trimmedLine = line.trim();
				if (!startedChange && (trimmedLine.startsWith("+") || trimmedLine.startsWith("-"))) {
					startedChange = true;
					startingFromLine = fromLineCount;
					finishFromLine = fromLineCount - 1;
					startingToLine = toLineCount;
					finishToLine = toLineCount - 1;
					additions.length = 0;
					deletions.length = 0;
				}

				if (trimmedLine.startsWith("+")) {
					finishToLine = toLineCount;
					additions.push(trimmedLine);
					toLineCount += 1;
				} else if (trimmedLine.startsWith("-")) {
					deletions.push(trimmedLine);
					finishFromLine = fromLineCount;
					fromLineCount += 1;
				} else {
					if (startedChange) {
						const changes = findUniqueBestFuzzyMatchPairs(deletions, additions, startingFromLine, startingToLine);

						patches[fileName].push({
							startingFromLine,
							finishFromLine,
							startingToLine,
							finishToLine,
							changes,
						});
						startedChange = false;
					}

					fromLineCount += 1;
					toLineCount += 1;
				}
			}

			const changes = findUniqueBestFuzzyMatchPairs(deletions, additions, startingFromLine, startingToLine);

			// Capture any remaining changes that didn't end with a context line
			if (startedChange) {
				patches[fileName].push({
					startingFromLine,
					finishFromLine,
					startingToLine,
					finishToLine,
					changes,
				});
			}
		}
	}

	// fs.writeFileSync("allPatchSections.json", JSON.stringify(allPatchSections, null, 2));
};

const getPatchedInfo = async (owner, name, user, hash, type) => {
	const patches = {};
	let files = [];
	const changedFileNameMapping = {};

	if (type === "github") {
		const { rest } = Github(user.github.token);
		try {
			const { data: commit } = await rest("GET /repos/{owner}/{repo}/commits/{ref}", {
				owner, repo: name, ref: hash, headers: { "X-GitHub-Api-Version": "2022-11-28" },
			});
			({ files } = commit);
			for (const file of files.filter((f) => f.status === "renamed")) {
				changedFileNameMapping[`/${file.previous_filename}`] = `/${file.filename}`;
			}
			// fs.writeFileSync("files.json", JSON.stringify(files, null, 2));

			processFiles(files, patches);
			return { patches, changedFileNameMapping };
		} catch (error) {
			console.log(error)
			return { patches, changedFileNameMapping };
		}
	}

	return { patches, changedFileNameMapping };
};

export default getPatchedInfo;
