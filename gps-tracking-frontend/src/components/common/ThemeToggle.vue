<template>
  <v-btn
    :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
    @click="toggleTheme"
    variant="text"
  >
    <v-icon>
      {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
    </v-icon>
    <v-tooltip activator="parent" location="bottom">
      {{ isDark ? 'Modo Claro' : 'Modo Oscuro' }}
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTheme } from 'vuetify'

const themeStore = useThemeStore()
const theme = useTheme()

const isDark = computed(() => theme.global.name.value === 'dark')

const toggleTheme = () => {
  // Cambiar entre los temas 'light' y 'dark'
  const newTheme = theme.global.name.value === 'dark' ? 'light' : 'dark'
  theme.global.name.value = newTheme
  
  // Guardar en store y localStorage
  themeStore.setTheme(newTheme === 'dark')
}
</script>
