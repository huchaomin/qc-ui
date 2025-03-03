# readme

## eslint

- `@prettier/plugin-xml` 格式化xml、svg文件

## todo

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
