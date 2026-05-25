import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "nextjs", "jsx-a11y"],
  rules: {
    "react/no-unescaped-entities": "off",
    "typescript/no-explicit-any": "warn",
    "typescript/no-unused-vars": "warn",
    "react/exhaustive-deps": "warn",
  },
  options: {
    "typeAware": true,
    "typeCheck": true,
  }
});
