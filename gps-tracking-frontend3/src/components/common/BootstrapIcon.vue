<template>
  <i 
    :class="['bi', iconClass, sizeClass]"
    :style="iconStyle"
  ></i>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  color?: string
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor',
})

const iconClass = computed(() => `bi-${props.name}`)

const sizeClass = computed(() => {
  if (typeof props.size === 'number') return ''
  
  const sizes = {
    xs: 'fs-6',
    sm: 'fs-5',
    md: 'fs-4',
    lg: 'fs-3',
    xl: 'fs-2',
    '2xl': 'fs-1'
  }
  return sizes[props.size]
})

const iconStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  // Color personalizado o variante de Bootstrap
  if (props.variant) {
    // Las variantes se manejan con clases de Bootstrap
    return styles
  }
  
  if (props.color) {
    styles.color = props.color
  }
  
  // Tamaño personalizado
  if (typeof props.size === 'number') {
    styles.fontSize = `${props.size}px`
  }
  
  return styles
})
</script>

<style scoped>
.bi {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
</style>
