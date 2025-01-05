import processors from "./processors/index.js";

const analyzer = async (sha) => {
	const processorsInstance = await processors(sha);
	for (const processor of Object.values(processorsInstance)) await processor();
	return "analysis";
};

export default analyzer;
