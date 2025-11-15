<template>
  <Icon :icon="iconName" :width="size" :height="size" :class="className" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  name: string
  size?: number | string
  style?: 'linear' | 'bold' | 'bold-duotone' | 'broken'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  style: 'bold-duotone',
  class: ''
})

const iconName = computed(() => {
  // Si ya incluye el prefijo solar:, usarlo directamente
  if (props.name.startsWith('solar:')) {
    return props.name
  }
  // Si no, agregar el prefijo y el estilo
  return `solar:${props.name}-${props.style}`
})

const className = computed(() => props.class)
</script>

<style scoped>
/* Opcional: estilos para los iconos */
.icon-primary {
  color: rgb(var(--v-theme-primary));
}

.icon-secondary {
  color: rgb(var(--v-theme-secondary));
}

.icon-error {
  color: rgb(var(--v-theme-error));
}

.icon-success {
  color: rgb(var(--v-theme-success));
}
</style>
