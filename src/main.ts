import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 pinia 持久化插件
import router from './routers'
import 'normalize.css'
import './styles/main.scss'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router);
app.use(pinia)
app.mount('#app')