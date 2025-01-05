import got from "got";

const PythonBackend = () => {
	const { PYTHON_API_URL } = process.env;

	return got.extend({
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
};

export default PythonBackend;
