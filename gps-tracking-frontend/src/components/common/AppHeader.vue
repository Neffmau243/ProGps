<template>
  <v-app-bar color="primary" dark elevation="2">
    <v-app-bar-title>
      <v-icon class="mr-2">mdi-map-marker-radius</v-icon>
      GPS Tracking
    </v-app-bar-title>

    <v-spacer />

    <span class="mr-4">{{ authStore.user?.name }}</span>

    <ThemeToggle />

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="goToProfile">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleLogout">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ThemeToggle from './ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const goToProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await authStore.logout()
  toast.success('Sesión cerrada exitosamente')
  router.push('/login')
}
</script>
