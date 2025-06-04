import type { PluginOption } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import { visualizer } from 'rollup-plugin-visualizer'
import smvp from 'speed-measure-vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import { compression } from 'vite-plugin-compression2'
import { envParse, parseLoadedEnv } from 'vite-plugin-env-parse'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
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
    plugins: smvp([
      envParse({
        dtsPath: resolvePath('types/env.d.ts'),
      }),
      createHtmlPlugin({
        entry: '../src/main.ts',
        minify: true,
        template: 'build/index.html',
      }),
      tailwindcss(),
      vue(),
      vueJsx(),
      vueDevTools(),
      (viteImagemin as unknown as typeof viteImagemin.default)({
        gifsicle: { // https://github.com/imagemin/imagemin-gifsicle
          colors: 256, // 指定 GIF 图像调色板（颜色表）的最大颜色数量, 可丢弃一些颜色达到更大的优化效果
          interlaced: false, // 渐进式加载效果
          optimizationLevel: 2, // 中的优化级别
        },
        mozjpeg: {
          quality: 50, // 图片质量(0-100)
        },
        optipng: {
          optimizationLevel: 3, // 压缩过程中尝试的优化策略和强度(0-7)
        },
        pngquant: {
          quality: [0.65, 0.8], // 压缩后的图片质量范围[最小, 最大]
          speed: 4,
        },
        svgo: {
          datauri: 'base64', // 'base64'|'enc'|'unenc' 指定如何将 SVG 转换为 Data URI 格式
          js2svg: { // 控制 SVG 输出的格式
            indent: 4, // 缩进空格数
            pretty: false, // 是否美化输出格式
          },
          multipass: false, // 是否启用多遍优化: false 表示只进行单遍优化，true 会重复优化直到无法进一步优化, 设置为 true 的话可能优化的更大
          plugins: [
            {
              name: 'preset-default',
            },
          ],
        },
        webp: {
          quality: 80, // 图片质量(0-100)
        },
      }),
      visualizer({
        filename: resolvePath(
          'build/.cache/visualizer/report.html',
        ),
        open: true,
      }),
      compression(),
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
