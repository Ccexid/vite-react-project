import { react } from 'eslint-config-ali';
import prettier from 'eslint-plugin-prettier/recommended';
// 使用 with { type: 'json' } 属性
import autoImportConfig from './.eslintrc-auto-import.json' with { type: 'json' };

export default [
  ...react,
  prettier,
  {
    languageOptions: {
      globals: {
        // 展开自动生成的全局变量
        ...autoImportConfig.globals,
      },
    },
    // 这里可以添加自定义规则
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
