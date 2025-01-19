const initConversation = (violations) => {
	// violations: array of violation objects, each having { explanation, category, title, ... }
	// Or you could just pass a single object if that suits your workflow.

	// If each violation has these props, we might map over them:
	const details = violations.map((v, index) => {
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
		} = v;

		return `
[Violation ${index + 1}]
- Explanation: ${explanation || "Not provided"}
- Category: ${category || "N/A"}
- Title: ${title || "N/A"}
- Severity: ${severity || "N/A"}
- Rule ID: ${ruleId || "N/A"}
- Language: ${language || "TypeScript"}
- Bad Example: ${badExample || "N/A"}
- Good Example: ${goodExample || "N/A"}
- Description: ${description || "N/A"}
`.trim();
	});

	return `
You are a coding expert. I have encountered the following TypeScript violations.
Please keep these details in mind to address and resolve them in the next queries:

${details.join("\n\n")}

IMPORTANT:
- Do not include the above metadata in the final fix.
- Focus on addressing each violation appropriately.
`.trim();
};

/**
 * @param {string} codeSnippet - the entire snippet (e.g., class or function)
 * @param {number[] | number} lines - one or more line numbers that have issues
 * @param {string} language - defaults to "TypeScript"
 * @param {string[]} ruleIds - if you want to specify multiple rule IDs in the prompt
 */
const askToResolveViolations = (
	codeSnippet,
	lines,
	ruleIds = [],
	language = "TypeScript"
) => {
	// Ensure lines is always an array for consistency
	const lineArray = Array.isArray(lines) ? lines : [lines];
  
	return `
  Snippet with Violation(s):
  \`\`\`${language}
  ${codeSnippet}
  \`\`\`
  
  Affected Line(s): ${lineArray.join(", ")}
  Rule ID(s): ${ruleIds.join(", ")}
  
  __________________________________________________________
  TASK:
  1. Copy the code snippet into your editor.
  2. Resolve **all** listed violations in the specified line(s).
  3. Return the ENTIRE *fixed* code snippet as a string within triple backticks.
  4. Correct each violation without altering the original logic more than necessary.
  
  IMPORTANT:
  - Return your ENTIRE answer as a string.
  - Do NOT provide any explanation or text outside the backticks.
  - Preserve the original code formatting as much as possible.
  - Ensure your response contains ONLY the *corrected code snippet* and nothing else.
  - **Avoid adding, removing, or significantly modifying brackets, braces, or parentheses** 
	unless absolutely necessary to fix the violations.
  - **The corrected code snippet MUST have the same number of lines as the original.**
  
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
