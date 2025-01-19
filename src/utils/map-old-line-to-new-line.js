const mapOldLineToNewLine = (filePath, oldLine, patches) => {
	const filePatches = patches[filePath];
	if (!filePatches || filePatches.length === 0) return oldLine; // No changes, line stays the same

	// Sort patches by startingFromLine to process them in order
	const sortedPatches = [...filePatches].sort((a, b) => a.startingFromLine - b.startingFromLine);

	let cumulativeOffset = 0;

	for (const hunk of sortedPatches) {
		const {
			startingFromLine,
			finishFromLine,
			startingToLine,
			finishToLine,
			changes,
		} = hunk;

		// The line is before this hunk, so just break, no changes needed
		if (oldLine < startingFromLine) break;

		// Calculate this hunk's net offset
		const oldLen = (finishFromLine - startingFromLine + 1);
		const newLen = (finishToLine - startingToLine + 1);
		const hunkOffset = newLen - oldLen;

		if (oldLine > finishFromLine) {
			// The line is after this hunk, so apply this hunk's offset to future lines
			cumulativeOffset += hunkOffset;
			// Continue to next hunk
		} else {
			// The oldLine is within this hunk's old line range
			// Check if there's a direct mapping in changes
			if (Object.prototype.hasOwnProperty.call(changes, oldLine)) {
				const mappedLine = changes[oldLine];

				// This would mean deletion. Return null since line was removed.
				if (mappedLine === undefined) return null;

				// Line is mapped directly
				return mappedLine + cumulativeOffset;
			}

			// No direct mapping found. Try the "nearest mapped line" heuristic.
			const mappedLines = Object.keys(changes)
				.map((x) => Number.parseInt(x, 10))
				.filter((x) => changes[x] !== undefined);

			if (mappedLines.length > 0) {
				// Find the closest old line key
				let closest = mappedLines[0];
				let minDiff = Math.abs(oldLine - closest);

				for (const ml of mappedLines) {
					const diff = Math.abs(oldLine - ml);
					if (diff < minDiff) {
						minDiff = diff;
						closest = ml;
					}
				}

				// Use the closest mapped line as a reference
				const referenceNewLine = changes[closest];
				if (referenceNewLine === undefined) {
					// If it's undefined, it's deleted, fallback to ratio approach
				} else {
					// Assume lines shift the same as the closest mapped line
					const delta = oldLine - closest;
					const guessedNewLine = referenceNewLine + delta;
					return guessedNewLine + cumulativeOffset;
				}
			}

			// If we reach here, no suitable mapped lines to guess from. Fallback to ratio-based interpolation.
			const ratio = (finishFromLine - startingFromLine === 0)
				? 1
				: (oldLine - startingFromLine) / (finishFromLine - startingFromLine);
			cumulativeOffset += hunkOffset + ratio * (finishToLine - startingToLine);

			cumulativeOffset = Math.ceil(cumulativeOffset);

			return oldLine + cumulativeOffset;
		}
	}

	// If we reached here, no hunk covered this line explicitly, just apply cumulativeOffset
	return oldLine + cumulativeOffset;
};

export default mapOldLineToNewLine;
