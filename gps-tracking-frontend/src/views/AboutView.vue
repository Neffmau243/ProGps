<template>
  <v-app>
    <AppHeader />
    
    <v-main>
      <v-container class="py-8">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <!-- Hero Section -->
            <v-card elevation="8" class="mb-6" rounded="xl">
              <v-card-text class="pa-8 text-center">
                <v-icon size="80" color="primary" class="mb-4">mdi-map-marker-radius</v-icon>
                <h1 class="text-h3 font-weight-bold mb-4">ProGPS</h1>
                <p class="text-h6 text-grey">Sistema de Rastreo GPS en Tiempo Real</p>
                <v-chip color="primary" class="mt-4">Versión 1.0.0</v-chip>
              </v-card-text>
            </v-card>

            <!-- Descripción -->
            <v-card elevation="8" class="mb-6" rounded="xl">
              <v-card-title class="bg-gradient-primary text-white pa-6">
                <v-icon class="mr-2" color="white">mdi-information</v-icon>
                <span class="text-h5 font-weight-bold">¿Qué es ProGPS?</span>
              </v-card-title>
              <v-card-text class="pa-6">
                <p class="text-body-1 mb-4">
                  ProGPS es un sistema avanzado de rastreo GPS en tiempo real diseñado para empresas que necesitan 
                  monitorear y gestionar la ubicación de sus empleados o activos de manera eficiente y segura.
                </p>
                <p class="text-body-1">
                  Con una interfaz intuitiva y potentes capacidades de seguimiento, ProGPS permite a los administradores 
                  visualizar ubicaciones en tiempo real, acceder a historiales de rutas y gestionar dispositivos 
                  desde una plataforma centralizada.
                </p>
              </v-card-text>
            </v-card>

            <!-- Características -->
            <v-card elevation="8" class="mb-6" rounded="xl">
              <v-card-title class="bg-gradient-secondary text-white pa-6">
                <v-icon class="mr-2" color="white">mdi-star</v-icon>
                <span class="text-h5 font-weight-bold">Características Principales</span>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col v-for="feature in features" :key="feature.title" cols="12" md="6">
                    <v-card variant="tonal" color="primary" class="h-100">
                      <v-card-text class="pa-4">
                        <div class="d-flex align-start">
                          <v-icon size="40" color="primary" class="mr-4">{{ feature.icon }}</v-icon>
                          <div>
                            <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
                            <p class="text-body-2">{{ feature.description }}</p>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Tecnologías -->
            <v-card elevation="8" rounded="xl">
              <v-card-title class="bg-gradient-info text-white pa-6">
                <v-icon class="mr-2" color="white">mdi-cog</v-icon>
                <span class="text-h5 font-weight-bold">Tecnologías</span>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col v-for="tech in technologies" :key="tech.name" cols="6" md="4" lg="2">
                    <v-card variant="outlined" class="text-center pa-4">
                      <v-icon size="48" :color="tech.color" class="mb-2">{{ tech.icon }}</v-icon>
                      <div class="text-subtitle-2 font-weight-bold">{{ tech.name }}</div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'

const features = [
  {
    icon: 'mdi-map-marker-radius',
    title: 'Rastreo en Tiempo Real',
    description: 'Visualiza la ubicación de todos tus dispositivos en tiempo real sobre un mapa interactivo.'
  },
  {
    icon: 'mdi-history',
    title: 'Historial de Rutas',
    description: 'Consulta el historial completo de movimientos con filtros de fecha y dispositivo.'
  },
  {
    icon: 'mdi-cellphone-link',
    title: 'Gestión de Dispositivos',
    description: 'Administra fácilmente todos los dispositivos GPS asignados a tu organización.'
  },
  {
    icon: 'mdi-account-multiple',
    title: 'Gestión de Usuarios',
    description: 'Control completo sobre usuarios con diferentes roles y permisos.'
  },
  {
    icon: 'mdi-shield-check',
    title: 'Seguridad',
    description: 'Autenticación segura y protección de datos con los más altos estándares.'
  },
  {
    icon: 'mdi-responsive',
    title: 'Responsive',
    description: 'Interfaz adaptable que funciona perfectamente en cualquier dispositivo.'
  }
]

const technologies = [
  { name: 'Vue 3', icon: 'mdi-vuejs', color: 'green' },
  { name: 'TypeScript', icon: 'mdi-language-typescript', color: 'blue' },
  { name: 'Vuetify', icon: 'mdi-material-design', color: 'indigo' },
  { name: 'Laravel', icon: 'mdi-laravel', color: 'red' },
  { name: 'MySQL', icon: 'mdi-database', color: 'orange' },
  { name: 'Leaflet', icon: 'mdi-map', color: 'green' }
]
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.h-100 {
  height: 100%;
}
</style>

