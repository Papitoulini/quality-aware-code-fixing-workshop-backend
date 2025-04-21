const generateSASTFixTask = (codeSnippet, vulnerabilities, language = "TypeScript") => {
	// Format each finding into a structured detail block
	const details = vulnerabilities
		.map((finding, index) => {
			const { message, severity, metadata: { cwe, references, vulnerability_class }, start, end } = finding;
			return [
				`Finding ${index + 1}:`,
				`• Message : ${message}`,
				`• Severity: ${severity || "Unspecified"}`,
				`• CWE(s): ${cwe ? cwe.join(", ") : "None"}`,
				`• Class : ${vulnerability_class ? vulnerability_class.join(", ") : "None"}`,
				`• References: ${references ? references.join(", ") : "None"}`,
				`• Affected lines: ${start.line}${start.column ? `:${start.column}` : ""} to ${end.line}${end.column ? `:${end.column}` : ""}`
			].join("\n");
		})
		.join("\n\n");

	return `You are a senior software security engineer and expert developer specialized in secure coding and vulnerability remediation in ${language}.

TASK INSTRUCTIONS:
1. Review the findings listed below and apply targeted fixes only to address each vulnerability.
2. Preserve the original code style, formatting, and logic beyond the specified changes.
3. Replace any environment variables inline with \`process.env.VARIABLE_NAME\`.
4. Return the entire updated source file in a single code block, with inline comments indicating each applied fix.
5. Do not include any additional explanations, analysis, or text outside the code block.

---
SOURCE FILE:
\`\`\`${language.toLowerCase()}
${codeSnippet}
\`\`\`

VULNERABILITY FINDINGS:

${details}
`;
};

const sastFixQueries = {
	generateSASTFixTask,
};

export default sastFixQueries;
