# 🎨 Guía: Bootstrap Icons en Vue 3

## 📚 Introducción

Bootstrap Icons es la librería oficial de iconos de Bootstrap con **1,800+ iconos** gratuitos y de código abierto.

### ✅ Ventajas
- 🎯 Fácil de usar (si conoces Bootstrap)
- 📦 1,800+ iconos bien diseñados
- 🎨 Consistente con Bootstrap
- ⚡ Ligero y rápido
- 🔧 Múltiples formas de uso

---

## 🛠️ Instalación

Ya está instalado en tu proyecto:

```bash
npm install bootstrap-icons
```

---

## 💡 Métodos de Uso

### **Método 1: Como Fuente de Iconos (Más Simple)**

#### Configuración Global (main.ts):

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).mount('#app')
```

#### Uso en Componentes:

```vue
<template>
  <!-- Básico -->
  <i class="bi bi-person"></i>
  
  <!-- Con tamaño -->
  <i class="bi bi-person fs-1"></i>
  <i class="bi bi-person fs-3"></i>
  
  <!-- Con color -->
  <i class="bi bi-person text-success"></i>
  <i class="bi bi-person" style="color: var(--color-neon-green)"></i>
</template>

<style scoped>
.bi {
  font-size: 24px;
}
</style>
```

---

### **Método 2: Como SVG Inline (Mejor Rendimiento)**

```vue
<template>
  <svg class="bi" width="32" height="32" fill="currentColor">
    <use xlink:href="bootstrap-icons.svg#person"/>
  </svg>
</template>
```

---

### **Método 3: Componente Wrapper (Recomendado)**

Crea un componente reutilizable:

```vue
<!-- src/components/common/BootstrapIcon.vue -->
<template>
  <i 
    :class="['bi', `bi-${name}`, sizeClass]"
    :style="{ color: color }"
  ></i>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor'
})

const sizeClass = computed(() => {
  if (typeof props.size === 'number') return ''
  
  const sizes = {
    sm: 'fs-6',
    md: 'fs-5',
    lg: 'fs-3',
    xl: 'fs-1'
  }
  return sizes[props.size]
})
</script>

<style scoped>
.bi {
  display: inline-block;
  vertical-align: middle;
}
</style>
```

**Uso:**

```vue
<script setup>
import BootstrapIcon from '@/components/common/BootstrapIcon.vue'
</script>

<template>
  <BootstrapIcon name="person" size="lg" />
  <BootstrapIcon name="phone" color="green" />
</template>
```

---

## 🎯 Mapeo de Emojis a Bootstrap Icons

| Emoji | Bootstrap Icon | Clase |
|-------|----------------|-------|
| 📊 | Dashboard | `bi-speedometer2` |
| 👥 | Usuarios | `bi-people` |
| 📱 | Dispositivo | `bi-phone` |
| 🗺️ | Mapa | `bi-map` |
| 📍 | Ubicación | `bi-geo-alt` |
| 👤 | Perfil | `bi-person` |
| 🔍 | Buscar | `bi-search` |
| ➕ | Agregar | `bi-plus-circle` |
| ✏️ | Editar | `bi-pencil` |
| 🗑️ | Eliminar | `bi-trash` |
| ⚠️ | Advertencia | `bi-exclamation-triangle` |
| ✅ | Éxito | `bi-check-circle` |
| 🔒 | Bloquear | `bi-lock` |
| 🔔 | Notificación | `bi-bell` |
| 🚪 | Salir | `bi-box-arrow-right` |
| ⏱️ | Tiempo | `bi-clock` |
| 🔄 | Actualizar | `bi-arrow-clockwise` |
| 👑 | Admin | `bi-star` |
| ℹ️ | Info | `bi-info-circle` |

---

## 📝 Ejemplos Prácticos

### En NavBar:

```vue
<template>
  <nav class="navbar">
    <router-link to="/admin/dashboard" class="nav-item">
      <i class="bi bi-speedometer2"></i>
      Dashboard
    </router-link>
    
    <router-link to="/admin/users" class="nav-item">
      <i class="bi bi-people"></i>
      Usuarios
    </router-link>
    
    <router-link to="/admin/devices" class="nav-item">
      <i class="bi bi-phone"></i>
      Dispositivos
    </router-link>
  </nav>
