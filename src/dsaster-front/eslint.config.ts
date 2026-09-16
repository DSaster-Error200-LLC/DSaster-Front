import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintReact from "@eslint-react/eslint-plugin";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "postcss.config.mjs",
  ]),
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      // @ts-expect-error known eslint-config-next typing issue
      sonarjs.configs.recommended,
      nextVitals,
      nextTs,
      eslintReact.configs["recommended-typescript"],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/../**"],
              message:
                "Backwards relative imports should not be used. Use path aliases instead.",
            },
          ],
        },
      ],
      "sonarjs/todo-tag": "warn",
    },
  },
  {
    settings: {
      // TODO: Remove
      // https://github.com/vercel/next.js/issues/89764
      react: { version: "19" },
    },
  },
]);
