module.exports = {
	apps: [
		{
			name: "workshop-backend",
			script: "npm",
			args: "start",
		},
		{
            name: "sast-worker-1",
            script: "./src/workers/sast-worker.js",
            env: {
                NODE_ENV: "production"
            }
        }
	],
};
