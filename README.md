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

2. icons

    - 选择地址[https://icon-sets.iconify.design/?category=UI+24px](https://icon-sets.iconify.design/?category=UI+24px)
    - 使用方法

        ```vue
        <template>
          <Icon icon="material-symbols-light:refresh"></Icon>
        </template>
        ```

3. 重要的通知用 $notify, 需用户手动关闭
4. 轻提示用 $msg
5. 升级 tdesign 组件库时，手动对比 `node_modules/tdesign-vue-next/global.d.ts`
6. 升级 unplugin-vue-components，手动对比 `tDesignResolver`
7. api 文件夹里面的接口都是没有在 swagger 中定义的，是手动添加的

## todo

- stylelint `unit-allowed-list`、`declaration-property-unit-allowed-list`
- 整理[setting.json](https://github.com/vbenjs/vue-vben-admin/blob/main/.vscode/settings.json)
- 有时间尝试一下这个打包分析工具[https://sonda.dev/](https://sonda.dev/)
- [server.warmup配置](https://mp.weixin.qq.com/s?__biz=Mzk0MDUyMDI4OA==&mid=2247484020&idx=1&sn=7d0c88c1b10c001b1d7724ace76d1b7a&chksm=c3b7c9155a69b2bf2e966e2bfbf55b40fa40c63d1e893d43d3ee0b452e25d7ad36bae8fe02d2&mpshare=1&scene=24&srcid=1007A1bipuxBSqdRkfwltAzs&sharer_shareinfo=a95b5998c3c2f0d944a89b04af59f319&sharer_shareinfo_first=a95b5998c3c2f0d944a89b04af59f319#rd)
- [tdesign-starter](https://tdesign.tencent.com/starter/vue-next/dashboard/base)
- 404 页面搞好看一点
- 添加 waiting 动画
- form reset 时，清空数据， show 为 false 的会不会一起reset?
- [封装右键菜单](https://github.com/CyberNika/v-contextmenu/blob/main/src/directive.ts)
- 怎么给 page 添加 lazy-view loading

### 分析包大小

```text
// exclude
**/*runtime-core.esm-bundler.js,**/*vue-router.mjs,**/*reactivity.esm-bundler.js
```

- `tdesign-vue-next` 依赖 lodash-es

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
    "*": "eslint --fix",
  },
}
```
