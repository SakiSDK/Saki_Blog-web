import { createApp, watch } from 'vue'
import App from './App.vue'
import { createPinia, storeToRefs } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 pinia 持久化插件
import router from './routers'
import 'normalize.css'
import './styles/main.scss'
import '@/assets/icons/iconfont.css'
import BaseComponents from '@/components/global'
import i18n from './i18n'
import { useLangStore } from './stores/lang.store'
import message from './plugins/message'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
// 注册指令 
import directives from './directives'


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

app.use(VueTippy, {
  directive: 'tippy', // => v-tippy
  component: 'tippy', // => <tippy/>
  componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
  defaultProps: {
    placement: 'bottom',
    arrow: true,
    interaction: true,
    hideOnClick: false,
    theme: 'material',
  }, // => Global default options * see all props
})

// 注册指令
app.use(directives)

// 注册全局组件
app.use(BaseComponents)
app.use(message)
app.mount('#app')