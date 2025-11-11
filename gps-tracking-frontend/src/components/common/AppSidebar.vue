<template>
  <v-navigation-drawer permanent width="260">
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :active="isActive(item.to)"
        color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const menuItems = computed(() => {
  if (authStore.isAdmin) {
    return [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin/dashboard' },
      { title: 'Usuarios', icon: 'mdi-account-multiple', to: '/admin/users' },
      { title: 'Dispositivos', icon: 'mdi-cellphone-link', to: '/admin/devices' },
      { title: 'Historial', icon: 'mdi-history', to: '/admin/history' }
    ]
  }
  return []
})

const isActive = (path: string) => {
  return route.path === path
}
</script>
