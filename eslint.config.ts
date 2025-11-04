// eslint-disable-next-line unused-imports/no-unused-imports
import type { composer } from 'eslint-flat-config-utils' // 不能删除
import antfu, { perfectionist as perfectionistConfigFn } from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import prettierOptions from './prettier.config.mjs'

const perfectionistConfig = await perfectionistConfigFn()

export default antfu(
  {
    formatters: {
      // 都默认开启了
      css: true, // 与 stylelint 一起
      html: true,
      markdown: true, // 使用 prettier 格式化 markdown 文件,搭配 davidAnson.vscode-markdownlint 插件一起使用
      prettierOptions, // 配置 prettier 的配置,这里不会读 ignorePath 这个配置,否则 ignorePath 里面配置的文件都不会被 prettier 格式化了
      svg: true,
      xml: true, // 这一项配置了 vscode 的 eslint 插件会报错, 需要 @prettier/plugin-xml 插件
    },
    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    // GLOB_EXCLUDE 已经包括了大部分的忽略文件，遵守 gitignore 规则
    ignores: [
      'folder-alias.json',
      'src/plugins/alova/generate/pl-admin/apiDefinitions.ts',
      'src/plugins/alova/generate/pl-admin/createApis.ts',
      'src/plugins/alova/generate/pl-admin/globals.d.ts',
      'src/plugins/alova/generate/pl-admin.swagger.json',
    ],
    jsonc: {
      overrides: {
        'jsonc/comma-dangle': 'off', // 与 prettier 保持一致
      },
    },
    // jsonc: true, // 配合 vscode.json-language-features 一起使用 (默认为true) [jsonc: true 排序， vscode.json-language-features 截断好一点]
    // markdown: true, // 1、 Enable linting for **code snippets** in Markdown. 2. 也会把上面的 formatters.markdown 设置为true 3. 默认为true
    // https://eslint.style/packages/default#rules
    stylistic: {
      indent: 2,
      jsx: true,
      overrides: {
        'style/padding-line-between-statements': [
          'error',
          { blankLine: 'never', next: '*', prev: '*' },
          {
            blankLine: 'always',
            next: '*',
            prev: [
              'import',
              'export',
              'class',
              'function',
              'multiline-block-like',
              'const',
              'let',
              'var',
            ],
          },
          {
            blankLine: 'always',
            next: ['export', 'class', 'function', 'multiline-block-like', 'const', 'let', 'var'],
            prev: '*',
          },
          { blankLine: 'never', next: 'import', prev: 'import' },
          {
            blankLine: 'never',
            next: ['const', 'let', 'var'],
            prev: ['const', 'let', 'var'],
          },
        ],
      },
      quotes: 'single',
      semi: false,
    },
    // https://typescript-eslint.io/rules/
    typescript: {
      // other rules
      overrides: {
        'prefer-promise-reject-errors': [
          'error',
          {
            allowEmptyReject: true, // 允许空的 Promise.reject()
          },
        ],
      },
      // type checked rules
      overridesTypeAware: {
        'ts/promise-function-async': 'off',
        'ts/strict-boolean-expressions': [
          'error',
          {
            allowAny: false,
            allowNullableBoolean: true,
            allowNullableEnum: false,
            allowNullableNumber: false,
            allowNullableObject: false,
            allowNullableString: true,
            allowNumber: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
            allowString: true,
          },
        ],
      },
      tsconfigPath: 'tsconfig.json', // Linting with Type Information https://typescript-eslint.io/getting-started/typed-linting/
    },
    vue: {
      overrides: {
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          {
            registeredComponentsOnly: false,
          },
        ], // 组件名必须为PascalCase
        'vue/html-self-closing': [
          'error',
          {
            html: {
              component: 'never',
              normal: 'never',
              void: 'always', // 常见的 HTML 空元素 br, hr...
            },
            math: 'always',
            svg: 'always',
          },
        ], // html标签不要自闭合
        'vue/singleline-html-element-content-newline': 'off',
      },
    },
  },
  {
    rules: {
      // 'antfu/consistent-list-newline': 'off',
      'no-console': 'off',
    },
  },
)
  .override(perfectionistConfig[0].name!, {
    rules: {
      ...perfectionist.configs['recommended-natural'].rules,
      ...perfectionistConfig[0].rules,
    },
  })
  .append({
    ignores: ['**/*.md', '**/*.html', '**/*.xml', '**/*.svg'],
    // https://github.com/prettier/eslint-plugin-prettier
    ...eslintPluginPrettierRecommended,
  })
