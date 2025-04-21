import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import decompress from "decompress";

import { ashAnalysis, getFindings } from "./sast/index.js";

const walk = (root) => {
	const roots = [];
	const dirs = [];
	const files = [];
	const tempDirs = [];
	const tempFiles = [];

	const filenames = fs.readdirSync(root);
	roots.push(root);

	for (const filename of filenames) {
		const currentPath = path.join(root, filename);
		const stats = fs.statSync(currentPath);
		if (stats.isDirectory()) {
			tempDirs.push(currentPath);
		} else {
			tempFiles.push(currentPath);
		}
	}

	dirs.push(tempDirs);
	files.push(tempFiles);

	for (const dir of tempDirs) {
		const [tRoots, tDirs, tFiles] = walk(dir);
		for (const tRoot of tRoots) {
			roots.push(tRoot);
		}

		for (const tDir of tDirs) {
			dirs.push(tDir);
		}

		for (const tFile of tFiles) {
			files.push(tFile);
		}
	}

	return [roots, dirs, files];
};

const prepareASH = async () => {
	try {

		const root = path.dirname(url.fileURLToPath(import.meta.url));

		const dirname = path.join(root, "sast", "ash", "lib");
		const pathToZip = path.join(dirname, "ash.zip");
		if (!fs.existsSync(path.join(dirname, "ash-library"))) {
			await decompress(pathToZip, dirname);

			const [roots, dirs, files] = walk(path.join(dirname, "ash-library"));
			for (const [index, _] of roots.entries()) {
				for (const file of files[index]) {
					fs.chmodSync(file, 0o777);
				}

				for (const dir of dirs[index]) {
					fs.chmodSync(dir, 0o777);
				}
			}
		}

		const analyzerPath = path.join(root, "sast", "ash", "lib", "ash-library", "ash");
		return analyzerPath;
	} catch (error) {
		console.log(error)
	}
};

const calculateSAST = async (codePath, folder) => {
	try {
		// Generate random internalId
		const internalId = Math.random().toString(36).slice(7);

		// Create results folder
		fs.mkdirSync(path.join(folder, "ash-results"), { recursive: true });

		console.log("Reach Here", 1)

		const analyzerPath = await prepareASH();

		console.log("Reach Here", 2, analyzerPath, folder, path.join(folder, "ash-results"))

		const { success: ashAnalysisSuccess } = ashAnalysis(analyzerPath, folder, path.join(folder, "ash-results"));
		if (!ashAnalysisSuccess) {
			return {
				success: false,
				sast: [],
				sastMetrics: {},
				error: "ASH analysis failed",
			};
		}

		const sast = getFindings(path.join(folder, "ash-results"), internalId, [], ".");
		const sastMetrics = { sastVulnerabilities: sast.length };

		return {
			success: true,
			sast,
			sastMetrics,
			error: null,
		};
	} catch (error) {
		return {
			success: false,
			sast: [],
			sastMetrics: {},
			error,
		};
	}
};

export default calculateSAST;
