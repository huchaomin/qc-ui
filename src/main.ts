import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/main.css'

const app = createApp(App)

app.config.errorHandler = (...args) => {
  console.error(args)
}

app.use(store)
app.use(router)

export default app
