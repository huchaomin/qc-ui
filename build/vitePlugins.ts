import type { PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import viteImagemin from 'vite-plugin-imagemin'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolvePath } from './utils/index.ts'

export default {
  development: [vueDevTools()] as PluginOption[],
  production: [
    (viteImagemin as unknown as typeof viteImagemin.default)({
      gifsicle: {
        // https://github.com/imagemin/imagemin-gifsicle
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
        js2svg: {
          // 控制 SVG 输出的格式
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
    compression(),
    visualizer({
      filename: resolvePath('build/.cache/visualizer/report.html'),
      open: true,
    }),
  ] as PluginOption[],
}
