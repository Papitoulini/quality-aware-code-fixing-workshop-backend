module.exports = {
	apps: [
		{
			name: "workshop-backend",
			script: "npm",
			args: "start",
		},
		{
			name: "sast-worker",
			script: "./src/workers/sast-worker.js",
			instances: 3,
			env: {
				NODE_ENV: "production",
				WORKER_INSTANCE: 0 // PM2 automatically sets this to 0,1,2 for each instance
			}
		}
	],
};
