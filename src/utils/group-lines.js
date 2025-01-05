import { MAX_SNIPPET_LINES } from "./index.js"

const groupLines = (lines, threshold = MAX_SNIPPET_LINES) => {
	lines.sort((a, b) => a - b);

	const groups = [];
	let currentGroup = [];

	for (const line of lines) {
		if (currentGroup.length === 0) {
			currentGroup.push(line);
		} else {
			const prevLine = currentGroup.at(-1);
			if (line - prevLine <= threshold) {
				currentGroup.push(line);
			} else {
				groups.push(currentGroup);
				currentGroup = [line];
			}
		}
	}

	if (currentGroup.length > 0) {
		groups.push(currentGroup);
	}

	return groups;
}

export default groupLines;
