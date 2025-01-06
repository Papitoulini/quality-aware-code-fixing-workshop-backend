import { logger } from "#logger";

const processDuplicates = async (duplicates, repositoryBasePath) => {
	try {

		const changedFiles = new Set();

		console.log({ ok: true, process: "duplicates"})

		return changedFiles;
	} catch (error) {
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processDuplicates;
