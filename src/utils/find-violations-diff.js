/* eslint-disable security/detect-object-injection */
import mapOldLineToNewLine from "./map-old-line-to-new-line.js";

/**
 * Processes old violations and maps line numbers using patches.
 */
const processOldViolations = (violations, patches, changedFileNameMapping) => {
	const processedViolations = {};

	for (const [ruleId, violationData] of Object.entries(violations)) {
		const { files, ...rest } = violationData;
		const processedFiles = [];

		for (const file of files) {
			const originalFilePath = file.filePath;
			const filePath = changedFileNameMapping[originalFilePath] || originalFilePath;
			const originalLine = file.line;

			const mappedLine = mapOldLineToNewLine(
				originalFilePath,
				originalLine,
				patches,
			);

			if (mappedLine !== null && mappedLine !== undefined) {
				processedFiles.push({ filePath, originalLine, mappedLine });
			}
		}

		if (processedFiles.length > 0) {
			processedViolations[ruleId] = {
				...rest,
				files: processedFiles,
			};
		}
	}

	return processedViolations;
};

// Create a unique key for each violation instance
const createViolationKey = (ruleId, filePath, line) => `${ruleId}:::${filePath}:::${line}`;

/**
 * Compares new violations to mapped old violations to find introduced and removed violations.
 */
const findViolationsDiff = (
	newViolations,
	oldViolations,
	patches = {},
	changedFileNameMapping = {},
) => {
	const processedOldViolations = processOldViolations(
		oldViolations,
		patches,
		changedFileNameMapping,
	);

	const introducedViolations = {};
	const removedViolations = {};

	const oldViolationSet = new Set();
	for (const [ruleId, violationData] of Object.entries(processedOldViolations)) {
		for (const file of violationData.files) {
			const key = createViolationKey(ruleId, file.filePath, file.mappedLine);
			oldViolationSet.add(key);
		}
	}

	const newViolationSet = new Set();
	for (const [ruleId, violationData] of Object.entries(newViolations)) {
		for (const file of violationData.files) {
			const filePath = changedFileNameMapping[file.filePath] || file.filePath;
			const key = createViolationKey(ruleId, filePath, file.line);
			newViolationSet.add(key);
		}
	}

	// Find introduced violations
	for (const [ruleId, violationData] of Object.entries(newViolations)) {
		const introducedFiles = [];
		for (const file of violationData.files) {
			const filePath = changedFileNameMapping[file.filePath] || file.filePath;
			const key = createViolationKey(ruleId, filePath, file.line);
			if (!oldViolationSet.has(key)) {
				introducedFiles.push({ filePath, line: file.line });
			}
		}

		if (introducedFiles.length > 0) {
			introducedViolations[ruleId] = {
				...violationData,
				count: introducedFiles.length,
				files: introducedFiles,
			};
		}
	}

	// Find removed violations
	for (const [ruleId, violationData] of Object.entries(processedOldViolations)) {
		const removedFiles = [];
		for (const file of violationData.files) {
			const key = createViolationKey(ruleId, file.filePath, file.mappedLine);
			if (!newViolationSet.has(key)) {
				removedFiles.push({ filePath: file.filePath, line: file.originalLine });
			}
		}

		if (removedFiles.length > 0) {
			removedViolations[ruleId] = {
				...violationData,
				count: removedFiles.length,
				files: removedFiles,
			};
		}
	}

	return {
		introducedViolations,
		removedViolations,
	};
};

export default findViolationsDiff;
