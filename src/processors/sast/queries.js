const generateSASTFixTask = (codeVulnerability, codePart, startLine, endLine, language = "TypeScript") => {
	const {
		message,
		start: {
			col: startCol,
		},
		end: {
			col: endCol,
		},
		severity,
		metadata: {
			cwe,
			vulnerability_class
		}
	} = codeVulnerability;

	return `
You are a coding expert specializing in resolving SAST violations. I have encountered the following issue:
Please analyze and resolve it according to the provided details:

- Message: ${message}
- Severity: ${severity || 'Not specified'}
- Weakness Enumeration: ${cwe.join("/n")}
- Vulnerability Class: ${vulnerability_class.join("/n")}

Focus on resolving the issue using best practices for the identified language and category.
Do not include this metadata in your final response.

From line ${startLine} column ${startCol} =>  line ${endLine} column ${endCol}
Snippet:
\`\`\`${language}
${codePart}
\`\`\`


__________________________________________________________
TASK:
1. Copy the code snippet into your editor.
2. Analyze the snippet for the specified SAST violation.
3. Correct the violation on the indicated lines, preserving the original logic and format.
4. Return the ENTIRE *fixed* code snippet as a string within triple backticks.

IMPORTANT:
- Your response must contain ONLY the corrected code snippet.
- Do NOT include any explanation or additional text.
- Preserve the original formatting of the code as much as possible.
- Avoid making changes to unrelated parts of the snippet.

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
