<template>
  <v-app>
    <AppHeader />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <!-- Card Principal de Rastreo -->
            <v-card class="mb-4 tracking-card" elevation="12">
              <div class="tracking-header" :class="isTracking ? 'tracking-active' : 'tracking-inactive'">
                <div class="tracking-icon-container">
                  <v-icon size="80" color="white" class="tracking-icon">
                    {{ isTracking ? 'mdi-map-marker-check' : 'mdi-map-marker-off' }}
                  </v-icon>
                </div>
                <h2 class="text-h4 font-weight-bold text-white mt-4">Rastreo GPS</h2>
                <p class="text-subtitle-1 text-white-80 mt-2">
                  {{ isTracking ? 'Sistema activo y enviando ubicación' : 'Sistema detenido' }}
                </p>
              </div>

              <v-card-text class="pa-8">
                <div class="text-center mb-6">
                  <v-chip 
                    :color="isTracking ? 'success' : 'error'" 
                    size="x-large"
                    class="status-chip px-8 py-6"
                    variant="flat"
                  >
                    <v-icon start size="large">{{ isTracking ? 'mdi-check-circle' : 'mdi-pause-circle' }}</v-icon>
                    <span class="text-h6 font-weight-bold">
                      {{ isTracking ? 'RASTREANDO' : 'DETENIDO' }}
                    </span>
                  </v-chip>
                </div>

                <v-btn
                  :color="isTracking ? 'error' : 'success'"
                  size="x-large"
                  block
                  @click="toggleTracking"
                  class="my-4 tracking-button"
                  elevation="8"
                  rounded="xl"
                >
                  <v-icon start size="large">{{ isTracking ? 'mdi-stop' : 'mdi-play' }}</v-icon>
                  <span class="text-h6 font-weight-bold">
                    {{ isTracking ? 'Detener Rastreo' : 'Iniciar Rastreo' }}
                  </span>
                </v-btn>

                <v-alert v-if="!gpsService.isSupported()" type="error" variant="tonal" class="mt-4">
                  <template v-slot:prepend>
                    <v-icon>mdi-alert-circle</v-icon>
                  </template>
                  Tu navegador no soporta geolocalización
                </v-alert>
              </v-card-text>
            </v-card>

            <!-- Selector de Dispositivo (si tiene múltiples) -->
            <v-card v-if="devices.length > 1" class="mb-4 device-selector-card" elevation="8">
              <v-card-title class="bg-gradient-selector text-white">
                <v-icon class="mr-2" color="white">mdi-devices</v-icon>
                <span class="font-weight-bold">Seleccionar Dispositivo</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-select
                  v-model="selectedDeviceId"
                  :items="devices"
                  item-title="name"
                  item-value="id"
                  label="Dispositivo a rastrear"
                  variant="outlined"
                  prepend-inner-icon="mdi-cellphone-link"
                  color="primary"
                  density="comfortable"
                  @update:model-value="onDeviceChange"
                  :disabled="isTracking"
                  hint="Cambia el dispositivo solo cuando el rastreo esté detenido"
                  persistent-hint
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar :color="getStatusColor(item.raw.status)">
                          <v-icon color="white">mdi-cellphone</v-icon>
                        </v-avatar>
                      </template>
                      <template v-slot:append>
                        <v-chip :color="getStatusColor(item.raw.status)" size="small" variant="flat">
                          {{ item.raw.status }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-card-text>
            </v-card>

            <!-- Información del Dispositivo -->
            <v-row v-if="device">
              <v-col cols="12" md="6">
                <v-card class="info-card" elevation="8">
                  <v-card-title class="bg-gradient-device text-white">
                    <v-icon class="mr-2" color="white">mdi-cellphone-link</v-icon>
                    <span class="font-weight-bold">Dispositivo Activo</span>
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-list class="transparent">
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar color="primary" size="40">
                            <v-icon color="white">mdi-label</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Nombre</v-list-item-title>
                        <v-list-item-subtitle class="text-h6">{{ device.name }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-divider class="my-2" />
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar color="secondary" size="40">
                            <v-icon color="white">mdi-barcode</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Serial</v-list-item-title>
                        <v-list-item-subtitle class="text-h6">{{ device.serial }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-divider class="my-2" />
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar :color="getStatusColor(device.status)" size="40">
                            <v-icon color="white">mdi-information</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Estado</v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip :color="getStatusColor(device.status)" size="large" variant="flat">
                            <v-icon start>mdi-circle</v-icon>
                            {{ device.status.toUpperCase() }}
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Última Ubicación -->
              <v-col cols="12" md="6">
                <v-card v-if="lastLocation" class="info-card" elevation="8">
                  <v-card-title class="bg-gradient-location text-white">
                    <v-icon class="mr-2" color="white">mdi-map-marker-check</v-icon>
                    <span class="font-weight-bold">Última Ubicación</span>
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-list class="transparent">
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar color="info" size="40">
                            <v-icon color="white">mdi-latitude</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Latitud</v-list-item-title>
                        <v-list-item-subtitle class="text-h6">{{ lastLocation.latitude.toFixed(6) }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-divider class="my-2" />
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar color="info" size="40">
                            <v-icon color="white">mdi-longitude</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Longitud</v-list-item-title>
                        <v-list-item-subtitle class="text-h6">{{ lastLocation.longitude.toFixed(6) }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-divider class="my-2" />
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar color="success" size="40">
                            <v-icon color="white">mdi-target</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Precisión</v-list-item-title>
                        <v-list-item-subtitle class="text-h6">{{ lastLocation.accuracy.toFixed(1) }}m</v-list-item-subtitle>
                      </v-list-item>
                      <v-divider class="my-2" />
                      <v-list-item class="px-0">
                        <template v-slot:prepend>
                          <v-avatar color="warning" size="40">
                            <v-icon color="white">mdi-clock-outline</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold">Hora</v-list-item-title>
                        <v-list-item-subtitle class="text-body-1">{{ formatTime(lastLocation.timestamp) }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>

                <v-card v-else class="info-card" elevation="8">
                  <v-card-text class="pa-8 text-center">
                    <v-icon size="64" color="grey">mdi-map-marker-off</v-icon>
                    <p class="text-h6 mt-4 text-grey">No hay ubicaciones enviadas aún</p>
                    <p class="text-caption text-grey">Inicia el rastreo para ver tu ubicación</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Configuración -->
            <v-card class="mt-4 config-card" elevation="8">
              <v-card-title class="bg-gradient-config text-white">
                <v-icon class="mr-2" color="white">mdi-cog</v-icon>
                <span class="font-weight-bold">Configuración de Rastreo</span>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-select
                  v-model="interval"
                  :items="intervalOptions"
                  label="Intervalo de envío"
                  variant="outlined"
                  :disabled="isTracking"
                  prepend-inner-icon="mdi-timer-outline"
                  color="primary"
                  hint="Cambia el intervalo solo cuando el rastreo esté detenido"
                  persistent-hint
                  density="comfortable"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon>mdi-clock-outline</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import gpsService from '@/services/gps'
import api from '@/services/api'
import dayjs from 'dayjs'
import AppHeader from '@/components/common/AppHeader.vue'

const toast = useToast()
const isTracking = ref(false)
const lastLocation = ref<any>(null)
const device = ref<any>(null)
const devices = ref<any[]>([])
const selectedDeviceId = ref<number | null>(null)
const interval = ref(30)

const intervalOptions = [
  { title: '30 segundos', value: 30 },
  { title: '1 minuto', value: 60 },
  { title: '5 minutos', value: 300 }
]

const getStatusColor = (status: string) => {
  const colors: any = {
    activo: 'success',
    inactivo: 'error',
    mantenimiento: 'warning'
  }
  return colors[status] || 'grey'
}

const formatTime = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss')
}

const loadDevices = async () => {
  try {
    const response = await api.get('/devices')
    devices.value = response.data
    
    if (devices.value.length > 0) {
      // Seleccionar el primer dispositivo por defecto
      selectedDeviceId.value = devices.value[0].id
      device.value = devices.value[0]
    } else {
      toast.warning('No tienes dispositivos asignados')
    }
  } catch (error) {
    toast.error('Error al cargar dispositivos')
  }
}

const onDeviceChange = () => {
  device.value = devices.value.find(d => d.id === selectedDeviceId.value)
  
  // Si estaba rastreando, detener y reiniciar con el nuevo dispositivo
  if (isTracking.value) {
    gpsService.stopTracking()
    isTracking.value = false
    toast.info('Cambiaste de dispositivo. Inicia el rastreo nuevamente.')
  }
}

const toggleTracking = () => {
  if (!gpsService.isSupported()) {
    toast.error('Tu navegador no soporta geolocalización')
    return
  }

  if (!device.value) {
    toast.error('No tienes un dispositivo asignado')
    return
  }

  if (device.value.status !== 'activo') {
    toast.error('Tu dispositivo no está activo')
    return
  }

  if (isTracking.value) {
    gpsService.stopTracking()
    isTracking.value = false
    toast.info('Rastreo detenido')
  } else {
    try {
      gpsService.startTracking(device.value.id, interval.value)
      isTracking.value = true
      toast.success('Rastreo iniciado')
    } catch (error: any) {
      toast.error(error.message)
    }
  }
}

onMounted(async () => {
  await loadDevices()

  gpsService.onSuccess((location) => {
    lastLocation.value = location
    toast.success('Ubicación enviada correctamente', {
      timeout: 2000
    })
  })

  gpsService.onError((error) => {
    toast.error(error)
  })
})

onBeforeUnmount(() => {
  if (isTracking.value) {
    gpsService.stopTracking()
  }
})
</script>

<style scoped>
.tracking-card {
  border-radius: 20px !important;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tracking-header {
  padding: 48px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.tracking-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse-bg 3s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.tracking-active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.tracking-inactive {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}

.tracking-icon-container {
  display: inline-block;
  padding: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.tracking-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.text-white-80 {
  color: rgba(255, 255, 255, 0.9);
}

.status-chip {
  animation: pulse-scale 2s ease-in-out infinite;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.tracking-button {
  height: 72px !important;
  font-size: 18px !important;
  transition: all 0.3s ease;
}

.tracking-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}

.info-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.bg-gradient-device {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-location {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-config {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-selector {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.device-selector-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

.config-card {
  border-radius: 16px !important;
}

.transparent {
  background: transparent !important;
}

.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.v-theme--dark .v-list-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>
