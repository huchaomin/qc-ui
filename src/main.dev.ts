import { TDesign } from '@/plugins/tdesign-vue-next-for-dev'
import app from './main'
import 'tdesign-vue-next/dist/tdesign.min.css'

const compos = import.meta.glob('./components/tDesignReset/*.vue',
  { eager: true, import: 'default' }) as Record<
  string,
  () => Promise<Component>
>
app.use(TDesign)
Object.keys(compos).forEach((key) => {
  const name = getFilenameFromUrl(key)
  delete app._context.components[name]
  app.component(name, compos[key])
})
app.mount('#app')
