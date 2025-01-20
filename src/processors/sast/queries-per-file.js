const generateSASTFixTask = (codePart, codeVulnerabilities, startLine, endLine, language = "TypeScript") => {
	const targetVulnerabilities = codeVulnerabilities.map((codeVulnerability) => {
		const {
			message,
			severity,
			metadata: {
				cwe = null,
				references = null,
				vulnerability_class = null,
			},
			lines,
		} = codeVulnerability;
		return `
****************************************************************
- Message: ${message}
- Severity: ${severity || 'Not specified'}
- Weakness Enumeration: ${cwe?.join("/n")}
- References: ${references?.join("/n")}
- Vulnerability Class: ${vulnerability_class?.join("/n")}

- Affected Lines: ${lines.map(({ start, end }) => start.line === end.line ? start.line : `${start.line} -> ${end.line}`).join(", ")}
`}).join("");

	return `
You are a coding expert specializing in resolving SAST violations. I have encountered the following issue:
Please analyze and resolve it according to the provided details:

${targetVulnerabilities}

TASK:
1. Copy the code snippet into your editor.
2. Resolve the violation highlighted in the snippet.
3. Return the ENTIRE *fixed* code snippet as a string within triple backticks.
4. Correct the violation in the specified line without altering the original logic.

IMPORTANT:
- Return your ENTIRE answer as a string.
- Do NOT provide any explanation or text outside the backticks.
- Preserve the original code formatting as much as possible.
- Ensure your response contains ONLY the *corrected code snippet* and nothing else.
- **Avoid adding, removing, or significantly modifying brackets, braces, or parentheses** 
  unless absolutely necessary to fix the violation.
__________________________________________________________

Focus on resolving the issue using best practices for the identified language and category.
Do not include this metadata in your final response.

FILE:
\`\`\`${language}
${codePart}
\`\`\`

EXAMPLE RESPONSE:
\`\`\`${language}
<corrected code snippet>
\`\`\`
__________________________________________________
`.trim();
};

const sastFixQueries = {
	generateSASTFixTask,
};

export default sastFixQueries;
