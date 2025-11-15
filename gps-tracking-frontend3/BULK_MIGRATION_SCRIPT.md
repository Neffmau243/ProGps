# 🔄 Script de Migración Masiva

## Emojis Encontrados en el Proyecto

### ProfileView.vue
- 👤 → `mdi:account`
- ℹ️ → `mdi:information`
- ✏️ → `mdi:pencil`
- ⚠️ → `mdi:alert`
- 🔒 → `mdi:lock`
- 📊 → `mdi:chart-box`
- 👥 → `mdi:account-group`
- 📱 → `mdi:cellphone`
- ✅ → `mdi:check-circle`

### DashboardEmployee.vue
- 📍 → `mdi:map-marker`
- 📱 → `mdi:cellphone`
- 🗺️ → `mdi:map`
- ⏱️ → `mdi:timer`

### UsersManagement.vue
- ➕ → `mdi:plus`
- 🔍 → `mdi:magnify`
- 👑 → `mdi:crown`
- 👤 → `mdi:account`
- ✏️ → `mdi:pencil`
- 🗑️ → `mdi:delete`
- 👥 → `mdi:account-group`
- ⚠️ → `mdi:alert`

### DevicesManagement.vue
- 📱 → `mdi:cellphone`
- 🔍 → `mdi:magnify`
- ➕ → `mdi:plus`
- ✏️ → `mdi:pencil`
- 🗑️ → `mdi:delete`
- 🔄 → `mdi:refresh`
- ⚠️ → `mdi:alert`

### RouteHistory.vue
- 📍 → `mdi:map-marker`
- 🔍 → `mdi:magnify`
- 🗺️ → `mdi:map`
- 📱 → `mdi:cellphone`
- 👤 → `mdi:account`
- 🛣️ → `mdi:road`
- ⏱️ → `mdi:timer`
- 🕐 → `mdi:clock-outline`
- 🎯 → `mdi:target`
- 📋 → `mdi:clipboard-text`
- 💡 → `mdi:lightbulb`
- ⚠️ → `mdi:alert`

### DashboardAdmin.vue
- 👥 → `mdi:account-group`
- 📱 → `mdi:cellphone`
- 📍 → `mdi:map-marker`
- ✅ → `mdi:check-circle`
- 🗺️ → `mdi:map`
- 🔌 → `mdi:power-plug`
- ⏳ → `mdi:timer-sand`
- 📊 → `mdi:chart-box`
- 🕐 → `mdi:clock-outline`
- 👤 → `mdi:account`
- ⚡ → `mdi:lightning-bolt`
- ℹ️ → `mdi:information`

### LoginView.vue
- ⚠️ → `mdi:alert`

## Total de Emojis Únicos: 29
## Total de Instancias: ~150+

## Archivos a Migrar (Prioridad)

1. ✅ NavBar.vue - COMPLETADO
2. ✅ SideBar.vue - COMPLETADO
3. ⏳ DashboardAdmin.vue - EN PROGRESO
4. ⏳ UsersManagement.vue - PENDIENTE
5. ⏳ DevicesManagement.vue - PENDIENTE
6. ⏳ RouteHistory.vue - PENDIENTE
7. ⏳ DashboardEmployee.vue - PENDIENTE
8. ⏳ ProfileView.vue - PENDIENTE
9. ⏳ LoginView.vue - PENDIENTE

## Patrón de Reemplazo

```vue
<!-- ANTES -->
<span class="icon">📱</span>

<!-- DESPUÉS -->
<Icon name="mdi:cellphone" :size="24" />
```

## Importación Necesaria

```vue
<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
// ... resto del código
</script>
```
