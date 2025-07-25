// [插件集合](https://stylelint.io/awesome-stylelint/)
// [stylelint 内置规则集](https://stylelint.io/user-guide/rules)
// 最新的版本去除了很多配置，比如缩进, 抛弃的规则 可在 @stylistic/stylelint-config(https://github.com/stylelint-stylistic/stylelint-config/blob/main/stylelint.config.js) 中找回
import defineConfig from 'stylelint-define-config'

export default defineConfig({
  cache: true,
  extends: [
    '@stylistic/stylelint-config',
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-vue', // 放最后一个 依赖 postcss-html
  ],
  // 格式化 md 文件中的 css 代码
  overrides: [
    {
      customSyntax: 'postcss-markdown',
      files: ['*.md', '**/*.md'],
    },
  ],
  plugins: ['stylelint-use-nesting'],
  // null (to turn the rule off)
  rules: {
    '@stylistic/declaration-block-trailing-semicolon': ['always'],
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['theme'],
    }],
    'csstools/use-nesting': [
      'always',
      {
        message: '尽量使用嵌套写法',
      },
    ],
    'import-notation': 'string', // TODO  url 模式好像 tailwindcss 引入有问题
    'selector-class-pattern': [
      '^(t-|([a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9])$)',
      {
        // disableFix: true, // disable autofix
        message: '自定义 class 名称使用 snake_case',
      },
    ],
  },

})
