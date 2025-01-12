/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'node:fs';
import path from 'node:path';

const deleteFolder = (dirPath = String.raw`C:\\Users\\panpa\\Desktop\\thesis-vol-2\\my-code\\thesis\\tmp`) => {
	if (!fs.existsSync(dirPath)) {
		throw new Error(`The specified path does not exist: ${dirPath}`);
	}

	const files = fs.readdirSync(dirPath);

	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stats = fs.lstatSync(filePath);

		if (stats.isFile() || stats.isSymbolicLink()) {
			fs.unlinkSync(filePath); // Remove file or symbolic link
		} else if (stats.isDirectory()) {
			fs.rmSync(filePath, { recursive: true })
		}
	}
}
export default deleteFolder;