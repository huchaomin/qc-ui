import type svgLoader from 'vite-svg-loader'
import path from 'node:path'
import fg from 'fast-glob'

const files = fg.globSync('src/components/tDesignReset/*.vue')
const tDesignResetComponentsName = files.map((file) => {
  return path.basename(file, '.vue')
})
const svgoConfig: NonNullable<Parameters<typeof svgLoader>[0]>['svgoConfig'] = {
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
}

export {
  svgoConfig,
  tDesignResetComponentsName,
}
