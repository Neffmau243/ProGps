<template>
  <component 
    :is="iconComponent" 
    :class="['icon', sizeClass]"
    :style="iconStyle"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

interface Props {
  name: string
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
})

// Convertir el nombre del icono al formato de importación
// Ejemplo: 'mdi:account' -> '~icons/mdi/account'
const iconComponent = computed(() => {
  const [collection, icon] = props.name.split(':')
  
  if (!collection || !icon) {
    console.warn(`Invalid icon name: ${props.name}`)
    return defineAsyncComponent(() => import('~icons/mdi/help-circle'))
  }
  
  return defineAsyncComponent(() => 
    import(`~icons/${collection}/${icon}`).catch(() => {
      console.warn(`Icon not found: ${props.name}`)
      return import('~icons/mdi/help-circle')
    })
  )
})

const sizeClass = computed(() => {
  if (typeof props.size === 'number') {
    return ''
  }
  return `icon-${props.size}`
})

const iconStyle = computed(() => {
  const styles: Record<string, string> = {
    color: props.color,
  }
  
  if (typeof props.size === 'number') {
    styles.width = `${props.size}px`
    styles.height = `${props.size}px`
    styles.fontSize = `${props.size}px`
  }
  
  return styles
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

/* Tamaños predefinidos */
.icon-xs {
  width: 16px;
  height: 16px;
  font-size: 16px;
}

.icon-sm {
  width: 20px;
  height: 20px;
  font-size: 20px;
}

.icon-md {
  width: 24px;
  height: 24px;
  font-size: 24px;
}

.icon-lg {
  width: 32px;
  height: 32px;
  font-size: 32px;
}

.icon-xl {
  width: 48px;
  height: 48px;
  font-size: 48px;
}

.icon-2xl {
  width: 64px;
  height: 64px;
  font-size: 64px;
}
</style>
