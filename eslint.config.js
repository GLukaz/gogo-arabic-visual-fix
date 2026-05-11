import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base recommended rules
  js.configs.recommended,

  // React + browser config
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Test files config (Vitest globals)
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}', 'src/test/**/*.{js,jsx}', 'e2e/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        global: 'writable',
        process: 'readonly',
        require: 'readonly',
      },
    },
  },

  // Server and scripts config (Node.js environment)
  {
    files: ['server/**/*.{js,cjs,mjs}', 'scripts/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Game/Phaser config
  {
    files: ['src/game/**/*.js'],
    languageOptions: {
      globals: {
        Phaser: 'readonly',
      },
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules', 'dist', 'coverage', 'build', 'public'],
  },

  // Prettier config (MUST be last to disable conflicting rules)
  prettierConfig,
];
