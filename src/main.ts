import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import 'tdesign-vue-next/es/style/index.css' // 引入组件库的少量全局样式变量

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

export default app
