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

const queries = {
	fixTheClone,
	canYouUnderstandTheTree,
};

export default queries;