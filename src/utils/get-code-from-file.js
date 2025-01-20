/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs/promises";

import { logger }  from "#logger";

// Get Code Section Operation with margin and location of exact requested part
const getCodeFromFile = async (absolutePath) => {
	try {
		const data = await fs.readFile(absolutePath, "utf8");
		const lines = data.split(/\r?\n/);

		return {
			part: data, // Full code with margin
			totalLines: lines.length,
		};
	} catch (error) {
		logger.error(`Error during "retrieving" code section from local repo: ${error.message}`);
		return {
			part: null, // Full code with margin
			totalLines: null,
		};
	}
};

export default getCodeFromFile;
