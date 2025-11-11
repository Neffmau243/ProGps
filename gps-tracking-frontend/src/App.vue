<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTheme } from 'vuetify'

const themeStore = useThemeStore()
const theme = useTheme()

onMounted(() => {
  // Aplicar el tema guardado a Vuetify
  theme.global.name.value = themeStore.isDark ? 'dark' : 'light'
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}
</style>
