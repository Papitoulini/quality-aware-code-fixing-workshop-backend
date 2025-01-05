import { MODEL, MAX_HTTP_REQUEST_CHARS } from "./index.js";

import got from "got";

/**
 * Simple LLM wrapper for your Python backend
 */
const LLM = async () => {
	const { PYTHON_API_URL } = process.env;

	const messages = [];
	const pythonBackend = got.extend({
		// http2: true,
		prefixUrl: PYTHON_API_URL,
		headers: {
			// "User-Agent": "Cyclopt Platform",
			// Authorization: PYTHON_API_KEY
			// 	? `Bearer ${PYTHON_API_KEY}`
			// 	: undefined,
			"Content-Type": "application/json",
		},
	});

	console.log("started new thread")

	return {
		sendMessage: async (question, isCore = false) => {
			if (JSON.stringify(messages) >= MAX_HTTP_REQUEST_CHARS) {
				messages.filter((m) => m.isCore);
				console.log("messages cleared")
			}
			messages.push({ role: "user", message: question, isCore });
			const { body: unparsedResponse } = await pythonBackend.post("send_message", {
				json: { messages, model: MODEL },
			});
			const { response } = JSON.parse(unparsedResponse);
			messages.push({ role: "assistant", message: response, isCore });
			return response;
		},
	};
};

export default LLM;
