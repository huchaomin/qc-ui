// @ts-expect-error 开发环境使用
import TDesign from 'tdesign-vue-next/dist/tdesign.min.js'
import app from './main'
import 'tdesign-vue-next/dist/tdesign.min.css'

// eslint-disable-next-line ts/no-unsafe-argument
app.use(TDesign)
