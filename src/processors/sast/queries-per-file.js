const generateSASTFixTask = (codeSnippet, vulnerabilities, language = "TypeScript") => {
	// return "What is your porpuse here?";
	const details = vulnerabilities.map(({ message, severity, metadata: { cwe, references, vulnerability_class }, lines }) => `
Message: ${message}
Severity: ${severity || 'Not specified'}
CWE: ${cwe?.join(", ") || 'None'}
References: ${references?.join(", ") || 'None'}
Class: ${vulnerability_class?.join(", ") || 'None'}
Lines: ${lines.map(({ start, end }) => start.line === end.line ? start.line : `${start.line}-${end.line}`).join(", ")}
`).join("\n");

	return `
You are a highly skilled software security expert and experienced
developer specializing in secure coding practices in ${language}.

${details}

TASK:
1. Fix the issus mentioned above, in the provided code.
4. Fix the specified issue only, preserving original formatting and logic.
2. Return the FULL, FIXED file in a single block.
3. Do NOT include any explanations or text outside the code block.
4. If you encounter any env variables, replace them with process.env.VARIABLE_NAME.
5. RESPOND ONLY WITH CODE and INLINE COMMENTS IF NEED. NOTHING ELSE

CODE:
${codeSnippet}
`.trim();
};

const sastFixQueries = {
	generateSASTFixTask,
};

export default sastFixQueries;
