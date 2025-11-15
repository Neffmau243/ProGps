<template>
  <v-navigation-drawer permanent width="280" class="app-sidebar">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <SolarIcon name="chart-square" :size="32" class="text-primary" />
      <div class="header-text">
        <div class="header-title">Panel de Control</div>
        <div class="header-subtitle">{{ authStore.user?.role === 'admin' ? 'Administrador' : 'Usuario' }}</div>
      </div>
    </div>

    <v-divider class="my-4" />

    <!-- Navigation Menu -->
    <v-list class="nav-list">
      <v-list-item
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="['nav-item', { 'nav-item-active': isActive(item.to) }]"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-avatar :color="isActive(item.to) ? 'primary' : 'grey-lighten-2'" size="40" class="nav-icon">
            <SolarIcon 
              :name="item.icon" 
              :size="20" 
              :class="isActive(item.to) ? 'text-white' : 'text-grey-darken-1'"
            />
          </v-avatar>
        </template>

        <v-list-item-title class="nav-title">{{ item.title }}</v-list-item-title>

        <template v-slot:append v-if="isActive(item.to)">
          <SolarIcon name="arrow-right" :size="20" class="text-primary" />
        </template>
      </v-list-item>
    </v-list>

    <!-- Sidebar Footer -->
    <template v-slot:append>
      <div class="sidebar-footer">
        <v-card variant="tonal" color="primary" class="info-card">
          <v-card-text class="pa-3">
            <div class="d-flex align-center">
              <SolarIcon name="info-circle" :size="24" class="text-primary mr-2" />
              <div>
                <div class="text-caption font-weight-bold">Versión Alfa</div>
                <div class="text-caption">v1.0.0</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SolarIcon from '@/components/SolarIcon.vue'
import { SOLAR_ICONS } from '@/utils/solarIcons'

const route = useRoute()
const authStore = useAuthStore()

const menuItems = computed(() => {
  if (authStore.isAdmin) {
    return [
      { title: 'Dashboard', icon: SOLAR_ICONS.HOME, to: '/admin/dashboard' },
      { title: 'Usuarios', icon: SOLAR_ICONS.USERS, to: '/admin/users' },
      { title: 'Dispositivos', icon: SOLAR_ICONS.DEVICES, to: '/admin/devices' },
      { title: 'Historial', icon: SOLAR_ICONS.HISTORY, to: '/admin/history' }
    ]
  }
  return []
})

const isActive = (path: string) => {
  return route.path === path
}
</script>


<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.v-theme--dark .app-sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 24px 20px 16px;
  gap: 12px;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-list {
  padding: 0 12px;
}

.nav-item {
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.03);
  transform: translateX(4px);
}

.v-theme--dark .nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-item-active {
  background: rgba(25, 118, 210, 0.08);
  border-color: rgba(25, 118, 210, 0.2);
}

.v-theme--dark .nav-item-active {
  background: rgba(33, 150, 243, 0.12);
  border-color: rgba(33, 150, 243, 0.3);
}

.nav-icon {
  transition: all 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-title {
  font-weight: 600;
  font-size: 0.9375rem;
}

.sidebar-footer {
  padding: 16px;
}

.info-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
