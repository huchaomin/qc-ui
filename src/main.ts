import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/main.css'
import '@/plugins/others'

const app = createApp(App)

app.config.errorHandler = (...args) => {
  console.error(args)
}

app.use(store)
app.use(router)
app.use(autoAnimatePlugin)
useCommonStore().getAppInfo()

export default app
