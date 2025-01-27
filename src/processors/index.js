// import runViolations from "./violations.js";
import runSast from "./sast.js";
// import runDuplicates from "./duplicates.js";
// import runVulnerabilities from "./vulnerabilities.js";
import preprocess from "./preprocess.js";

const processors = async (hash) => {
	const { repoPaths, githubOptions } = await preprocess(hash);
	return {
		// duplicates: async () => await runDuplicates(repoPaths, githubOptions),
		// vulnerabilities: async () => await runVulnerabilities(repoPaths, githubOptions),
		// violations: async () => await runViolations(repoPaths, githubOptions),
		sast: async () => await runSast(repoPaths, githubOptions),
	}};

export default processors;