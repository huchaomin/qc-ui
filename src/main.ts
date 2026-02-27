import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import directives from '@/plugins/others/directive'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/main.css'
import '@/plugins/others'

const app = createApp(App)

app.config.errorHandler = (...args) => {
  if (args[0] instanceof Error) {
    if (args[0].message === 'confirm_cancel') {
      return
    }
  }

  console.error(args)
}

app.use(store)
app.use(router)
app.use(directives)
app.use(autoAnimatePlugin)
useCommonStore().getAppInfo()

export default app
