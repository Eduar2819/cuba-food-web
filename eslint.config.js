import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  // Screaming architecture: features solo se consumen por su index.ts público.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/**', 'src/app/router/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/features/[^/]+/.+',
              message: 'Importa otras features solo desde su index.ts (@/features/<feature>).',
            },
          ],
        },
      ],
    },
  },
  // El router puede importar páginas directamente (un chunk por ruta), nada más.
  {
    files: ['src/app/router/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/features/[^/]+/(?!pages/).+',
              message: 'El router solo importa features/<feature>/pages/* o el index.ts.',
            },
          ],
        },
      ],
    },
  },
  // shared nunca depende de features ni de app.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features', '@/features/*', '@/app', '@/app/*'],
              message: 'shared no puede importar de features ni de app.',
            },
          ],
        },
      ],
    },
  },
  prettier,
])
