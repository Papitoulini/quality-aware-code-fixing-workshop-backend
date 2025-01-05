import runViolations from "./violations.js";
import preprocess from "./preprocess.js";

const processors = async (hash) => {
	const { repoPaths, githubOptions } = await preprocess(hash);
	return {
		violations: async () => await runViolations(repoPaths, githubOptions),
	}};

export default processors;