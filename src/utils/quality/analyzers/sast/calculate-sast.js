/* eslint-disable no-continue */
import fs from "node:fs";
import path from "node:path";

import shell from "shelljs";

const comparePaths = (path1, path2, root) => {
	const formattedPath1 = path.normalize(path1)
		.replaceAll("\\", "/")
		.replace(/\/$/, "")
		.replace(/^\//, "")
		.replace(/^.$/, "");
	const formattedPath2 = path.normalize(path2)
		.replaceAll("\\", "/")
		.replace(/\/$/, "")
		.replace(/^\//, "")
		.replace(/^.$/, "");

	let formattedPath1Root;
	let formattedPath2Root;
	if (root) {
		const cleanRoot = root.startsWith("/") ? root.slice(1) : root;
		const reg = new RegExp(`^/?${cleanRoot}`);
		formattedPath1Root = formattedPath1.replace(reg, "")
			.replaceAll("\\", "/")
			.replace(/\/$/, "")
			.replace(/^\//, "")
			.replace(/^.$/, "");
		formattedPath2Root = formattedPath2.replace(reg, "")
			.replaceAll("\\", "/")
			.replace(/\/$/, "")
			.replace(/^\//, "")
			.replace(/^.$/, "");
	}

	return root
		? (formattedPath1 === formattedPath2 || formattedPath1Root === formattedPath2Root)
		: (formattedPath1 === formattedPath2);
};

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

	const filterOutWork = /^\/out\/work\//;
	if (filterOutWork.test(filteredPath)) {
		filteredPath = filteredPath.replace(filterOutWork, "");
	}

	return filteredPath;
};

const ashAnalysis = (analyzerPath, codePath, resultsPath) => {
	const command = `"${analyzerPath}" --source-dir "${codePath}" --output-dir "${resultsPath}" --format json --debug`;
	const { code } = shell.exec(command, { silent: false });

	if (!(code === 0 || code === 1)) {
		return { success: false };
	}

	return { success: true };
};

const getFindings = (resultsPath, internalId, filesToExclude, root) => {
	// Parse results
	const resultsFileDefault = path.join(resultsPath, "aggregated_results.txt.json");
	const resultsFile = path.join(resultsPath, `${internalId}.json`);
	fs.renameSync(resultsFileDefault, resultsFile);

	const fileContent = fs.readFileSync(resultsFile, "utf8");
	const data = JSON.parse(fileContent);

	const codeFindings = [];
	if (data?.grype?.model) {
		for (const model of data.grype.model) {
			if (model.tool === "Semgrep" && model.data.results) {
				for (const codeFinding of model.data.results) {
					const filePath = filterASHpath(codeFinding.path);
					if (filesToExclude.some((file) => comparePaths(filePath, file, root))) continue;

					codeFindings.push(
						{
							message: codeFinding.extra.message,
							path: filterASHpath(codeFinding.path),
							start: codeFinding.start,
							end: codeFinding.end,
							lines: codeFinding.extra.lines,
							severity: codeFinding.extra.severity,
							metadata: {
								confidence: codeFinding.extra.metadata.confidence,
								likelihood: codeFinding.extra.metadata.likelihood,
								cwe: codeFinding.extra.metadata.cwe,
								references: codeFinding.extra.metadata.references,
								vulnerability_class: codeFinding.extra.metadata.vulnerability_class,
							},
						},
					);
				}
			}
		}
	}

	return codeFindings;
};

export { ashAnalysis, getFindings };
