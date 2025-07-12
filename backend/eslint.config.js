// Flat ESLint configuration for ESLint v9+
// Converts the previous .eslintrc.js rules into the new flat-config format.

import js from '@eslint/js';
import eslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore legacy ESLint config file
  {
    ignores: ['.eslintrc.cjs']
  },    
  // Base JS recommended rules
  js.configs.recommended,

  // Shared Node globals / settings
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,        
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        require: 'readonly'
      },
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },

  // TypeScript files rules
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': eslintPlugin
    },
    rules: {
      // keep parity with previous .eslintrc.js
      complexity: ['error', { max: 10 }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Recommended TS rules
      ...eslintPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
];
