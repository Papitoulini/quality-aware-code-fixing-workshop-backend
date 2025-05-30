module.exports = {
	apps: [
		{
			name: "sast-worker-1",
			script: "./src/workers/sast-worker.js",
			env: {
				NODE_ENV: "production"
			}
		}
	],
};
