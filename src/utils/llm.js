import { MODEL, MAX_HTTP_REQUEST_CHARS } from "./index.js";
import got from "got";

const LLM = async () => {
	const { PYTHON_API_URL } = process.env;
	const messages = [];
	const pythonBackend = got.extend({
		prefixUrl: PYTHON_API_URL,
		headers: {
			"Content-Type": "application/json",
		},
		retry: {
			limit: 10, // total attempts = 1 initial + 4 retries
			methods: ["POST"],
			statusCodes: [408, 429, 500, 502, 503, 504],
			errorCodes: ["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN"],
			calculateDelay: ({ attemptCount, retryOptions }) => {
				// If we've already exhausted the `limit`, return 0 => no more retries
				if (attemptCount > retryOptions.limit) {
					return 0;
				}

				// Exponential backoff: e.g. 1s, 2s, 4s, 8s, ...
				const baseDelay = 1000; // 1 second
				const delay = baseDelay * Math.pow(2, attemptCount - 1);

				console.log("Waited for:", delay, "seconds")

				return delay;
			}
		},
		// Time out each individual request after e.g. 30s
	});

	console.log("started new thread")

	return {
		sendMessage: async (question, isCore = false) => {
			if (JSON.stringify(messages) >= MAX_HTTP_REQUEST_CHARS) {
				messages.filter((m) => m.isCore);
				console.log("messages cleared", messages.length)
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
