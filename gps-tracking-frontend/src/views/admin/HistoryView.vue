<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main class="history-main">
      <v-container fluid class="pa-4">

        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-history</v-icon>
            Historial de Ubicaciones
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedDevice"
                  :items="devices"
                  item-title="name"
                  item-value="id"
                  label="Dispositivo"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="startDate"
                  label="Fecha Inicio"
                  type="datetime-local"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="endDate"
                  label="Fecha Fin"
                  type="datetime-local"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  color="primary"
                  size="large"
                  block
                  @click="loadHistory"
                  :loading="loading"
                >
                  Buscar
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-alert v-if="!historyData && !loading" type="info" variant="tonal" class="text-center">
              <template v-slot:prepend>
                <v-icon size="large">mdi-map-search</v-icon>
              </template>
              <div class="text-h6 mb-2">Selecciona un dispositivo y rango de fechas</div>
              <div class="text-caption">Podrás ver la ruta completa en el mapa y las estadísticas del recorrido</div>
              <div class="text-caption mt-2 text-grey">
                💡 Tip: Primero asegúrate de que el empleado haya enviado ubicaciones desde su dashboard
              </div>
            </v-alert>

            <v-alert v-if="loading" type="info" variant="tonal" class="text-center">
              <v-progress-circular indeterminate color="primary" class="mr-3"></v-progress-circular>
              Cargando historial...
            </v-alert>

            <div v-if="historyData && historyData.locations && historyData.locations.length > 0">
              <!-- Información del dispositivo -->
              <v-card class="mb-4" elevation="4">
                <v-card-title class="bg-gradient-primary text-white">
                  <v-icon class="mr-2" color="white">mdi-cellphone-link</v-icon>
                  <span class="font-weight-bold">{{ historyData.device.name }}</span>
                </v-card-title>
                <v-card-subtitle class="pa-4">
                  <v-icon size="small" class="mr-1">mdi-account</v-icon>
                  Usuario: {{ historyData.device.user_name }}
                </v-card-subtitle>
              </v-card>

              <!-- Estadísticas -->
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-card class="stat-card" elevation="4">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="48" color="primary" class="mb-2">mdi-map-marker-multiple</v-icon>
                      <div class="text-h4 font-weight-bold">{{ historyData.statistics.total_points }}</div>
                      <div class="text-caption text-grey">Puntos Registrados</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card class="stat-card" elevation="4">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="48" color="success" class="mb-2">mdi-map-marker-distance</v-icon>
                      <div class="text-h4 font-weight-bold">{{ historyData.statistics.distance_km }} km</div>
                      <div class="text-caption text-grey">Distancia Recorrida</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card class="stat-card" elevation="4">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="48" color="info" class="mb-2">mdi-clock-outline</v-icon>
                      <div class="text-h4 font-weight-bold">{{ historyData.statistics.duration_minutes }} min</div>
                      <div class="text-caption text-grey">Duración Total</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Mapa de Ruta -->
              <v-card class="mb-4" elevation="8">
                <v-card-title class="bg-gradient-info text-white">
                  <v-icon class="mr-2" color="white">mdi-map-marker-path</v-icon>
                  <span class="font-weight-bold">Ruta Recorrida</span>
                  <v-spacer />
                  
                  <v-chip color="white" variant="flat" size="small">
                    <v-icon start size="small" color="success">mdi-circle</v-icon>
                    <span class="text-success mr-2">Inicio</span>
                    <v-icon start size="small" color="error">mdi-circle</v-icon>
                    <span class="text-error">Fin</span>
                  </v-chip>
                </v-card-title>
                <v-card-text style="height: 400px; padding: 0; position: relative;">
                  <RouteMap ref="routeMapRef" :locations="historyData.locations" />
                  
                  <!-- Controles flotantes adicionales -->
                  <div class="map-controls">
                    <v-tooltip text="Acercar" location="left">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          size="small"
                          color="primary"
                          elevation="4"
                          @click="zoomIn"
                          class="mb-2"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    
                    <v-tooltip text="Alejar" location="left">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          size="small"
                          color="primary"
                          elevation="4"
                          @click="zoomOut"
                          class="mb-2"
                        >
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    
                    <v-tooltip text="Ajustar vista completa" location="left">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          size="small"
                          color="success"
                          elevation="4"
                          @click="resetView"
                        >
                          <v-icon>mdi-fit-to-screen</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Lista de ubicaciones -->
              <v-card elevation="4">
                <v-card-title class="bg-gradient-secondary text-white">
                  <v-icon class="mr-2" color="white">mdi-format-list-bulleted</v-icon>
                  <span class="font-weight-bold">Detalle de Ubicaciones</span>
                  <v-spacer />
                  <v-chip color="white" variant="flat" size="small">
                    <span class="text-primary font-weight-bold">{{ historyData.locations.length }}</span>
                  </v-chip>
                </v-card-title>
                <v-card-text class="pa-0" style="max-height: 300px; overflow-y: auto;">
                  <v-list>
                    <v-list-item
                      v-for="(location, index) in historyData.locations"
                      :key="index"
                      class="location-item"
                      :class="{ 'border-bottom': index < historyData.locations.length - 1 }"
                    >
                      <template v-slot:prepend>
                        <v-avatar 
                          :color="index === 0 ? 'success' : index === historyData.locations.length - 1 ? 'error' : 'primary'" 
                          size="40"
                        >
                          <span class="font-weight-bold">{{ index + 1 }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title class="font-weight-medium">
                        <v-icon size="small" class="mr-1">mdi-latitude</v-icon>
                        {{ location.latitude }}
                        <v-icon size="small" class="mx-2">mdi-longitude</v-icon>
                        {{ location.longitude }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="mt-1">
                        <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                        {{ formatDate(location.timestamp) }}
                        <v-chip size="x-small" color="success" class="ml-2">
                          <v-icon start size="x-small">mdi-target</v-icon>
                          {{ location.accuracy }}m
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>

            <!-- Mensaje si no hay ubicaciones -->
            <v-alert v-if="historyData && (!historyData.locations || historyData.locations.length === 0)" 
                     type="warning" 
                     variant="tonal" 
                     class="text-center">
              <template v-slot:prepend>
                <v-icon size="large">mdi-map-marker-off</v-icon>
              </template>
              <div class="text-h6 mb-2">No se encontraron ubicaciones</div>
              <div class="text-caption">
                No hay registros GPS para este dispositivo en el rango de fechas seleccionado.
              </div>
              <div class="text-caption mt-2">
                💡 Asegúrate de que:
                <ul class="text-left mt-2" style="display: inline-block;">
                  <li>El empleado haya activado el rastreo GPS</li>
                  <li>Las fechas seleccionadas sean correctas</li>
                  <li>El dispositivo esté asignado al usuario correcto</li>
                </ul>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import RouteMap from '@/components/maps/RouteMap.vue'

const toast = useToast()
const devices = ref<any[]>([])
const selectedDevice = ref<number | null>(null)
const startDate = ref('')
const endDate = ref('')
const historyData = ref<any>(null)
const loading = ref(false)
const routeMapRef = ref<any>(null)

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss')
}

const loadDevices = async () => {
  try {
    const response = await api.get('/devices')
    devices.value = response.data
  } catch (error) {
    toast.error('Error al cargar dispositivos')
  }
}

const loadHistory = async () => {
  if (!selectedDevice.value || !startDate.value || !endDate.value) {
    toast.warning('Por favor completa todos los campos')
    return
  }

  loading.value = true
  historyData.value = null // Limpiar datos anteriores
  
  try {
    const response = await api.get('/locations/history', {
      params: {
        device_id: selectedDevice.value,
        start_date: startDate.value.replace('T', ' '),
        end_date: endDate.value.replace('T', ' ')
      }
    })
    
    historyData.value = response.data
    
    if (response.data.locations && response.data.locations.length > 0) {
      toast.success(`✅ ${response.data.locations.length} ubicaciones encontradas`)
    } else {
      toast.info('No se encontraron ubicaciones en este rango')
    }
  } catch (error: any) {
    console.error('Error al cargar historial:', error)
    toast.error(error.response?.data?.message || 'Error al cargar historial')
    historyData.value = null
  } finally {
    loading.value = false
  }
}

// Métodos de control del mapa
const zoomIn = () => {
  if (routeMapRef.value) {
    routeMapRef.value.zoomIn()
  }
}

const zoomOut = () => {
  if (routeMapRef.value) {
    routeMapRef.value.zoomOut()
  }
}

const resetView = () => {
  if (routeMapRef.value) {
    routeMapRef.value.resetView()
  }
}

onMounted(() => {
  loadDevices()
  
  // Establecer fechas por defecto (hoy)
  const now = dayjs()
  startDate.value = now.startOf('day').format('YYYY-MM-DDTHH:mm')
  endDate.value = now.endOf('day').format('YYYY-MM-DDTHH:mm')
})
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.location-item {
  transition: all 0.2s ease;
  padding: 16px !important;
}

.location-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.v-theme--dark .location-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.v-theme--dark .border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Controles flotantes del mapa */
.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.map-controls .v-btn {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s ease;
}

.map-controls .v-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.v-theme--dark .map-controls .v-btn {
  background: rgba(30, 30, 30, 0.95) !important;
}

/* Animación para los botones de zoom */
@keyframes pulse-zoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.map-controls .v-btn:active {
  animation: pulse-zoom 0.3s ease;
}

/* Asegurar scroll en la vista principal */
.history-main {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  height: 100vh !important;
}

.history-main .v-container {
  max-width: 100% !important;
  padding-bottom: 80px !important;
}
</style>
