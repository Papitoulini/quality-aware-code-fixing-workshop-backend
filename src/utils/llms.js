import "dotenv/config";

import got from "got";

const { LLM_SERVER_URL, LLM_SERVER_KEY } = process.env;

const LLMS = () => (got.extend({
	prefixUrl: LLM_SERVER_URL,
	headers: {
		Authorization: `Bearer ${LLM_SERVER_KEY}`,
		"Content-Type": "application/json",
	},
	retry: {
		limit: 5,
		maxRetryAfter: 1000,
	},
}));

export default LLMS;