</template>

<style scoped>
.nav-item .bi {
  font-size: 20px;
  margin-right: 8px;
}
</style>
```

### En Botones:

```vue
<template>
  <button class="btn btn-primary">
    <i class="bi bi-plus-circle"></i>
    Crear Usuario
  </button>
  
  <button class="btn btn-danger">
    <i class="bi bi-trash"></i>
    Eliminar
  </button>
  
  <button class="btn btn-icon">
    <i class="bi bi-pencil"></i>
  </button>
</template>
```

### En Cards:

```vue
<template>
  <div class="stat-card">
    <i class="bi bi-people stat-icon"></i>
    <div class="stat-content">
      <div class="stat-value">{{ totalUsers }}</div>
      <div class="stat-label">Usuarios</div>
    </div>
  </div>
</template>

<style scoped>
.stat-icon {
  font-size: 48px;
  color: var(--color-neon-green);
}
</style>
```

### Estados Condicionales:

```vue
<template>
  <i 
    :class="[
      'bi',
      isActive ? 'bi-check-circle' : 'bi-x-circle'
    ]"
    :style="{ color: isActive ? 'green' : 'red' }"
  ></i>
</template>
```

---

## 🎨 Tamaños Disponibles

### Con Clases de Bootstrap:

```vue
<i class="bi bi-person fs-1"></i> <!-- Extra grande -->
<i class="bi bi-person fs-2"></i> <!-- Grande -->
<i class="bi bi-person fs-3"></i> <!-- Mediano -->
<i class="bi bi-person fs-4"></i> <!-- Normal -->
<i class="bi bi-person fs-5"></i> <!-- Pequeño -->
<i class="bi bi-person fs-6"></i> <!-- Extra pequeño -->
```

### Con CSS Personalizado:

```vue
<i class="bi bi-person" style="font-size: 32px"></i>
<i class="bi bi-person" style="font-size: 2rem"></i>
```

---

## 🎨 Colores

### Con Clases de Bootstrap:

```vue
<i class="bi bi-person text-primary"></i>
<i class="bi bi-person text-success"></i>
<i class="bi bi-person text-danger"></i>
<i class="bi bi-person text-warning"></i>
<i class="bi bi-person text-info"></i>
```

### Con Variables CSS:

```vue
<i class="bi bi-person" style="color: var(--color-neon-green)"></i>
```

---

## 🔍 Buscar Iconos

**Sitio oficial:** https://icons.getbootstrap.com/

1. Busca el icono que necesitas
2. Copia el nombre (ej: `person`, `phone`, `map`)
3. Úsalo con el prefijo `bi-`: `bi-person`

---

## 💪 Ventajas sobre Emojis

| Característica | Emojis | Bootstrap Icons |
|----------------|--------|-----------------|
| Consistencia visual | ❌ | ✅ |
| Escalabilidad | ❌ | ✅ |
| Personalización | ❌ | ✅ |
| Accesibilidad | ⚠️ | ✅ |
| Animaciones | ❌ | ✅ |
| Familiaridad | ✅ | ✅ (si usas Bootstrap) |

---

## 🚀 Migración Rápida

### Antes (Emojis):
```vue
<span class="icon">📱</span>
```

### Después (Bootstrap Icons):
```vue
<i class="bi bi-phone"></i>
```

---

## 🆘 Troubleshooting

### Los iconos no se muestran

1. Verifica que importaste el CSS:
```typescript
import 'bootstrap-icons/font/bootstrap-icons.css'
```

2. Verifica el nombre del icono:
```vue
<!-- ✅ Correcto -->
<i class="bi bi-person"></i>

<!-- ❌ Incorrecto -->
<i class="bi person"></i>
```

### Los iconos se ven muy pequeños

Agrega tamaño:
```vue
<i class="bi bi-person fs-3"></i>
<!-- o -->
<i class="bi bi-person" style="font-size: 24px"></i>
```

---

## 📚 Recursos

- [Bootstrap Icons Official](https://icons.getbootstrap.com/)
- [Bootstrap Icons GitHub](https://github.com/twbs/icons)
- [Bootstrap Icons NPM](https://www.npmjs.com/package/bootstrap-icons)

---

¡Disfruta usando Bootstrap Icons! 🎉
