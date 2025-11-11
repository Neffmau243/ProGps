<template>
  <v-btn
    :icon="themeStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
    @click="themeStore.toggleTheme()"
    variant="text"
  >
    <v-icon>
      {{ themeStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
    </v-icon>
    <v-tooltip activator="parent" location="bottom">
      {{ themeStore.isDark ? 'Modo Claro' : 'Modo Oscuro' }}
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>
