import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

const compat = new FlatCompat();

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals to avoid `process` errors
      },
      parser: tseslintParser, // Use TypeScript parser
    },
    plugins: {
      js: pluginJs,
      react: pluginReact,
      "@typescript-eslint": tseslintPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslintPlugin.configs.recommended.rules, // TypeScript ESLint rules
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "no-irregular-whitespace": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  ...compat.extends("plugin:prettier/recommended"),
];
