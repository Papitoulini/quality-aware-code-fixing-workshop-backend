import eslintPluginStylistic from "@stylistic/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginSecurity from "eslint-plugin-security";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginNode from "eslint-plugin-node";

// Create a mapping of plugin names to their imported objects
const pluginsMap = {
	import: eslintPluginImport,
	unicorn: eslintPluginUnicorn,
	"@stylistic": eslintPluginStylistic,
	security: eslintPluginSecurity,
	promise: eslintPluginPromise,
	node: eslintPluginNode,
};

// Define custom rules for the project
const customRules = {
	"unicorn/no-array-reduce": "off",
	"unicorn/no-null": "off",
	"unicorn/expiring-todo-comments": "off",
	"unicorn/no-nested-ternary": "off",
	"unicorn/filename-case": "off",
	"unicorn/prevent-abbreviations": "off",
	"import/no-named-as-default-member": "off",
	"unicorn/no-array-callback-reference": "off",
	"node/no-missing-import": "off",
	"import/no-named-as-default": "off",
	"import/no-unresolved": [
		"error",
		{
			ignore: [
				"#utils",
				"#api",
				"#dbs",
				"#logger",
				"#analyzer",
				"#middleware",
				"octokit",
				"@octokit/plugin-throttling",
				"@octokit/plugin-retry",
				"#customHooks",
				"@cyclopt/utils",
				"@iamnapo/average",
				"@iamnapo/construct-url",
				"@iamnapo/sort",
				"mem",
				"got",
			],
		},
	],
	"no-undef": "error",
	"no-extra-semi": "error",
	"no-constant-condition": "error",
	"no-mixed-spaces-and-tabs": "error",
	indent: ["error", "tab"],
	"no-unused-vars": [
		"error",
		{
			vars: "all",
			args: "after-used",
			ignoreRestSiblings: true,
			varsIgnorePattern: "^_+$",
			argsIgnorePattern: "^_+$",
		},
	],
	"no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
};

// Function to safely extract recommended rules
const getRecommendedRules = (plugin) => {
	return plugin.configs && plugin.configs.recommended && plugin.configs.recommended.rules
		? plugin.configs.recommended.rules
		: {};
};

// Combine rules from all plugins
const combinedRules = {
	...getRecommendedRules(eslintPluginImport),
	...getRecommendedRules(eslintPluginUnicorn),
	...getRecommendedRules(eslintPluginSecurity),
	...getRecommendedRules(eslintPluginPromise),
	...getRecommendedRules(eslintPluginNode),
	...getRecommendedRules(eslintPluginStylistic),
	...customRules,
};

// Define the main configuration
const mainConfig = {
	files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
	ignores: ["node_modules/", "tmp/**", "**/doc/**"],
	languageOptions: {
		parserOptions: {
			ecmaVersion: 2022, // Adjust based on your project's needs
			sourceType: "module",
		},
		globals: {
			// Define global variables for Node.js environment
			global: "writable",
			process: "writable",
			module: "writable",
			__dirname: "readonly",
			__filename: "readonly",
			require: "readonly",
			console: "readonly",
			setTimeout: "writable",
			setInterval: "writable",
			clearTimeout: "writable",
			clearInterval: "writable",
			Buffer: "writable",
			URL: "writable",
			Blob: "writable",
			window: "readonly",
			document: "readonly",
			navigator: "readonly",
			requestAnimationFrame: "writable",
			caches: "writable",
		},
	},
	plugins: pluginsMap,
	settings: {
		"import/resolver": {
			node: {
				extensions: [".js", ".cjs", ".mjs"],
			},
		},
	},
	rules: combinedRules,
};

// Export the Flat Config array
export default [mainConfig];
