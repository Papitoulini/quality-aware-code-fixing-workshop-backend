import Sentry from "@sentry/node";
import rateLimit from "express-rate-limit";

export const setServerTimeout = (millis = 5 * 60 * 1000) => (req, res, next) => {
	req.setTimeout(millis, () => res.status(408).json({ message: "Request Timeout" }));
	res.setTimeout(millis, () => res.status(503).json({ message: "Service Unavailable" }));
	next();
};

export const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
	message: "Oh no, you have exceeded your rate limit! It will reset in 1 hour.",
	statusCode: 429,
	headers: true,
	keyGenerator: (req, res) => {
		const { user } = res.locals;
		return user?._id || req.ip;
	},
});

export const attachFrontend = (req, res, next) => {
	const {
		SERVER_USERNAME,
		SERVER_PASSWORD,
	} = process.env;
	try {
		const token = req.headers['authorization'];
		if (token) {
			const [username, password] = Buffer.from(token.split(" ")[1], "base64").toString().split(":");
			return username === SERVER_USERNAME && password === SERVER_PASSWORD ? next() : res.status(401).json({ message: "Failed to authenticate user." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch {
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

// Do not remove unused parameters.
// Express requires a four-parameter signature to recognize this function as an error handler
export const captureErrors = (err, req, res, next) => {
	console.log(err?.response?.errors || err);
	Sentry.captureException(err);
	if (res.headersSent) {
		return next(err);
	}

	return res.status(500).json({ message: "Something went wrong." });
};
