import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Ignore build artifacts
  {
    ignores: ["dist", "node_modules"],
  },

  // Base React + JS/JSX config
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "18.3" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      // Suppress common harmless React warnings
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off", // disable if using TypeScript or not using prop-types
      "react/no-unescaped-entities": "warn", // don't fail builds on `'`

      // Allow unused vars for React and prefixed args
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^React$|^Header$", // suppress React/Header unused import warnings
          argsIgnorePattern: "^_", // suppress _error, _args, etc.
        },
      ],

      // Allow non-component exports in the same file (for context, constants)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Jest test/setup files: enable Node + Jest globals
  {
    files: ["**/*.test.js", "**/*.test.jsx", "**/jest*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
  },
];
