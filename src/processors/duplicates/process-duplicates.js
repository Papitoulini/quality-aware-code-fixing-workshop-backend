import { logger } from "#logger";

const processDuplicates = async (duplicates, repositoryBasePath) => {
	try {

		const changedFiles = new Set();

		console.log(duplicates)
		console.log(repositoryBasePath)

		return changedFiles;
	} catch (error) {
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processDuplicates;
