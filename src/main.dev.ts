import { TDesign } from '@/plugins/tdesign-vue-next-for-dev'
import app from './main'
import 'tdesign-vue-next/dist/tdesign.min.css'

app.use(TDesign)
app.mount('#app')
