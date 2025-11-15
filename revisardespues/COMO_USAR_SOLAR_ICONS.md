# 🚀 Cómo Usar Solar Icons - Guía Rápida

## ✅ Ya está instalado!

```bash
✓ @iconify/vue instalado
✓ Componente SolarIcon creado
✓ Catálogo de iconos disponible
```

---

## 📝 Uso en 3 Pasos

### 1️⃣ Importar el componente

```vue
<script setup lang="ts">
import SolarIcon from '@/components/SolarIcon.vue'
</script>
```

### 2️⃣ Usar en el template

```vue
<template>
  <SolarIcon name="gps" />
</template>
```

### 3️⃣ ¡Listo! 🎉

---

## 🎨 Ejemplos Rápidos

### Botón con icono
```vue
<v-btn color="primary">
  <SolarIcon name="gps" :size="20" class="mr-2" />
  Iniciar GPS
</v-btn>
```

### Card con icono
```vue
<v-card-title class="d-flex align-center">
  <SolarIcon name="map-point" :size="24" class="mr-2" />
  Ubicación Actual
</v-card-title>
```

### Lista con icono
```vue
<v-list-item>
  <template #prepend>
    <SolarIcon name="user" :size="24" />
  </template>
  <v-list-item-title>Juan Pérez</v-list-item-title>
</v-list-item>
```

---

## 🎯 Iconos Más Usados para GPS

```vue
<!-- GPS y Ubicación -->
<SolarIcon name="gps" />
<SolarIcon name="map-point" />
<SolarIcon name="map" />
<SolarIcon name="compass" />

<!-- Usuarios -->
<SolarIcon name="user" />
<SolarIcon name="users-group-rounded" />

<!-- Dispositivos -->
<SolarIcon name="smartphone" />
<SolarIcon name="devices" />

<!-- Acciones -->
<SolarIcon name="play" />
<SolarIcon name="pause" />
<SolarIcon name="refresh" />
<SolarIcon name="settings" />
```

---

## 🎨 Personalización

### Tamaño
```vue
<SolarIcon name="gps" :size="16" />  <!-- Pequeño -->
<SolarIcon name="gps" :size="24" />  <!-- Normal (default) -->
<SolarIcon name="gps" :size="32" />  <!-- Grande -->
```

### Estilo
```vue
<SolarIcon name="gps" style="linear" />
<SolarIcon name="gps" style="bold" />
<SolarIcon name="gps" style="bold-duotone" />  <!-- Recomendado -->
<SolarIcon name="gps" style="broken" />
```

### Color
```vue
<SolarIcon name="gps" class="text-primary" />
<SolarIcon name="gps" class="text-success" />
<SolarIcon name="gps" class="text-error" />
```

---

## 📚 Catálogo de Iconos

Usa el catálogo predefinido:

```vue
<script setup lang="ts">
import SolarIcon from '@/components/SolarIcon.vue'
import { SOLAR_ICONS, GPS_ICONS } from '@/utils/solarIcons'
</script>

<template>
  <SolarIcon :name="SOLAR_ICONS.GPS" />
  <SolarIcon :name="GPS_ICONS.TRACKING_ON" />
</template>
```

---

## 🔍 Buscar Más Iconos

Visita: **https://solar-icons.vercel.app/icons**

Copia el nombre del icono (sin el prefijo `solar:`) y úsalo:

```vue
<SolarIcon name="nombre-del-icono" />
```

---

## 📖 Documentación Completa

Lee `SOLAR_ICONS_GUIDE.md` para:
- Ejemplos avanzados
- Animaciones
- Mejores prácticas
- Lista completa de iconos

---

## 🎬 Ver Ejemplos en Vivo

Abre el componente de ejemplo:
```
src/components/examples/SolarIconsExample.vue
```

Agrégalo a una ruta para verlo en acción:
```vue
<template>
  <SolarIconsExample />
</template>

<script setup lang="ts">
import SolarIconsExample from '@/components/examples/SolarIconsExample.vue'
</script>
```

---

## ✨ Ventajas

- ✅ Diseño moderno y limpio
- ✅ 4 estilos diferentes
- ✅ Muy ligero (carga bajo demanda)
- ✅ Fácil de usar
- ✅ Más de 1000 iconos disponibles

---

¡Listo para usar Solar Icons en tu proyecto! 🎉
