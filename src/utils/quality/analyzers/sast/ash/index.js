import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import decompress from "decompress";

const filterASHpath = (ashPath) => {
	/**
		Filters the path of the ASH results to remove the temporary folder created by ASH
		and also removes the /src/ or /src prefix which is randomly inserted by ASH, if it exists.
	*/
	const filterTmp = /\/tmp\/ash-run-scan\.[\dA-Za-z]+\/?/;
	let filteredPath = ashPath.replace(filterTmp, "");

	const filterSrc = /^\/src\/?|^\/src/;
	if (filterSrc.test(filteredPath)) {
		filteredPath = filteredPath.replace(filterSrc, "");
	}

	return filteredPath;
};

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
	const root = path.dirname(url.fileURLToPath(import.meta.url));

	const operatingSystem = (process.platform === "win32") ? "windows" : "linux";
	const fileExtension = (operatingSystem === "windows") ? "" : "ash";
	const dirname = path.join(root, "lib");
	const pathToZip = path.join(dirname, "ash.zip");
	if (!fs.existsSync(path.join(dirname, "ash"))) {
		await decompress(pathToZip, dirname);

		if (operatingSystem === "linux") {
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
	}

	const analyzerPath = path.join(root, "lib", "ash-library", fileExtension);

	return {
		analyzerPath,
		operatingSystem,
	};
};

export { prepareASH, filterASHpath };
