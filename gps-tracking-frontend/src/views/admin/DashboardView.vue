<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main>
      <v-container fluid class="pa-4" style="height: calc(100vh - 64px);">
        <v-row style="height: 100%;">
          <!-- Mapa -->
          <v-col cols="12" md="8" style="height: 100%;">
            <v-card style="height: 100%;" elevation="8" class="map-card">
              <v-card-title class="bg-gradient-primary text-white">
                <v-icon class="mr-2" color="white">mdi-map-marker-multiple</v-icon>
                <span class="font-weight-bold">Ubicaciones en Tiempo Real</span>
                <v-spacer />
                <v-chip 
                  :color="isLoading ? 'warning' : 'success'" 
                  size="small"
                  variant="flat"
                  class="pulse-chip"
                >
                  <v-icon start size="small">{{ isLoading ? 'mdi-loading mdi-spin' : 'mdi-check-circle' }}</v-icon>
                  {{ isLoading ? 'Actualizando...' : 'Actualizado' }}
                </v-chip>
              </v-card-title>
              <v-card-text style="height: calc(100% - 64px); padding: 0;">
                <MapView :locations="locations" />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Panel lateral -->
          <v-col cols="12" md="4" style="height: 100%; overflow-y: auto;">
            <!-- Dispositivos Activos -->
            <v-card elevation="8" class="devices-card">
              <v-card-title class="bg-gradient-secondary text-white">
                <v-icon class="mr-2" color="white">mdi-cellphone-link</v-icon>
                <span class="font-weight-bold">Dispositivos Activos</span>
                <v-spacer />
                <v-chip color="white" variant="flat" size="small">
                  <span class="text-primary font-weight-bold">{{ locations.length }}</span>
                </v-chip>
              </v-card-title>
              
              <v-card-text class="pa-0">
                <v-list v-if="locations.length > 0" class="py-0">
                  <v-list-item
                    v-for="(location, index) in locations"
                    :key="location.device_id"
                    class="device-item"
                    :class="{ 'border-bottom': index < locations.length - 1 }"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getTimeColor(location.minutes_ago)" size="48" class="pulse-avatar">
                        <v-icon color="white" size="24">mdi-map-marker</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold">
                      {{ location.device_name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="d-flex align-center mt-1">
                      <v-icon size="small" class="mr-1">mdi-account</v-icon>
                      {{ location.user_name }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="text-center">
                        <v-chip 
                          size="small" 
                          :color="getTimeColor(location.minutes_ago)"
                          variant="flat"
                        >
                          <v-icon start size="small">mdi-clock-outline</v-icon>
                          {{ location.minutes_ago }}m
                        </v-chip>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>

                <v-alert v-else type="info" variant="tonal" class="ma-4">
                  <template v-slot:prepend>
                    <v-icon>mdi-information</v-icon>
                  </template>
                  No hay dispositivos activos en este momento
                </v-alert>
              </v-card-text>
            </v-card>

            <!-- Estadísticas -->
            <v-card class="mt-4" elevation="8">
              <v-card-title class="bg-gradient-info text-white">
                <v-icon class="mr-2" color="white">mdi-chart-line</v-icon>
                <span class="font-weight-bold">Estadísticas</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="6">
                    <v-card variant="tonal" color="primary" class="stat-card" elevation="0">
                      <v-card-text class="text-center pa-4">
                        <v-icon size="32" color="primary" class="mb-2">mdi-cellphone</v-icon>
                        <div class="text-h4 font-weight-bold">{{ locations.length }}</div>
                        <div class="text-caption text-grey">Total Dispositivos</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card variant="tonal" color="success" class="stat-card" elevation="0">
                      <v-card-text class="text-center pa-4">
                        <v-icon size="32" color="success" class="mb-2">mdi-check-circle</v-icon>
                        <div class="text-h4 font-weight-bold">{{ activeDevices }}</div>
                        <div class="text-caption text-grey">Activos Ahora</div>
                      </v-card-text>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import MapView from '@/components/maps/MapView.vue'

const toast = useToast()
const locations = ref<any[]>([])
const isLoading = ref(false)
let updateInterval: number | null = null

const activeDevices = computed(() => {
  return locations.value.filter(loc => loc.minutes_ago < 5).length
})

const loadLocations = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/locations/current')
    locations.value = response.data
  } catch (error: any) {
    console.error('Error al cargar ubicaciones:', error)
    if (error.response?.status !== 401) {
      toast.error('Error al cargar ubicaciones')
    }
  } finally {
    isLoading.value = false
  }
}

const getTimeColor = (minutes: number) => {
  if (minutes < 2) return 'success'
  if (minutes < 5) return 'warning'
  return 'error'
}

onMounted(() => {
  loadLocations()
  updateInterval = window.setInterval(() => {
    loadLocations()
  }, 10000) // Actualizar cada 10 segundos
})

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
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

.map-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  overflow: hidden;
}

.devices-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.device-item {
  transition: all 0.2s ease;
  padding: 16px !important;
}

.device-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.v-theme--dark .device-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.v-theme--dark .border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.pulse-chip {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}

.pulse-avatar {
  animation: pulse-scale 2s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.stat-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}
</style>
