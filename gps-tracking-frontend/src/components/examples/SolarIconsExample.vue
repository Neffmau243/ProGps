<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          <SolarIcon name="palette" :size="32" class="mr-2" />
          Ejemplos de Solar Icons
        </h1>
      </v-col>
    </v-row>

    <!-- Estilos -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Estilos Disponibles</v-card-title>
          <v-card-text>
            <div class="d-flex gap-4 align-center">
              <div class="text-center">
                <SolarIcon name="gps" style="linear" :size="48" />
                <div class="text-caption mt-2">Linear</div>
              </div>
              <div class="text-center">
                <SolarIcon name="gps" style="bold" :size="48" />
                <div class="text-caption mt-2">Bold</div>
              </div>
              <div class="text-center">
                <SolarIcon name="gps" style="bold-duotone" :size="48" />
                <div class="text-caption mt-2">Bold Duotone</div>
              </div>
              <div class="text-center">
                <SolarIcon name="gps" style="broken" :size="48" />
                <div class="text-caption mt-2">Broken</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Iconos de GPS -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Iconos de GPS y Ubicación</v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap gap-4">
              <div v-for="icon in gpsIcons" :key="icon.name" class="text-center">
                <SolarIcon :name="icon.name" :size="32" />
                <div class="text-caption mt-1">{{ icon.label }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botones con iconos -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Botones con Iconos</v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap gap-2">
              <v-btn color="primary">
                <SolarIcon name="gps" :size="20" class="mr-2" />
                Iniciar GPS
              </v-btn>
              
              <v-btn color="success">
                <SolarIcon name="play" :size="20" class="mr-2" />
                Iniciar
              </v-btn>
              
              <v-btn color="error">
                <SolarIcon name="stop-circle" :size="20" class="mr-2" />
                Detener
              </v-btn>
              
              <v-btn color="warning">
                <SolarIcon name="refresh" :size="20" class="mr-2" />
                Actualizar
              </v-btn>
              
              <v-btn variant="outlined">
                <SolarIcon name="download" :size="20" class="mr-2" />
                Descargar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lista con iconos -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Lista de Dispositivos</v-card-title>
          <v-list>
            <v-list-item v-for="device in devices" :key="device.id">
              <template #prepend>
                <SolarIcon :name="device.icon" :size="24" />
              </template>
              <v-list-item-title>{{ device.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ device.serial }}</v-list-item-subtitle>
              <template #append>
                <v-chip :color="device.statusColor" size="small">
                  <SolarIcon :name="device.statusIcon" :size="14" class="mr-1" />
                  {{ device.status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Cards con iconos -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <SolarIcon name="users-group-rounded" :size="24" class="mr-2" />
            Total Usuarios
          </v-card-title>
          <v-card-text>
            <div class="text-h3">150</div>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <SolarIcon name="devices" :size="24" class="mr-2" />
            Dispositivos Activos
          </v-card-title>
          <v-card-text>
            <div class="text-h3">45</div>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title class="d-flex align-center">
            <SolarIcon name="map-point-wave" :size="24" class="mr-2" />
            Ubicaciones Hoy
          </v-card-title>
          <v-card-text>
            <div class="text-h3">1,234</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tamaños -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Diferentes Tamaños</v-card-title>
          <v-card-text>
            <div class="d-flex gap-4 align-center">
              <SolarIcon name="map-point" :size="16" />
              <SolarIcon name="map-point" :size="24" />
              <SolarIcon name="map-point" :size="32" />
              <SolarIcon name="map-point" :size="48" />
              <SolarIcon name="map-point" :size="64" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Colores -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Diferentes Colores</v-card-title>
          <v-card-text>
            <div class="d-flex gap-4 align-center">
              <SolarIcon name="gps" :size="32" class="text-primary" />
              <SolarIcon name="gps" :size="32" class="text-secondary" />
              <SolarIcon name="gps" :size="32" class="text-success" />
              <SolarIcon name="gps" :size="32" class="text-error" />
              <SolarIcon name="gps" :size="32" class="text-warning" />
              <SolarIcon name="gps" :size="32" class="text-info" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SolarIcon from '@/components/SolarIcon.vue'
import { SOLAR_ICONS } from '@/utils/solarIcons'

const gpsIcons = [
  { name: SOLAR_ICONS.GPS, label: 'GPS' },
  { name: SOLAR_ICONS.MAP_POINT, label: 'Ubicación' },
  { name: SOLAR_ICONS.MAP, label: 'Mapa' },
  { name: SOLAR_ICONS.COMPASS, label: 'Brújula' },
  { name: SOLAR_ICONS.ROUTE, label: 'Ruta' },
  { name: SOLAR_ICONS.LOCATION, label: 'En Vivo' },
]

const devices = [
  {
    id: 1,
    name: 'Móvil Juan',
    serial: 'ABC123',
    icon: 'smartphone',
    status: 'Activo',
    statusIcon: 'check-circle',
    statusColor: 'success'
  },
  {
    id: 2,
    name: 'Tablet María',
    serial: 'XYZ789',
    icon: 'tablet',
    status: 'Inactivo',
    statusIcon: 'close-circle',
    statusColor: 'error'
  },
  {
    id: 3,
    name: 'Laptop Pedro',
    serial: 'DEF456',
    icon: 'laptop',
    status: 'Mantenimiento',
    statusIcon: 'settings',
    statusColor: 'warning'
  },
]
</script>

<style scoped>
.gap-4 {
  gap: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
