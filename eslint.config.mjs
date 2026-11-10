import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/build/**", "**/dist/**", "**/coverage/**", ".react-router/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: js.configs.recommended.rules,
  },
  ...tseslint.configs.recommended,
);
