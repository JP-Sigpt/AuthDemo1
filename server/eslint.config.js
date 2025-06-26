import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Jest support for test files
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": "off", // avoid false positives in tests
    },
  },
];
