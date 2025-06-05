import type { PluginOption } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import smvp from 'speed-measure-vite-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { envParse, parseLoadedEnv } from 'vite-plugin-env-parse'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolvePath } from './build/utils/index.ts'
import vitePlugins from './build/vitePlugins.ts'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const envDir = resolvePath('build/env')
  const env = parseLoadedEnv(loadEnv(mode, envDir))
  console.log({
    command,
    env,
    mode,
  })
  const isProduction = mode === 'production'
  return {
    build: {
      cssMinify: 'lightningcss',
    },
    clearScreen: false, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
    css: {
      lightningcss: {
      // https://cn.vitejs.dev/config/shared-options#css-lightningcss
        targets: browserslistToTargets(browserslist('>= 0.25%')),
      },
      transformer: 'lightningcss',
    },
    envDir, // 将 env 文件里面的变量注入到 import.meta.env 里面
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    plugins: smvp([
      envParse({
        dtsPath: resolvePath('types/env.d.ts'),
      }),
      createHtmlPlugin({
        entry: `../src/main.${isProduction ? 'prod' : 'dev'}.ts`,
        minify: true,
        template: 'build/index.html',
      }),
      tailwindcss(),
      vue(),
      vueJsx(),
      AutoImport({ // 用于自动导入 函数/工具库 的 API
        dts: resolvePath('types/auto-imports.d.ts'),
        resolvers: [
          ...(isProduction
            ? [TDesignResolver({
                library: 'vue-next',
              })]
            : []),
        ],
      }),
      Components({ // 用于自动导入 Vue 组件
        dts: resolvePath('types/components.d.ts'),
        resolvers: [
          ...(isProduction
            ? [TDesignResolver({
                library: 'vue-next',
              })]
            : []),
        ],
      }),
      ...vitePlugins[isProduction ? 'production' : 'development'],
    ] as PluginOption[]),
    resolve: {
      alias: {
        '@': resolvePath('./src'),
        'img': resolvePath('src/assets/images'),
      },
      // https://cn.vitejs.dev/guide/performance.html#reduce-resolve-operations
      // 不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
      extensions: ['.ts'],
    },
  }
})
