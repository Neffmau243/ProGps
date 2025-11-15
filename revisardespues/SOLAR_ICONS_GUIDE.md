# 🎨 Guía de Uso de Solar Icons

## 📦 Instalación

Ya está instalado en el proyecto:
```bash
npm install @iconify/vue
```

---

## 🚀 Uso Básico

### Opción 1: Usando el componente SolarIcon (Recomendado)

```vue
<template>
  <SolarIcon name="gps" />
  <SolarIcon name="user" :size="32" />
  <SolarIcon name="map-point" style="bold" />
</template>

<script setup lang="ts">
import SolarIcon from '@/components/SolarIcon.vue'
</script>
```

### Opción 2: Usando Icon directamente

```vue
<template>
  <Icon icon="solar:gps-bold-duotone" :width="24" />
  <Icon icon="solar:user-linear" :width="32" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

### Opción 3: Usando el catálogo de iconos

```vue
<template>
  <SolarIcon :name="SOLAR_ICONS.GPS" />
  <SolarIcon :name="GPS_ICONS.TRACKING_ON" />
</template>

<script setup lang="ts">
import SolarIcon from '@/components/SolarIcon.vue'
import { SOLAR_ICONS, GPS_ICONS } from '@/utils/solarIcons'
</script>
```

---

## 🎨 Estilos Disponibles

Solar Icons tiene 4 estilos:

1. **linear** - Líneas simples y delgadas
2. **bold** - Líneas gruesas
3. **bold-duotone** - Líneas gruesas con dos tonos (⭐ Recomendado)
4. **broken** - Líneas discontinuas

```vue
<SolarIcon name="gps" style="linear" />
<SolarIcon name="gps" style="bold" />
<SolarIcon name="gps" style="bold-duotone" />
<SolarIcon name="gps" style="broken" />
```

---

## 📏 Tamaños

```vue
<!-- Tamaño por defecto (24px) -->
<SolarIcon name="gps" />

<!-- Tamaños personalizados -->
<SolarIcon name="gps" :size="16" />
<SolarIcon name="gps" :size="32" />
<SolarIcon name="gps" :size="48" />
```

---

## 🎨 Colores

```vue
<!-- Usando clases de Vuetify -->
<SolarIcon name="gps" class="text-primary" />
<SolarIcon name="gps" class="text-error" />
<SolarIcon name="gps" class="text-success" />

<!-- Usando clases personalizadas -->
<SolarIcon name="gps" class="icon-primary" />
<SolarIcon name="gps" class="icon-secondary" />

<!-- Usando estilos inline -->
<SolarIcon name="gps" style="color: #FF5722" />
```

---

## 💡 Ejemplos Prácticos para GPS Tracking

### 1. Botón con icono

```vue
<v-btn color="primary">
  <SolarIcon name="gps" :size="20" class="mr-2" />
  Iniciar Tracking
</v-btn>
```

### 2. Card con icono

```vue
<v-card>
  <v-card-title class="d-flex align-center">
    <SolarIcon name="map-point" :size="24" class="mr-2" />
    Ubicación Actual
  </v-card-title>
</v-card>
```

### 3. Lista con iconos

```vue
<v-list>
  <v-list-item>
    <template #prepend>
      <SolarIcon name="user" :size="24" />
    </template>
    <v-list-item-title>Juan Pérez</v-list-item-title>
  </v-list-item>
  
  <v-list-item>
    <template #prepend>
      <SolarIcon name="smartphone" :size="24" />
    </template>
    <v-list-item-title>Dispositivo ABC123</v-list-item-title>
  </v-list-item>
