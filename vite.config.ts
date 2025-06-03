import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { compression } from 'vite-plugin-compression2'
import { envParse, parseLoadedEnv } from 'vite-plugin-env-parse'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolvePath } from './build/utils/index.ts'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const envDir = resolvePath('build/env')
  const env = parseLoadedEnv(loadEnv(mode, envDir))
  console.log({
    command,
    env,
    mode,
  })
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
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      envParse({
        dtsPath: resolvePath('types/env.d.ts'),
      }),
      visualizer({
        filename: resolvePath(
          'build/.cache/visualizer/report.html',
        ),
        open: true,
      }),
      compression(),
    ],
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
