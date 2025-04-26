const explainSAST = (codeSnippet, vulnerabilities, language = "TypeScript") => {
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
1. Review the findings listed below and understand what is the problem in each finding.
2. Explain the problem in detail, including the potential impact of each vulnerability. Your target audience is non-developers, so they need to understand the problem.
3. Use simple language and avoid technical jargon. 
4. Provide a brief summary of the code snippet, including its purpose and functionality.

---
SOURCE FILE:
\`\`\`${language.toLowerCase()}
${codeSnippet}
\`\`\`

VULNERABILITY FINDINGS:

${details}
`;
};

const sastExplain = {
	explainSAST,
};

export default sastExplain;
