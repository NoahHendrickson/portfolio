import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default tseslint.config(
  defineConfig([globalIgnores(['dist', 'storybook-static'])]),
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Copied verbatim from ~/Developer/thinking-states (`src/engine`, `src/chips`) so
    // they can be re-copied as the project changes; its draw functions use `var` and
    // ternary statements on purpose (they are pasted into snippets as plain JS).
    files: ['src/thinkingStates/engine/**', 'src/thinkingStates/chips/**'],
    rules: {
      'no-var': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
)