</v-list>
```

### 4. Estado del dispositivo

```vue
<template>
  <v-chip :color="statusColor">
    <SolarIcon :name="statusIcon" :size="16" class="mr-1" />
    {{ statusText }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SolarIcon from '@/components/SolarIcon.vue'

const props = defineProps<{ status: 'activo' | 'inactivo' | 'mantenimiento' }>()

const statusIcon = computed(() => {
  switch (props.status) {
    case 'activo': return 'check-circle'
    case 'inactivo': return 'close-circle'
    case 'mantenimiento': return 'settings'
  }
})

const statusColor = computed(() => {
  switch (props.status) {
    case 'activo': return 'success'
    case 'inactivo': return 'error'
    case 'mantenimiento': return 'warning'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'activo': return 'Activo'
    case 'inactivo': return 'Inactivo'
    case 'mantenimiento': return 'Mantenimiento'
  }
})
</script>
```

### 5. Navegación

```vue
<v-navigation-drawer>
  <v-list>
    <v-list-item to="/dashboard">
      <template #prepend>
        <SolarIcon name="home" :size="24" />
      </template>
      <v-list-item-title>Dashboard</v-list-item-title>
    </v-list-item>
    
    <v-list-item to="/map">
      <template #prepend>
        <SolarIcon name="map" :size="24" />
      </template>
      <v-list-item-title>Mapa</v-list-item-title>
    </v-list-item>
    
    <v-list-item to="/devices">
      <template #prepend>
        <SolarIcon name="devices" :size="24" />
      </template>
      <v-list-item-title>Dispositivos</v-list-item-title>
    </v-list-item>
    
    <v-list-item to="/users">
      <template #prepend>
        <SolarIcon name="users-group-rounded" :size="24" />
      </template>
      <v-list-item-title>Usuarios</v-list-item-title>
    </v-list-item>
  </v-list>
</v-navigation-drawer>
```

### 6. Toolbar con acciones

```vue
<v-toolbar>
  <v-toolbar-title>GPS Tracking</v-toolbar-title>
  
  <v-spacer />
  
  <v-btn icon>
    <SolarIcon name="bell" :size="24" />
  </v-btn>
  
  <v-btn icon>
    <SolarIcon name="settings" :size="24" />
  </v-btn>
  
  <v-btn icon>
    <SolarIcon name="logout" :size="24" />
  </v-btn>
</v-toolbar>
```

---

## 🎯 Iconos Recomendados para GPS Tracking

### Navegación y Ubicación
- `gps` - GPS principal
- `map-point` - Marcador de ubicación
- `map` - Mapa
- `compass` - Brújula
- `route` - Ruta
- `map-point-wave` - Ubicación en vivo

### Usuarios
- `user` - Usuario individual
- `users-group-rounded` - Grupo de usuarios
- `user-circle` - Avatar de usuario
- `user-check` - Usuario verificado

### Dispositivos
- `smartphone` - Teléfono móvil
- `devices` - Múltiples dispositivos
- `tablet` - Tablet
- `smartphone-2` - Teléfono alternativo

### Dashboard
- `chart` - Gráfico
- `graph` - Gráfico de líneas
- `calendar` - Calendario
- `clock-circle` - Reloj
- `history` - Historial

### Acciones
- `play` - Iniciar
- `pause` - Pausar
- `stop-circle` - Detener
- `refresh` - Actualizar
- `settings` - Configuración
- `filter` - Filtrar

---

## 🔍 Buscar Más Iconos

Visita: https://solar-icons.vercel.app/icons

Puedes buscar por categorías:
- Arrows
- Astronomy
- Business
- Devices
- Essentional UI
- Files
- Maps & Navigation
- Users
- Y muchas más...

---

## 📝 Notas Importantes

1. **Performance:** Los iconos se cargan bajo demanda, solo se descargan los que usas
2. **Tamaño:** Los SVG son muy ligeros (~1-2KB cada uno)
3. **Compatibilidad:** Funciona en todos los navegadores modernos
4. **Accesibilidad:** Puedes agregar `aria-label` para lectores de pantalla

```vue
<SolarIcon 
  name="gps" 
  aria-label="Icono de GPS"
  role="img"
/>
```

---

## 🎨 Personalización Avanzada

### Animaciones

```vue
<template>
  <SolarIcon 
    name="refresh" 
    class="rotating-icon"
  />
</template>

<style scoped>
.rotating-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

### Hover Effects

```vue
<template>
  <SolarIcon 
    name="gps" 
    class="hover-icon"
  />
</template>

<style scoped>
.hover-icon {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-icon:hover {
  transform: scale(1.2);
  color: rgb(var(--v-theme-primary));
}
</style>
```

---

## ✅ Ventajas de Solar Icons

- ✨ **Diseño moderno y consistente**
- 🎨 **4 estilos diferentes**
- 🚀 **Carga bajo demanda (lazy loading)**
- 📦 **Ligero (SVG optimizados)**
- 🔧 **Fácil de personalizar**
- 🌐 **Más de 1000 iconos disponibles**
- 💯 **Gratis y open source**

---

## 🆚 Comparación con Material Design Icons

| Característica | Solar Icons | Material Design Icons |
|----------------|-------------|----------------------|
| Estilos | 4 (linear, bold, bold-duotone, broken) | 1 |
| Diseño | Moderno, minimalista | Clásico, robusto |
| Cantidad | ~1000 iconos | ~7000 iconos |
| Tamaño | Muy ligero | Medio |
| Carga | Bajo demanda | Todo el set |

**Recomendación:** Usa Solar Icons para la UI principal y Material Design Icons como fallback si necesitas algo específico.

---

¡Listo para usar Solar Icons en tu proyecto GPS Tracking! 🎉
