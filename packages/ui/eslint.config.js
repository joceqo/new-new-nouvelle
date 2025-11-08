import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      // Import rules with TypeScript path alias support
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",

      // Enforce using @/ alias instead of relative imports (auto-fixable)
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { "allowSameFolder": false, "rootDir": "src", "prefix": "@" }
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.storybook/**",
      "**/storybook-static/**",
      "**/*.config.js",
      "**/*.config.ts",
    ],
  },
];
