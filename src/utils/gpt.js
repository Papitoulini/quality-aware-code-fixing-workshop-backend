import "dotenv/config";

import got from "got";

const { OPENAI_API_KEY, OPENAI_BASE_URL } = process.env;

const GPT = () => (got.extend({
	prefixUrl: OPENAI_BASE_URL,
	headers: {
		Authorization: `Bearer ${OPENAI_API_KEY}`,
		"Content-Type": "application/json",
	},
	retry: {
		limit: 5,
		maxRetryAfter: 1000,
	},
}));

export default GPT;
