<template>
  <v-app>
    <AppHeader />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <!-- Card de Estado -->
            <v-card class="mb-4" elevation="4">
              <v-card-title class="text-center text-h5">
                <v-icon size="48" :color="isTracking ? 'success' : 'error'" class="mr-2">
                  mdi-map-marker-radius
                </v-icon>
                Rastreo GPS
              </v-card-title>

              <v-card-text>
                <div class="text-center mb-4">
                  <v-chip 
                    :color="isTracking ? 'success' : 'error'" 
                    size="x-large"
                    class="px-8"
                  >
                    <v-icon start>{{ isTracking ? 'mdi-map-marker-check' : 'mdi-map-marker-off' }}</v-icon>
                    {{ isTracking ? '📍 Rastreando' : '⏸️ Detenido' }}
                  </v-chip>
                </div>

                <v-btn
                  :color="isTracking ? 'error' : 'success'"
                  size="x-large"
                  block
                  @click="toggleTracking"
                  class="my-4"
                  elevation="2"
                >
                  <v-icon start>{{ isTracking ? 'mdi-stop' : 'mdi-play' }}</v-icon>
                  {{ isTracking ? 'Detener Rastreo' : 'Iniciar Rastreo' }}
                </v-btn>

                <v-alert v-if="!gpsService.isSupported()" type="error" class="mt-4">
                  Tu navegador no soporta geolocalización
                </v-alert>
              </v-card-text>
            </v-card>

            <!-- Información del Dispositivo -->
            <v-card v-if="device" class="mb-4">
              <v-card-title>
                <v-icon class="mr-2">mdi-cellphone-link</v-icon>
                Mi Dispositivo
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-label</v-icon>
                    </template>
                    <v-list-item-title>Nombre</v-list-item-title>
                    <v-list-item-subtitle>{{ device.name }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-barcode</v-icon>
                    </template>
                    <v-list-item-title>Serial</v-list-item-title>
                    <v-list-item-subtitle>{{ device.serial }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-information</v-icon>
                    </template>
                    <v-list-item-title>Estado</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip :color="getStatusColor(device.status)" size="small">
                        {{ device.status }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Última Ubicación -->
            <v-card v-if="lastLocation">
              <v-card-title>
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                Última Ubicación Enviada
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Latitud</v-list-item-title>
                    <v-list-item-subtitle>{{ lastLocation.latitude }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Longitud</v-list-item-title>
                    <v-list-item-subtitle>{{ lastLocation.longitude }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Precisión</v-list-item-title>
                    <v-list-item-subtitle>{{ lastLocation.accuracy }} metros</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Hora</v-list-item-title>
                    <v-list-item-subtitle>{{ formatTime(lastLocation.timestamp) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Configuración -->
            <v-card class="mt-4">
              <v-card-title>
                <v-icon class="mr-2">mdi-cog</v-icon>
                Configuración
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="interval"
                  :items="intervalOptions"
                  label="Intervalo de envío"
                  variant="outlined"
                  :disabled="isTracking"
                  hint="Cambia el intervalo solo cuando el rastreo esté detenido"
                  persistent-hint
                />
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

const loadDevice = async () => {
  try {
    const response = await api.get('/devices')
    device.value = response.data[0]
  } catch (error) {
    toast.error('Error al cargar dispositivo')
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
  await loadDevice()

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
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
