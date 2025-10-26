import tailwindcss from "eslint-plugin-tailwindcss";
import tsParser from "@typescript-eslint/parser";

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
      tailwindcss,
    },
    rules: {
      // Tailwind CSS v4 rules (beta support)
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-negative-arbitrary-values": "warn",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/migration-from-tailwind-2": "off",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-contradicting-classname": "off", // May have false positives in v4
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "warn",
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "clsx", "classnames"],
        // Tailwind v4 uses CSS-based config, not tailwind.config.js
        config: false, // Disable config file requirement
        cssFiles: ["src/**/*.css", "src/index.css"],
        cssFilesRefreshRate: 5_000,
        removeDuplicates: true,
        skipClassAttribute: false,
        whitelist: [],
        tags: [],
        classRegex: "^class(Name)?$",
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
