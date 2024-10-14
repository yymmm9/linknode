/** @type {import("eslint").Linter.Config} */
const config = {
  // parser: "@typescript-eslint/parser",
  // parserOptions: {
  //   project: true,
  // },
  // plugins: ["@typescript-eslint", "tailwindcss"],
  extends: [
    "next/core-web-vitals",
    // "plugin:@typescript-eslint/recommended-type-checked",
    // "prettier",
    // "plugin:tailwindcss/recommended",
  ],
  rules: {
    // Disable specific rules here
    // "@typescript-eslint/array-type": "off", // Already disabled
    // "@typescript-eslint/consistent-type-definitions": "off", // Already disabled
    // "@typescript-eslint/consistent-type-imports": [
    //   "warn",
    //   {
    //     prefer: "type-imports",
    //     fixStyle: "inline-type-imports",
    //   },
    // ],
    // "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Change "warn" to "off" if you want to disable
    // "@typescript-eslint/no-misused-promises": [
    //   2,
    //   {
    //     checksVoidReturn: { attributes: false },
    //   },
    // ],
    // // Add other rules you want to disable below
    // "tailwindcss/classnames-order": "off", // Example: disable tailwind class order rule
    // // "no-console": "off", // Example: disable no-console rule
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "cva"],
      config: "./tailwind.config.ts",
      classRegex: "^(class(Name)?|tw)$",
    },
    next: {
      rootDir: ["./"],
    }
  },
}

module.exports = config;
