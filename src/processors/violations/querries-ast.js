const initConversation = (violationProps) => {
	const {
		explanation,
		category,
		title,
		severity,
		ruleId,
		language,
		badExample,
		goodExample,
		description,
	} = violationProps;

	return `
You are a coding expert. I have encountered the following TypeScript violation.
Please follow the instructions below to address and resolve it:

- Explanation: ${explanation}
- Category: ${category}
- Title: ${title}
- Severity: ${severity || 'Not specified'}
- Rule ID: ${ruleId}
- Language: ${language}
- Bad Example: ${badExample}
- Good Example: ${goodExample}
- Description: ${description}

Keep these details in mind for the next questions (do not include them in your final fix).
`.trim();
};

const askToResolveViolations = (codePart, language = "TypeScript") => {
	return `
Snippet:
\`\`\`${language}
${codePart}
\`\`\`

__________________________________________________________
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

EXAMPLE RESPONSE:
\`\`\`${language}
<corrected code snippet>
\`\`\`
__________________________________________________
`.trim();
};

const queries = {
	initConversation,
	askToResolveViolations,
};

export default queries;