import { TDesign } from '@/plugins/tdesign-vue-next-for-dev'
import app from './main'
import 'tdesign-vue-next/dist/tdesign.min.css'

const compos = import.meta.glob('./components/tDesignReset/*.vue', {
  eager: true,
  import: 'default',
}) as Record<string, () => Promise<Component>>
app.use(TDesign)
delete app._context.components.TIcon // 不使用内部组件
Object.keys(compos).forEach((key) => {
  const name = getFilenameFromUrl(key)
  // 取消注册组件
  delete app._context.components[name]
  app.component(name, compos[key]!)
})
app.mount('#app')
