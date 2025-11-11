import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    
    const theme = useTheme()
    theme.global.name.value = isDark.value ? 'dark' : 'light'
  }

  function initTheme() {
    const theme = useTheme()
    theme.global.name.value = isDark.value ? 'dark' : 'light'
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
})
