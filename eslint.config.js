import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**"]
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        UC11Storage: "readonly"
      }
    },
    rules: js.configs.recommended.rules
  }
];
