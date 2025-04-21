// script-runner.js
import { exec } from "node:child_process";

// List the scripts you want to run
const scripts = [
	'node ./process-findings.js',
	'node ./filter-findings.js enhanced-sast-claude-processed.json claude',
	'node ./filter-findings.js enhanced-sast-llama-processed.json llama'
];

// Function to run each script one after the other
function runScripts(scripts) {
	if (scripts.length === 0) {
		console.log('All scripts have finished running.');
		return;
	}

	const current = scripts.shift();
	console.log(`Running: ${current}`);
  
	const process = exec(current);

	process.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	process.stderr.on('data', (data) => {
		console.error(data.toString());
	});

	process.on('exit', (code) => {
		console.log(`Finished: ${current} with code ${code}`);
		runScripts(scripts); // run the next one
	});
}

// Start running
runScripts([...scripts]);
