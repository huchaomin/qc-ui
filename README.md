# readme

## 库

- `@prettier/plugin-xml` 格式化xml、svg文件
- `jiti` [eslint 配置相关](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)
- `eslint-plugin-format` 格式化css, html 等文件
- `postcss-html` 被 `stylelint-config-recommended-vue` 依赖
- `postcss-markdown` 用于 stylelint 格式化 markdown 中的 css 代码块
- `npm-run-all2` 项目 script 运行命令时，需要用到的包

## 注意

1. Ignored build scripts ** Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts
    ```md
    pnpm approve-builds
    ```
    运行上述命令选择允许哪些依赖包在安装时自动执行生命周期脚本

## todo

- 需不需要 `eslint-plugin-prettier`
- 怎么格式化 tailwindcss 使用 prettier 或者 vscode 插件
- stylelint `unit-allowed-list`、`declaration-property-unit-allowed-list`
- .stylelintignore
- 整理[setting.json](https://github.com/vbenjs/vue-vben-admin/blob/main/.vscode/settings.json)
- 有时间尝试一下这个打包分析工具[https://sonda.dev/](https://sonda.dev/)

### Lint Staged

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged",
  },
  "lint-staged": {
    "*": "eslint --fix",
  },
}
```
