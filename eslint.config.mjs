import { react } from 'eslint-config-ali';
import prettier from 'eslint-plugin-prettier/recommended';
import autoImportConfig from './.eslintrc-auto-import.json';

export default [
  ...react,
  prettier,
  {
    languageOptions: {
      globals: {
        ...autoImportConfig.globals,
      },
    },
  },
];
