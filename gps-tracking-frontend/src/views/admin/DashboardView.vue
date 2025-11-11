<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main>
      <v-container fluid class="pa-4" style="height: calc(100vh - 64px);">
        <v-row style="height: 100%;">
          <!-- Mapa -->
          <v-col cols="12" md="8" style="height: 100%;">
            <v-card style="height: 100%;">
              <v-card-title>
                <v-icon class="mr-2">mdi-map</v-icon>
                Ubicaciones en Tiempo Real
                <v-spacer />
                <v-chip :color="isLoading ? 'warning' : 'success'" size="small">
                  <v-icon start>{{ isLoading ? 'mdi-loading mdi-spin' : 'mdi-check-circle' }}</v-icon>
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
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-cellphone-link</v-icon>
                Dispositivos Activos
                <v-spacer />
                <v-chip color="primary">{{ locations.length }}</v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-list v-if="locations.length > 0">
                  <v-list-item
                    v-for="location in locations"
                    :key="location.device_id"
                    class="mb-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary">
                        <v-icon>mdi-map-marker</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title>{{ location.device_name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ location.user_name }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-chip size="small" :color="getTimeColor(location.minutes_ago)">
                        {{ location.minutes_ago }}m
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>

                <v-alert v-else type="info" variant="tonal">
                  No hay dispositivos activos en este momento
                </v-alert>
              </v-card-text>
            </v-card>

            <!-- Estadísticas -->
            <v-card class="mt-4">
              <v-card-title>
                <v-icon class="mr-2">mdi-chart-box</v-icon>
                Estadísticas
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-card variant="tonal" color="primary">
                      <v-card-text class="text-center">
                        <div class="text-h4">{{ locations.length }}</div>
                        <div class="text-caption">Dispositivos</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card variant="tonal" color="success">
                      <v-card-text class="text-center">
                        <div class="text-h4">{{ activeDevices }}</div>
                        <div class="text-caption">Activos</div>
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
