# 🎨 Guía de Uso: Unplugin-Icons

## 📚 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Métodos de Uso](#métodos-de-uso)
4. [Colecciones Disponibles](#colecciones-disponibles)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Migración de Emojis](#migración-de-emojis)
7. [Recursos](#recursos)

---

## 🎯 Introducción

**Unplugin-Icons** te da acceso a más de **150,000 iconos** de múltiples colecciones populares, todo con tree-shaking automático y soporte completo para Vue 3 + TypeScript.

### ✅ Ventajas
- 🚀 Tree-shaking automático (solo importa lo que usas)
- 📦 Cero impacto en bundle size
- 🎨 Acceso a 150+ colecciones de iconos
- 💪 TypeScript nativo
- ⚡ Iconos como componentes Vue
- 🔄 Fácil de cambiar entre colecciones

---

## 📦 Instalación

Ya está instalado en el proyecto. Si necesitas instalarlo en otro proyecto:

```bash
npm install -D unplugin-icons @iconify/json
```

---

## 🛠️ Métodos de Uso

### Método 1: Importación Directa (Recomendado para iconos fijos)

```vue
<script setup lang="ts">
import IconUser from '~icons/mdi/account'
import IconDevice from '~icons/mdi/cellphone'
import IconMap from '~icons/mdi/map'
</script>

<template>
  <IconUser class="icon" />
  <IconDevice class="icon" />
  <IconMap class="icon" />
</template>

<style scoped>
.icon {
  font-size: 24px;
  color: var(--color-neon-green);
}
</style>
```

### Método 2: Componente Wrapper (Recomendado para iconos dinámicos)

```vue
<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'

const iconName = ref('mdi:account')
</script>

<template>
  <!-- Básico -->
  <Icon name="mdi:account" />
  
  <!-- Con tamaño -->
  <Icon name="mdi:account" :size="32" />
  
  <!-- Con color -->
  <Icon name="mdi:account" color="#00FF00" />
  
  <!-- Tamaños predefinidos -->
  <Icon name="mdi:account" size="xs" />  <!-- 16px -->
  <Icon name="mdi:account" size="sm" />  <!-- 20px -->
  <Icon name="mdi:account" size="md" />  <!-- 24px -->
  <Icon name="mdi:account" size="lg" />  <!-- 32px -->
  <Icon name="mdi:account" size="xl" />  <!-- 48px -->
  <Icon name="mdi:account" size="2xl" /> <!-- 64px -->
  
  <!-- Dinámico -->
  <Icon :name="iconName" />
</template>
```

### Método 3: Usando el Mapeo de Iconos

```vue
<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import { getIcon } from '@/utils/iconMapping'
</script>

<template>
  <Icon :name="getIcon('user')" />
  <Icon :name="getIcon('device')" />
  <Icon :name="getIcon('map')" />
</template>
```

---

## 🎨 Colecciones Disponibles

### Material Design Icons (MDI) - La más completa
- **Iconos:** 7,000+
- **Prefijo:** `mdi:`
- **Ejemplo:** `mdi:account`, `mdi:cellphone`, `mdi:map`
- **Sitio:** https://pictogrammers.com/library/mdi/

### Solar Icons - Diseño moderno
- **Iconos:** 1,000+
- **Prefijo:** `solar:`
- **Ejemplo:** `solar:user-bold`, `solar:smartphone-bold`
- **Sitio:** https://www.figma.com/community/file/1166831539721848736

### Heroicons - Minimalista
- **Iconos:** 292
- **Prefijo:** `heroicons:`
- **Ejemplo:** `heroicons:user`, `heroicons:device-phone-mobile`
- **Sitio:** https://heroicons.com/

### Lucide - Elegante
- **Iconos:** 1,300+
- **Prefijo:** `lucide:`
- **Ejemplo:** `lucide:user`, `lucide:smartphone`
- **Sitio:** https://lucide.dev/

### Carbon - IBM Design
- **Iconos:** 2,000+
- **Prefijo:** `carbon:`
- **Ejemplo:** `carbon:user`, `carbon:phone`
- **Sitio:** https://carbondesignsystem.com/guidelines/icons/library/

---

## 💡 Ejemplos Prácticos

### En Botones

```vue
<template>
  <button class="btn-primary">
    <Icon name="mdi:plus" :size="20" />
    Crear Usuario
  </button>
  
  <button class="btn-icon">
    <Icon name="mdi:pencil" :size="24" />
  </button>
</template>
```

### En Navegación

```vue
<template>
  <nav class="navbar">
    <router-link to="/dashboard">
      <Icon name="mdi:view-dashboard" :size="24" />
      Dashboard
    </router-link>
    
    <router-link to="/users">
      <Icon name="mdi:account-group" :size="24" />
      Usuarios
    </router-link>
  </nav>
</template>
```

### En Cards

```vue
<template>
  <div class="stat-card">
    <Icon name="mdi:account-group" :size="48" color="var(--color-neon-green)" />
    <div class="stat-content">
      <div class="stat-value">{{ totalUsers }}</div>
      <div class="stat-label">Usuarios</div>
    </div>
  </div>
</template>
```

### Estados Condicionales

```vue
<script setup lang="ts">
const isActive = ref(true)
</script>

<template>
  <Icon 
    :name="isActive ? 'mdi:check-circle' : 'mdi:close-circle'" 
    :color="isActive ? 'green' : 'red'"
    :size="32"
  />
</template>
```

---

## 🔄 Migración de Emojis

### Mapeo de Emojis a Iconos

El archivo `src/utils/iconMapping.ts` contiene un mapeo completo de todos los emojis usados en el proyecto:

```typescript
import { getIconForEmoji } from '@/utils/iconMapping'

// Antes
<span>📱</span>

// Después
<Icon :name="getIconForEmoji('📱')" />
```

### Estrategia de Migración Gradual

1. **Fase 1:** Componentes nuevos usan iconos
2. **Fase 2:** Migrar componentes principales (NavBar, SideBar)
3. **Fase 3:** Migrar vistas admin
4. **Fase 4:** Migrar vistas employee
5. **Fase 5:** Eliminar emojis completamente

---

## 🔍 Buscar Iconos

### Iconify Icon Sets
https://icon-sets.iconify.design/

Busca cualquier icono y copia su nombre directamente.

### Material Design Icons
https://pictogrammers.com/library/mdi/

### Solar Icons
https://www.figma.com/community/file/1166831539721848736

---

## 🎯 Mejores Prácticas

### ✅ DO

```vue
<!-- Usa el componente Icon para iconos dinámicos -->
<Icon :name="dynamicIcon" />

<!-- Importa directamente para iconos fijos -->
<script setup>
import IconUser from '~icons/mdi/account'
</script>

<!-- Usa tamaños consistentes -->
<Icon name="mdi:account" size="md" />
```

### ❌ DON'T

```vue
<!-- No uses emojis cuando hay iconos disponibles -->
<span>📱</span>

<!-- No uses tamaños inconsistentes -->
<Icon name="mdi:account" :size="23" />

<!-- No mezcles estilos sin razón -->
<Icon name="mdi:account" />
<Icon name="solar:user-bold" />
```

---

## 🚀 Próximos Pasos

1. ✅ Ver ejemplos en `/examples/icons`
2. 🔄 Migrar NavBar y SideBar
3. 🎨 Elegir colección principal (MDI recomendado)
4. 📝 Actualizar componentes gradualmente

---

## 📚 Recursos

- [Unplugin Icons Docs](https://github.com/unplugin/unplugin-icons)
- [Iconify Icon Sets](https://icon-sets.iconify.design/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🆘 Troubleshooting

### El icono no se muestra

1. Verifica que el nombre sea correcto: `colección:nombre`
2. Asegúrate de que la colección esté instalada
3. Revisa la consola por errores de importación

### TypeScript muestra errores

1. Asegúrate de que `src/types/icons.d.ts` existe
2. Reinicia el servidor de desarrollo
3. Reinicia el TypeScript server en VS Code

### El icono se ve muy grande/pequeño

Usa los tamaños predefinidos o especifica un tamaño numérico:
```vue
<Icon name="mdi:account" size="md" />
<Icon name="mdi:account" :size="24" />
```

---

¡Disfruta usando iconos profesionales en tu proyecto! 🎉
