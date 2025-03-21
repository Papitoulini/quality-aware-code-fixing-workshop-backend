export * from "./storage.js";
export { default as Github } from "./github.js";
export { default as constructAuthUrl } from "./construct-auth-url.js";
export { default as LLM } from "./llm.js";
export { default as injectCodePart } from "./inject-code-part.js";
export { default as extractCodeBlock } from "./extract-code-block.js";
export { default as deleteFolder } from "./delete-folder.js";
export { default as getIntroducedViolationsProps } from "./get-introduced-violations-props.js";
export { default as findViolationsDiff } from "./find-violations-diff.js";
export { default as findSastDiff } from "./find-sast-diff.js";
export { default as getCodeFromFile } from "./get-code-from-file.js";
export * from "./abstract-tree/index.js";
export const MODEL = "claude"; // "llama", "claude"
export const MAX_SNIPPET_LINES = 100; // unused
export const CODE_SNIPPET_MARGIN = 3;
export const MAX_HTTP_REQUEST_CHARS = 12_000; // unused
export const TOTAL_ALLOWED_LINES = MODEL === "claude" ? 300: 100;
export const MAX_FILE_SIZE_ALLOWED_IN_MB = 10;

export const ATTEMPT = "have-fun";
export const LOCAL_FOLDER = "tmp_1";

export const APPLICATIONS = {
	platformStatistics: ["metrics", "violations", "duplication", "vulnerabilities"],
	qualityGates: ["violations", "duplication", "vulnerabilities", "coverage"],
	maintainabilityPal: ["violations", "duplication", "vulnerabilities", "coverage"],
	weeklyMaintainabilityPal: ["metrics", "sast"],
	polyNotifications: ["violations", "duplication", "vulnerabilities", "coverage"],
	weeklyPolyNotifications: ["metrics", "sast"],
	companion: ["violations", "duplication", "vulnerabilities", "coverage"],
	weeklyCompanion: ["metrics", "sast"],
	calculateScore: ["violations", "duplication", "vulnerabilities", "sast"],
};
