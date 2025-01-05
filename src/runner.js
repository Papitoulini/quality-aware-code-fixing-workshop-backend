import processors from "./processors/index.js";

const analyzer = async (sha) => {
	try {
		const processorsInstance = await processors(sha);
		for (const processor of Object.values(processorsInstance)) await processor();
		return { success: true };
	} catch {
		return { success: false };
	}
};

export default analyzer;
