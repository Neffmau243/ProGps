<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-icon size="120" color="error">mdi-map-marker-question</v-icon>
            <h1 class="text-h2 mt-4">404</h1>
            <p class="text-h5 mt-2">Página no encontrada</p>
            <p class="text-body-1 mt-4">La página que buscas no existe o fue movida.</p>
            <v-btn
              color="primary"
              size="large"
              class="mt-6"
              @click="goHome"
            >
              <v-icon start>mdi-home</v-icon>
              Volver al Inicio
            </v-btn>
            <div class="mt-4">
              <ThemeToggle />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

const goHome = () => {
  if (authStore.isAuthenticated) {
    router.push(authStore.isAdmin ? '/admin/dashboard' : '/empleado/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
