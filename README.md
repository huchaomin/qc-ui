# readme

## 库

- `@prettier/plugin-xml` 格式化xml、svg文件
- `jiti` [eslint 配置相关](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)
- `eslint-plugin-format` 格式化css, html 等文件
- `postcss-html` 被 `stylelint-config-recommended-vue` 依赖
- `postcss-markdown` 用于 stylelint 格式化 markdown 中的 css 代码块
- `npm-run-all2` 项目 script 运行命令时，需要用到的包

## 注意

- Ignored build scripts \*\* Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts

  ```md
  pnpm approve-builds
  ```

  运行上述命令选择允许哪些依赖包在安装时自动执行生命周期脚本

- icons
  - 选择地址[https://icon-sets.iconify.design/?category=UI+24px](https://icon-sets.iconify.design/?category=UI+24px)
  - 使用方法

    ```vue
    <template>
      <Icon icon="material-symbols-light:refresh"></Icon>
    </template>
    ```

- 重要的通知用 $notify, 需用户手动关闭
- 轻提示用 $msg
- 升级 tdesign 组件库时，手动对比 `node_modules/tdesign-vue-next/global.d.ts`
- api 文件夹里面的接口都是没有在 swagger 中定义的，是手动添加的
- 若依 新建同级同名称的菜单才会校验报错，但是name不会校验
- vue-component-type-helpers 作用 [泛型](https://cn.vuejs.org/api/sfc-script-setup#generics)
- @formkit/auto-animate dom元素里面 不能使用 v-auto-animate，要不然会内存泄露

## todo

- stylelint `unit-allowed-list`、`declaration-property-unit-allowed-list`
- 整理[setting.json](https://github.com/vbenjs/vue-vben-admin/blob/main/.vscode/settings.json)
- 有时间尝试一下这个打包分析工具[https://sonda.dev/](https://sonda.dev/)
- [server.warmup配置](https://mp.weixin.qq.com/s?__biz=Mzk0MDUyMDI4OA==&mid=2247484020&idx=1&sn=7d0c88c1b10c001b1d7724ace76d1b7a&chksm=c3b7c9155a69b2bf2e966e2bfbf55b40fa40c63d1e893d43d3ee0b452e25d7ad36bae8fe02d2&mpshare=1&scene=24&srcid=1007A1bipuxBSqdRkfwltAzs&sharer_shareinfo=a95b5998c3c2f0d944a89b04af59f319&sharer_shareinfo_first=a95b5998c3c2f0d944a89b04af59f319#rd)
- [tdesign-starter](https://tdesign.tencent.com/starter/vue-next/dashboard/base)
- 404 页面搞好看一点
- [封装右键菜单](https://github.com/CyberNika/v-contextmenu/blob/main/src/directive.ts)
- 怎么给 page 添加 lazy-view loading
- 定义refresh page store
- 上传用户图片
- 600 现在是不管成功和失败，都弹窗，需要优化
- admin 用户登录 判断哪些菜单生成了却没有被用到
- z-vue-scan
- 根据btn text 添加icon, 根据是否focus 和 loading 状态 loading
- pluginWebUpdateNotice
- 为自定义全局指令添加类型 v-auto-animate
- selectRow 属性 样式,
- reject 处理
- 支持多级 Breadcrumb，对象存储在 recentRoutersStore 中
- GradientText 取自 css 变量
- [AutoDecimal](https://juejin.cn/post/7450708775008747557)
- zx —— 真正像 JavaScript 的 Shell 脚本
- vue-skills
- FormData type 为专有名词
- [https://juejin.cn/post/7263810695459438653]
- (泛型的联合类型分发)[https://juejin.cn/post/7228833037743915067#heading-18]

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
