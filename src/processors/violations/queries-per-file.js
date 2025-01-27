const initConversation = (violations) => {
	const targetViolations = violations.map((violation) => {
		const { explanation, category, title, severity, ruleId, language, badExample, goodExample, description } = violation;
		return `
****************************************************************
- Explanation: ${explanation}
- Category: ${category}
- Title: ${title}
- Severity: ${severity || 'Not specified'}
- Rule ID: ${ruleId}
- Language: ${language}
- Bad Example: ${badExample}
- Good Example: ${goodExample}
- Description: ${description}
`}).join("");
	return `
You are a coding expert. I have encountered the following TypeScript violation.
Please follow the instructions below to address and resolve it:

${targetViolations}

Keep these details in mind for the next questions (do not include them in your final fix).
`.trim();
};

const askToResolveViolations = (codeFile, violations, language = "TypeScript") => {
	const targetViolations = violations.map((violation) => {
		const { explanation, category, title, severity, ruleId, language, badExample, goodExample, description, lines } = violation;
		return `
****************************************************************
- Explanation: ${explanation}
- Category: ${category}
- Title: ${title}
- Severity: ${severity || 'Not specified'}
- Rule ID: ${ruleId}
- Language: ${language}
- Bad Example: ${badExample}
- Good Example: ${goodExample}
- Description: ${description}

- Affected Lines: ${lines.sort((a, b) => a - b).join(", ")}
`}).join("");
	return `
You are a coding expert in ${language}. I have encountered the following TypeScript violation.
Please follow the instructions below to address and resolve it:

${targetViolations}

TASK:
1. Copy the code snippet into your editor.
2. Resolve the violation highlighted in the snippet.
4. Correct the violation in the specified line without altering the original logic.
5. RETURN THE ENTIRE FILE WITH THE FIXES. DONT SAY ANYTHING ELSE.

CODE:

\`\`\`TypeScript
${codeFile}
\`\`\`

Example Response:
\`\`\`TypeScript
<Fixed File>
\`\`\`

`.trim();
};

const queries = {
	initConversation,
	askToResolveViolations,
};

export default queries;
