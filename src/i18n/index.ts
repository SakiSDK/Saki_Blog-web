import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'
import zhTW from './locales/zh-TW.json'
import jaJp from './locales/ja-JP.json'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false, // 使用composition API模式
  locale: localStorage.getItem('lang') || 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
    'ja-JP': jaJp,
  }
})

export default i18n;