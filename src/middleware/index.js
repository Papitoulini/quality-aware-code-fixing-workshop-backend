import * as Sentry from "@sentry/node";

export const setServerTimeout = (millis = 5 * 60 * 1000) => (req, res, next) => {
	req.setTimeout(millis, () => res.status(408).json({ message: "Request Timeout" }));
	res.setTimeout(millis, () => res.status(503).json({ message: "Service Unavailable" }));
	next();
};

export const attachJarvis = (req, res, next) => {
	const { JARVIS_USERNAME, JARVIS_PASSWORD } = process.env;

	const { authorization } = req.headers;
	if (authorization) {
		if (authorization === `Basic ${Buffer.from(`${JARVIS_USERNAME}:${JARVIS_PASSWORD}`).toString("base64")}`) return next();
		return res.status(401).json({ message: "Failed to authenticate user." });
	}

	return res.status(401).json({ message: "No Authorization provided." });
};

// Do not remove unused parameters.
// Express requires a four-parameter signature to recognize this function as an error handler
export const captureErrors = (err, req, res, next) => {
	const { NODE_ENV } = process.env;
	if (NODE_ENV === "production") {
		Sentry.captureException(err);
	} else {
		console.error(err);
	}

	if (res.headersSent) {
		return next(err);
	}

	return res.status(500).json({ message: "Something went wrong." });
};
