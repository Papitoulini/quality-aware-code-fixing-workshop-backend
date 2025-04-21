import runViolations from "./violations.js";
import runSast from "./sast.js";
// import runDuplicates from "./duplicates.js";
// import runVulnerabilities from "./vulnerabilities.js";
import preprocess from "./preprocess.js";

const processors = async (hash, selectedFiles, name, model) => {
	const { repoPaths, githubOptions } = await preprocess(hash);
	return {
		// duplicates: async () => await runDuplicates(repoPaths, githubOptions),
		// vulnerabilities: async () => await runVulnerabilities(repoPaths, githubOptions),
		// violations: async () => await runViolations(repoPaths, githubOptions, selectedFiles, name, model),
		sast: async () => await runSast(repoPaths, githubOptions, selectedFiles, name, model),
	}};

export default processors;