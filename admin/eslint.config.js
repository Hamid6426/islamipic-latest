import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      import: pluginImport,
    },

    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      "import/order": ["error", { alphabetize: { order: "asc" } }],

      "react/prop-types": "off", // Disable PropTypes warning (if using TypeScript or not needed)
      "no-unused-vars": "warn", // Warn about unused variables
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
    },
  },
];
