import { logger } from "#logger";

const processVulnerabilities = async (vulnerabilities, repositoryBasePath) => {
	try {

		const changedFiles = new Set();

		console.log({ ok: true, process: "vulnerabilities"})

		return changedFiles;
	} catch (error) {
		logger.error(`Error during preprocess: ${error.message}`);
		throw error;
	}
};

export default processVulnerabilities;
