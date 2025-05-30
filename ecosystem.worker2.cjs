module.exports = {
	apps: [
		{
			name: "sast-worker-2",
			script: "./src/workers/sast-worker.js",
			env: {
				NODE_ENV: "production"
			}
		}
	],
};
