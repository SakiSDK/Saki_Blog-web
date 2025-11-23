import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 pinia 持久化插件
import router from './routers'
import 'normalize.css'
import './styles/main.scss'
import BaseComponents from '@/components/bases/index'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router);
app.use(pinia)
// 注册全局组件
app.use(BaseComponents)
app.mount('#app')