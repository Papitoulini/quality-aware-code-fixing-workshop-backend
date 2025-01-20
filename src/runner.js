import processors from "./processors/index.js";
import { deleteFolder } from "#utils"

const analyzer = async (sha) => {
	try {
		const processorsInstance = await processors(sha);
		for (const processor of Object.values(processorsInstance)) await processor();
		// await deleteFolder();
		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	}
};

export default analyzer;
