import type { Config } from 'prettier'
/**
 * @description: https://prettier.io/docs/en/options
 * @description: 这里面有些配置不是 prettier 的配置，而是 antfu prettierOptions 里面的配置
 */
const config: Config = {
  $schema: 'https://json.schemastore.org/prettierrc',
  arrowParens: 'always', // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  bracketSameLine: false, // 会把多行的 HTML (包括 HTML、JSX、Vue 和 Angular) 元素的 `>` 放在最后一个属性的末尾，而不是另起一行（自闭合标签不受该选项控制）。
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  embeddedLanguageFormatting: 'auto', // 控制嵌入的其他语言代码格式化。
  endOfLine: 'lf', // 结束行形式
  htmlWhitespaceSensitivity: 'css', // 对HTML全局空白不敏感
  insertPragma: false, // 在已被preitter格式化的文件顶部加上标注
  jsxSingleQuote: false, // jsx中使用单引号
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 120, // 单行长度
  proseWrap: 'preserve', // 保留原有的换行符，不进行任何修改
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  requirePragma: false, // 无需顶部注释即可格式化
  semi: false, // 句末使用分号
  singleAttributePerLine: false, // 会在 HTML、JSX、Vue 和 Angular 中格式化为每个属性单独占一行。
  singleQuote: true, // 使用单引号
  tabWidth: 2, // 缩进长度
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  useTabs: false, // 使用空格代替tab缩进
  vueIndentScriptAndStyle: false, // 不对vue中的script及style标签缩进
  xmlQuoteAttributes: 'as-needed', // 仅在必需时为XML属性添加引号
  xmlSelfClosingSpace: true, // 在自闭合标签之间添加空格
  xmlSortAttributesByKey: true, // 按属性键排序XML元素
  xmlWhitespaceSensitivity: 'strict', // 对XML全局空白敏感
}

export default config
