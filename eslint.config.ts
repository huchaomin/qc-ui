// eslint-disable-next-line unused-imports/no-unused-imports
import type { composer } from 'eslint-flat-config-utils' // 不能删除
import antfu, { perfectionist as perfectionistConfigFn } from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierOptions from './prettier.config.ts'

const perfectionistConfig = await perfectionistConfigFn()

export default antfu(
  {
    formatters: {
    // 都默认开启了
    // css: true, // 与 stylelint 一起
    // html: true,
    // markdown: true, // 使用 prettier 格式化 markdown 文件,搭配 davidAnson.vscode-markdownlint 插件一起使用
    // xml: true, 这一项配置了 vscode 的 eslint 插件会报错, 需要 @prettier/plugin-xml 插件
      prettierOptions, // 配置 prettier 的配置,这里不会读 ignorePath 这个配置,否则 ignorePath 里面配置的文件都不会被 prettier 格式化了
    },
    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    // GLOB_EXCLUDE 已经包括了大部分的忽略文件，遵守 gitignore 规则
    ignores: [
      'types/auto-import.d.ts',
      'types/components.d.ts',
      'types/env.d.ts',
      'folder-alias.json',
    ],
    jsonc: {
      overrides: {
        'jsonc/comma-dangle': ['error', {
          arrays: 'always-multiline',
          objects: 'always-multiline',
        }],
      },
    },
    // jsonc: true, // 配合 vscode.json-language-features 一起使用 (默认为true) [jsonc: true 排序， vscode.json-language-features 截断好一点]
    // markdown: true, // 1、 Enable linting for **code snippets** in Markdown. 2. 也会把上面的 formatters.markdown 设置为true 3. 默认为true
    // https://eslint.style/packages/default#rules
    stylistic: {
      indent: 2,
      jsx: true,
      overrides: { // TODO padding
        'style/padding-line-between-statements': ['error', { blankLine: 'never', next: '*', prev: '*' }, { blankLine: 'always', next: '*', prev: 'import' }, { blankLine: 'never', next: 'import', prev: 'import' }, { blankLine: 'always', next: 'export', prev: '*' }],
      },
      quotes: 'single',
      semi: false,
    },
    // https://typescript-eslint.io/rules/
    typescript: {

      // other rules
      overrides: {

      },
      // type checked rules
      overridesTypeAware: {
        'ts/strict-boolean-expressions': [
          'error',
          {
            allowAny: false,
            allowNullableBoolean: true,
            allowNullableEnum: false,
            allowNullableNumber: true,
            allowNullableObject: true,
            allowNullableString: true,
            allowNumber: true,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
            allowString: true,
          },
        ],
      },
      tsconfigPath: 'tsconfig.json', // Linting with Type Information https://typescript-eslint.io/getting-started/typed-linting/
    },
  },
  {
    files: ['package.json'],
    rules: {
      'jsonc/comma-dangle': 'off',
    },
  },
).override(perfectionistConfig[0].name!, {
  rules: {
    ...perfectionist.configs['recommended-natural'].rules,
    ...perfectionistConfig[0].rules,
  },
})
