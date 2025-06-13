import type { PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import viteImagemin from 'vite-plugin-imagemin'
import vueDevTools from 'vite-plugin-vue-devtools'
import { svgoConfig } from './utils/config.ts'
import { resolvePath } from './utils/index.ts'

export default {
  development: [
    vueDevTools(),
  ] as PluginOption[],
  production: [
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
      // @ts-expect-error viteImagemin 类型不全
      svgo: svgoConfig,
      webp: {
        quality: 80, // 图片质量(0-100)
      },
    }),
    compression(),
    visualizer({
      filename: resolvePath(
        'build/.cache/visualizer/report.html',
      ),
      open: true,
    }),
  ] as PluginOption[],
}
