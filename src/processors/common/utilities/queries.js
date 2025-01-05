const fixTheClone = (codeTree, clones, language) => `
I have identified several code snippets in my project that are similar but differ slightly.
I want to refactor these snippets to eliminate duplication by creating reusable functions or components.
Please help me determine where the new code should be implemented and what changes should be made in the target files to achieve this.

**Project Code Tree:**
\`\`\`markdown
${codeTree}
\`\`\`

---

**Duplicated Code Snippets:**
${clones.map((cl) => {
		const {
			filePath,
			codePart: { part, requestedStart, requestedEnd },
		} = cl;
		return `
**File Path:** ${filePath}
**Starting Line:** ${requestedStart}
**Ending Line:** ${requestedEnd}
\`\`\`${language}
${part}
\`\`\`
`;
	}).join("\n")}
`;

export const canYouUnderstandTheTree = (codeTree, language) => `
I need your assistance to assess the following project code tree.
Plz **DO NOT** explain anything just try to give a response based on the follow format
**specified** inside the **Tasks** section.

**Project Language:** ${language}

**Project Code Tree:**
\`\`\`markdown
${codeTree}
\`\`\`

---

**Tasks:**

1. **Understanding Assessment:**
   - On a scale of **0 to 10**, how well can you understand the provided code tree?

2. **Confidence in Refactoring:**
   - On a scale of **0 to 10**, how confident are you in proceeding with fixing code duplications within this project?

**Please provide your responses in the following JSON format:**

\`\`\`json
{
    "understandingScore": <number>,
    "confidenceScore": <number>
}
\`\`\`
`;

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
	fixTheClone,
	canYouUnderstandTheTree,
	violations: {
		initConversation,
		addViolationInfo,
		askToResolveViolations,
	}
};

export default queries;