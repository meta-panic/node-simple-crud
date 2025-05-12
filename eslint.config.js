// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';


export default tseslint.config(
  {
    ignores: ["dist/**"]
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  prettierConfig,
  {
    files: ['**/*.ts'],
    ignores: ["eslint.config.js", "webpack.config.js", "dist/**"],
    rules: {
      "semi":  ["error", "always"],
      "comma-dangle": ["error", "never"],
      "quotes": ["error", "double"],
      "eol-last": ["error", "always"],
    }
  },
);
