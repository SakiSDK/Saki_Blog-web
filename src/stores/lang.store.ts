import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store } from '@/types';

export const useLangStore = defineStore(
  'lang',
  () => {
    // 当前语言
    const lang = ref<Store.Lang.State>('zh-CN');

    // 支持的语言列表
    const languages = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP'] as const;

    // 循环切换语言
    const toggleLang = () => {
      const currentIndex = languages.indexOf(lang.value)
      const nextIndex = (currentIndex + 1) % languages.length
      lang.value = languages[nextIndex] as Store.Lang.State
    }

    // 直接设置指定语言
    const setLang = (value: Store.Lang.State) => {
      if (languages.includes(value)) {
        lang.value = value
      }
    }

    return {
      lang,
      languages,
      toggleLang,
      setLang,
    }
  },
  {
    persist: true, // 自动持久化
  }
)