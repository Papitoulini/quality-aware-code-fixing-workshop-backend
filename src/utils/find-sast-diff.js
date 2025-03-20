/* eslint-disable security/detect-object-injection */
import mapOldLineToNewLine from "./map-old-line-to-new-line.js";
import fs from "node:fs";

/**
 * Processes old violations and maps line numbers using patches.
 */
const processOldSast = (sastFindings = [], patches, changedFileNameMapping) => {
	const processedSast = [];

	for (const { start, end, path: originalFilePath, ...rest } of sastFindings) {
		const filePath = changedFileNameMapping[originalFilePath] || originalFilePath;

		const mappedStartLine = mapOldLineToNewLine(
			filePath,
			start.line,
			patches
		);

		const mappedEndLine = mapOldLineToNewLine(
			filePath,
			end.line,
			patches
		);

		processedSast.push({
			start: { ...start, line: mappedStartLine },
			end: { ...end, line: mappedEndLine },
			path: originalFilePath,
			...rest
		});
	}

	return processedSast;
};

// Create a key for each violation instance
const createViolationKey = (startLine, endLine, message, filePath) => 
	`${startLine}:::${endLine}:::${message}:::${filePath}`;

/**
 * Compares new violations to mapped old violations to find
 * introduced and removed violations.
 */
const findViolationsDiff = (
	newSast,
	oldSast,
	patches = {},
	changedFileNameMapping = {}
) => {
	// Map old line numbers to new lines
	const processedOldSast = processOldSast(oldSast, patches, changedFileNameMapping);

	// Debug info: compare old vs. processed lines
	fs.writeFileSync("AA.json", JSON.stringify(oldSast, null, 2));
	fs.writeFileSync("BB.json", JSON.stringify(processedOldSast, null, 2));

	const introducedSast = [];
	const removedSast = [];

	// Create a set of old violation keys
	const oldSastSet = new Set();
	for (const { start, end, path, message } of processedOldSast) {
		const key = createViolationKey(start.line, end.line, message, path);
		oldSastSet.add(key);
	}

	// Create a set of new violation keys
	const newSastSet = new Set();
	for (const { start, end, path, message } of newSast) {
		const key = createViolationKey(start.line, end.line, message, path);
		newSastSet.add(key);
	}

	// Find introduced violations: new ones not in the old set
	for (const { start, end, path, message, ...rest } of newSast) {
		const key = createViolationKey(start.line, end.line, message, path);
		if (!oldSastSet.has(key)) {
			introducedSast.push({ start, end, path, message, ...rest });
		}
	}

	// Find removed violations: old ones not in the new set
	for (const { start, end, path, message, ...rest } of processedOldSast) {
		const key = createViolationKey(start.line, end.line, message, path);
		if (!newSastSet.has(key)) {
			removedSast.push({ start, end, path, message, ...rest });
		}
	}

	// Return the actual introduced/removed arrays
	return {
		introducedSast,
		removedSast,
	};
};

export default findViolationsDiff;
