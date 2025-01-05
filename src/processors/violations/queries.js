const initConversation = () => {
	return `
You are a coding expert. I have encountered the following TypeScript violation
You should follow the bellow instractions to fix it:
`.trim();
};

const addViolationInfo = (violationProps) => {
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
- Explanation: ${explanation}
- Category: ${category}
- Title: ${title}
- Severity: ${severity || 'Not specified'}
- Rule ID: ${ruleId}
- Language: ${language}
- Bad Example: ${badExample}
- Good Example: ${goodExample}
- Description: ${description}

Keep these details in mind for the next questions (do not display them in your final fix).
`.trim();
};

const askToResolveViolations = (codePart, lines, language = "TypeScript") => {
	return `
Snippet:
\`\`\`TypeScript
${codePart}
\`\`\`

Affected Lines: ${Array.isArray(lines) ? lines.join(', ') : lines}

__________________________________________________________
TASK:
1. Copy the code snippet in your editor.
2. Fix potential violations in this code snippet.
3. Return the ENTIRE *fixed* code snippet as a string in triple backticks.
4. Try to eliminate the violations in the corresponding lines without changing the original logic.


IMPORTANT:
- Return your ENTIRE answer as a string.
- Do NOT provide any explanation or text outside the backticks.
- You MUST preserve the original code format as much as possible.
- Your answer MUST contain only the *corrected code snippet* and nothing else.
- You MUST return the ENTIRE *corrected code snippet*.
- **Do NOT add, remove, or significantly alter any existing brackets, braces, or parentheses** 
  unless it is strictly necessary to fix a violation.


EXAMPLE RESPONSE:
\`\`\`
${language}
<corrected code snippet>
\`\`\`
__________________________________________________
`.trim();
};

const queries = {
	initConversation,
	addViolationInfo,
	askToResolveViolations,
};

export default queries;