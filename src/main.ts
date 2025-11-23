import { createApp, watch } from 'vue'
import App from './App.vue'
import { createPinia, storeToRefs } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 pinia 持久化插件
import router from './routers'
import 'normalize.css'
import './styles/main.scss'
import BaseComponents from '@/components/global'
import i18n from './i18n'
import { useLangStore } from './stores/lang.store'
import message from './plugins/message'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router);
app.use(pinia)
app.use(i18n)

// 语言切换
const langStore = useLangStore();
const { lang } = storeToRefs(langStore);
watch(() => lang.value, () => {
  i18n.global.locale.value = lang.value
}, {
  immediate: true
})

// 注册全局组件
app.use(BaseComponents)
app.use(message)
app.mount('#app')