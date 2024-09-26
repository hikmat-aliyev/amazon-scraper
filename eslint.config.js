import { defineConfig } from 'eslint-define-config';
import parser from '@typescript-eslint/parser'; // Default import
import plugin from '@typescript-eslint/eslint-plugin'; // Import the plugin

export default defineConfig([
  {
    // Applies to TypeScript files
    files: ['*.ts', '*.tsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser, // Use the default import of the parser
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
      },
    },
    plugins: {
      '@typescript-eslint': plugin, // Add the plugin here
    },
    rules: {
      semi: ['error', 'always'], // Enforce semicolons
      quotes: ['error', 'single'], // Use single quotes
      indent: ['error', 2], // 2-space indentation
      '@typescript-eslint/no-unused-vars': ['error'], // Example TypeScript rule
    },
  },
]);
