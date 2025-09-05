import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/main.css'

const app = createApp(App)

app.use(store)
app.use(router)

export default app
