import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<string>('light')
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