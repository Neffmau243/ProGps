<template>
  <v-app-bar elevation="4" class="app-header">
    <template v-slot:prepend>
      <div class="logo-container">
        <SolarIcon name="gps" :size="32" class="logo-icon" style="linear" />
      </div>
    </template>

    <v-app-bar-title class="app-title">
      <span class="title-text">GPS Tracking</span>
      <span class="title-subtitle">Sistema de Rastreo</span>
    </v-app-bar-title>

    <v-spacer />

    <!-- User Info -->
    <div class="user-info mr-4">
      <v-avatar size="36" color="white" class="mr-2">
        <span class="text-primary font-weight-bold">{{ getUserInitials }}</span>
      </v-avatar>
      <div class="user-details d-none d-sm-block">
        <div class="user-name">{{ authStore.user?.name }}</div>
        <div class="user-role">{{ authStore.user?.role }}</div>
      </div>
    </div>

    <ThemeToggle />

    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="menu-btn">
          <SolarIcon name="menu-dots" :size="24" />
        </v-btn>
      </template>
      <v-list class="user-menu">
        <v-list-item @click="goToProfile" class="menu-item">
          <template v-slot:prepend>
            <v-avatar size="32" color="primary" class="mr-2">
              <SolarIcon name="user" :size="18" style="linear" />
            </v-avatar>
          </template>
          <v-list-item-title>Mi Perfil</v-list-item-title>
          <v-list-item-subtitle>Ver y editar información</v-list-item-subtitle>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item @click="handleLogout" class="menu-item logout-item">
          <template v-slot:prepend>
            <v-avatar size="32" color="error" class="mr-2">
              <SolarIcon name="logout" :size="18" style="linear" />
            </v-avatar>
          </template>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
          <v-list-item-subtitle>Salir del sistema</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ThemeToggle from './ThemeToggle.vue'
import SolarIcon from '@/components/SolarIcon.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const getUserInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const goToProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await authStore.logout()
  toast.success('Sesión cerrada exitosamente')
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  backdrop-filter: blur(10px);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  margin-left: 8px;
}

.logo-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.app-title {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.title-text {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: white;
}

.title-subtitle {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.9;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  opacity: 0.9;
  color: white;
  text-transform: capitalize;
}

.menu-btn {
  margin-left: 8px;
}

.user-menu {
  min-width: 280px;
  border-radius: 12px;
  padding: 8px;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.logout-item:hover {
  background: rgba(255, 82, 82, 0.1);
}
</style>
