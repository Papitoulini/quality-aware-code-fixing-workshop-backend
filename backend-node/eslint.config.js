import globals from "globals";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginSecurity from "eslint-plugin-security";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginNode from "eslint-plugin-node";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

// CONFIG FOR ALL
const config = [
	...compat.extends("airbnb/base").map((a) => ({ ...a, ignores: ["node_modules/", "**/doc/**"] })),
	{
		ignores: ["node_modules/", "**/doc/**"],
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: "module",
			globals: globals.nodeBuiltin,
		},
		plugins: {
			"@stylistic": eslintPluginStylistic,
			import: eslintPluginImport,
			unicorn: eslintPluginUnicorn,
			security: eslintPluginSecurity,
			promise: eslintPluginPromise,
			node: eslintPluginNode,
		},
		rules: {
			"@stylistic/brace-style": [
				"error",
				"1tbs",
				{
					allowSingleLine: true,
				},
			],
			"@stylistic/comma-dangle": ["error", "always-multiline"],
			"@stylistic/comma-spacing": "error",
			"@stylistic/func-call-spacing": "error",
			"@stylistic/function-paren-newline": ["error", "consistent"],
			"@stylistic/keyword-spacing": "error",
			"@stylistic/lines-between-class-members": "error",
			"max-len": [
				"error",
				{
					code: 130,
					tabWidth: 2,
					ignoreUrls: true,
					ignoreRegExpLiterals: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
				},
			],
			"@stylistic/no-extra-semi": "error",
			"@stylistic/no-mixed-operators": [
				"error",
				{
					groups: [
						["%", "**"],
						["%", "+"],
						["%", "-"],
						["%", "*"],
						["%", "/"],
						["/", "*"],
						["&", "|", "<<", ">>", ">>>"],
						["==", "!=", "===", "!=="],
						["&&", "||"],
					],
					allowSamePrecedence: false,
				},
			],
			"@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/padding-line-between-statements": [
				"error",
				{ blankLine: "always", prev: "multiline-block-like", next: "*" },
			],
			"@stylistic/space-before-blocks": "error",
			"@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
			"@stylistic/space-infix-ops": "error",
			"@stylistic/wrap-iife": ["error", "inside", { functionPrototypeMethods: true }],
			indent: ["error", "tab", { SwitchCase: 1 }],
			"unicorn/consistent-destructuring": "error",
			"unicorn/no-array-callback-reference": "off",
			"unicorn/no-nested-ternary": "off",
			"unicorn/no-null": "off",
			"unicorn/prefer-switch": ["error", { emptyDefaultCase: "do-nothing-comment" }],
			"unicorn/prevent-abbreviations": "off",
			"import/no-named-as-default": "off", // TODO: Re-enable when fixed
			"import/no-named-as-default-member": "off", // TODO: Re-enable when fixed
			"import/extensions": ["error", "ignorePackages"],
			"import/no-anonymous-default-export": "error",
			"import/no-duplicates": ["error", { considerQueryString: true, "prefer-inline": true }],
			"import/order": ["error", { "newlines-between": "always" }],
			"import/prefer-default-export": "off",

			"array-callback-return": ["error", { allowImplicit: true }],
			"class-methods-use-this": "off",
			"func-names": ["error", "never"],
			"global-require": "off",
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-await-in-loop": "off",
			"no-console": "off",
			"no-implicit-coercion": "error",
			"no-negated-condition": "error",
			"no-param-reassign": "off",
			"no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
			"no-restricted-exports": ["error", { restrictedNamedExports: ["then"] }],
			"no-restricted-syntax": "off",
			"no-return-assign": ["error", "always"],
			"no-underscore-dangle": "off",
			"no-unsafe-optional-chaining": "error",
			"no-unused-vars": ["error", {
				args: "after-used", ignoreRestSiblings: true, vars: "all", varsIgnorePattern: "^_",
			}],
			"no-use-before-define": ["error", { functions: false }],
			"no-tabs": "off",
			"prefer-destructuring": "off",
			"prefer-regex-literals": "error",
			"require-await": "error",

			"consistent-return": ["error", { treatUndefinedAsUnspecified: false }],
			"no-new-require": "error",
			"no-path-concat": "error",
			"no-sync": ["error", { allowAtRootLevel: true }],
			"handle-callback-err": ["error", "^(err|error)$"],
			"callback-return": ["error", ["callback", "cb", "next"]],
			"no-buffer-constructor": "error",
			"security/detect-non-literal-fs-filename": "error",
			"security/detect-non-literal-require": "error",
			"security/detect-unsafe-regex": "error",
			"node/no-deprecated-api": "error",
			"node/no-missing-require": "error",
			"node/no-unpublished-require": "error",
			"node/process-exit-as-throw": "error",
			"promise/no-callback-in-promise": "error",
			"promise/no-nesting": "error",
			"promise/no-new-statics": "error",
			"promise/no-return-in-finally": "error",
			"promise/no-return-wrap": "error",
			"promise/param-names": "error",
			"promise/valid-params": "error",
			"object-curly-newline": "off",
		},
	},
	// CYCLOPT IGNORE
	{
		files: ["scripts/**", "tests/**"],
		rules: {
			"security/detect-non-literal-fs-filename": "off",
			"no-sync": "off",
		},
	},
	// IGNORE AIRBNB RULES
	{
		ignores: ["node_modules/", "**/doc/**"],
		plugins: {
			import: eslintPluginImport,
		},
		rules: {
			"function-paren-newline": "off",
			"no-nested-ternary": "off",
			"import/export": "off",
			"import/no-unresolved": ["error", {
				ignore: [
					"#utils",
					"#dbs",
					"#analyzer",
					"#middleware",
					"@cyclopt/utilities",
					"@iamnapo/average",
					"@iamnapo/construct-url",
					"ava",
					"got",
					"@octokit/core",
					"@octokit/plugin-rest-endpoint-methods",
					"@octokit/plugin-retry",
					"octokit",
				],
			}],
		},
	},
];

export default config;
