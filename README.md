# readme

## eslint

- `@prettier/plugin-xml` 格式化xml、svg文件
- `jiti` [eslint 配置相关](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)

## todo

- 需不需要 `eslint-plugin-prettier`

### Lint Staged

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```
