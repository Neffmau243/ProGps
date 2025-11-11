<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main>
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

            <v-alert v-if="!historyData" type="info" variant="tonal">
              Selecciona un dispositivo y rango de fechas para ver el historial
            </v-alert>

            <div v-else>
              <!-- Estadísticas -->
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-card variant="tonal" color="primary">
                    <v-card-text class="text-center">
                      <div class="text-h5">{{ historyData.statistics.total_points }}</div>
                      <div class="text-caption">Puntos Registrados</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card variant="tonal" color="success">
                    <v-card-text class="text-center">
                      <div class="text-h5">{{ historyData.statistics.distance_km }} km</div>
                      <div class="text-caption">Distancia Recorrida</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card variant="tonal" color="info">
                    <v-card-text class="text-center">
                      <div class="text-h5">{{ historyData.statistics.duration_minutes }} min</div>
                      <div class="text-caption">Duración</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Información del dispositivo -->
              <v-card class="mb-4">
                <v-card-title>{{ historyData.device.name }}</v-card-title>
                <v-card-subtitle>Usuario: {{ historyData.device.user_name }}</v-card-subtitle>
              </v-card>

              <!-- Lista de ubicaciones -->
              <v-card>
                <v-card-title>Ubicaciones</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="(location, index) in historyData.locations"
                      :key="index"
                    >
                      <template v-slot:prepend>
                        <v-avatar color="primary" size="small">
                          {{ index + 1 }}
                        </v-avatar>
                      </template>
                      <v-list-item-title>
                        Lat: {{ location.latitude }}, Lon: {{ location.longitude }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ formatDate(location.timestamp) }} - Precisión: {{ location.accuracy }}m
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>
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

const toast = useToast()
const devices = ref<any[]>([])
const selectedDevice = ref<number | null>(null)
const startDate = ref('')
const endDate = ref('')
const historyData = ref<any>(null)
const loading = ref(false)

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
  try {
    const response = await api.get('/locations/history', {
      params: {
        device_id: selectedDevice.value,
        start_date: startDate.value.replace('T', ' '),
        end_date: endDate.value.replace('T', ' ')
      }
    })
    historyData.value = response.data
    toast.success('Historial cargado exitosamente')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error al cargar historial')
  } finally {
    loading.value = false
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
