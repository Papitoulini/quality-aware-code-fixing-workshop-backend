export const prompt1 = (code, findings, suggestions) => `
The following code has been identified with high cyclomatic complexity and duplicate code segments. 
Please refactor it to improve maintainability and reduce complexity while retaining the original functionality.

Original Code:
${code}

Identified Issues:
- Cyclomatic Complexity: {complexity_score}
- Duplicated Code: {duplicate_score}

Refactor the code to:
${findings}

Suggested Fix:
${suggestions}
`;

export const prompt2 = (code, vulnerabilityFix) => `
prompt_template = """
The following code contains a security vulnerability: {vulnerability_type}.
The identified issue is described below with the original code and suggestions for how to improve it.

Vulnerability Description: {vulnerability_description}

Original Code:
${code}

Suggested Fix:
- Ensure ${vulnerabilityFix}
`;

export const prompt3 = (code, vulnerabilityFix) => `
prompt_template = """
The following code contains a security vulnerability: {vulnerability_type}.
The identified issue is described below with the original code and suggestions for how to improve it.

Vulnerability Description: {vulnerability_description}

Original Code:
${code}

Suggested Fix:
- Ensure ${vulnerabilityFix}
`;
