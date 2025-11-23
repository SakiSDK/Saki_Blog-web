import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Store } from "@/types";

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Store.Theme.State>('light')
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  watch(theme, (newValue) => {
      document.documentElement.dataset.theme = newValue;
  },{immediate:true})
  return {
    theme,
    toggleTheme
  }
}, {
  persist: true
})