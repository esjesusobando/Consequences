import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '_visuals_archive']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      // Off: the React Compiler is not used in this project. Its analysis
      // false-positives on mutable THREE objects ("Compilation Skipped").
      'react-hooks/compiler': 'off',
      // Warn (not error): the project deliberately exports pure helpers next
      // to components for headless testing (e.g. WellborePath). HMR falls
      // back to full reload for those files — acceptable DX trade-off.
      'react-refresh/only-export-components': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
])
