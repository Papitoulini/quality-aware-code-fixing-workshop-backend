import "dotenv/config";

import got from "got";

const { ISSEL_SERVICES_API_KEY, ISSEL_SERVICES_BASE_URL } = process.env;

const Claude = () => (got.extend({
	prefixUrl: ISSEL_SERVICES_BASE_URL,
	headers: {
		access_token: ISSEL_SERVICES_API_KEY,
		"Content-Type": "application/json",
	},
	retry: {
		limit: 5,
		maxRetryAfter: 1000,
	},
}));

export default Claude;
