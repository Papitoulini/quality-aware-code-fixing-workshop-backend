const groupFiles = (files = []) => {
	return files.reduce((acc, file) => {
		if (!acc[file.filePath]) acc[file.filePath] = [];
		acc[file.filePath].push(file.line);
		return acc;
	}, {});
}

export default groupFiles;
