<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div id="map" style="width: 100%; height: 100%;"></div>
    
    <!-- Controles flotantes -->
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  device_id: number
  device_name: string
  device_serial: string
  user_id: number
  user_name: string
  latitude: string
  longitude: string
  accuracy: string
  timestamp: string
  minutes_ago: number
}

const props = defineProps<{
  locations: Location[]
  center?: [number, number]
  zoom?: number
}>()

const map = ref<L.Map | null>(null)
const markers = ref<{ [key: number]: L.Marker }>({})

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

onMounted(() => {
  const center = props.center || [-12.046374, -77.042793]
  const zoom = props.zoom || 13

  map.value = L.map('map', {
    zoomControl: false, // Deshabilitar controles nativos de zoom
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true
  }).setView(center, zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 3
  }).addTo(map.value)
})

watch(() => props.locations, (newLocations) => {
  if (!map.value) return

  // Limpiar marcadores antiguos
  Object.values(markers.value).forEach(marker => {
    map.value?.removeLayer(marker)
  })
  markers.value = {}

  // Crear nuevos marcadores
  newLocations.forEach(location => {
    if (!map.value) return

    const marker = L.marker([
      parseFloat(location.latitude),
      parseFloat(location.longitude)
    ]).addTo(map.value)

    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0;">${location.device_name}</h3>
        <p style="margin: 4px 0;"><strong>Usuario:</strong> ${location.user_name}</p>
        <p style="margin: 4px 0;"><strong>Serial:</strong> ${location.device_serial}</p>
        <p style="margin: 4px 0;"><strong>Precisión:</strong> ${location.accuracy}m</p>
        <p style="margin: 4px 0;"><strong>Última actualización:</strong> Hace ${location.minutes_ago} min</p>
      </div>
    `)

    markers.value[location.device_id] = marker
  })

  // Ajustar vista si hay marcadores
  if (newLocations.length > 0) {
    const bounds = L.latLngBounds(
      newLocations.map(loc => [parseFloat(loc.latitude), parseFloat(loc.longitude)])
    )
    map.value.fitBounds(bounds, { padding: [50, 50] })
  }
}, { deep: true })

// Métodos para controlar el zoom
const zoomIn = () => {
  if (map.value) {
    map.value.zoomIn()
  }
}

const zoomOut = () => {
  if (map.value) {
    map.value.zoomOut()
  }
}

const resetView = () => {
  if (map.value && props.locations.length > 0) {
    const bounds = L.latLngBounds(
      props.locations.map(loc => [parseFloat(loc.latitude), parseFloat(loc.longitude)])
    )
    map.value.fitBounds(bounds, { 
      padding: [50, 50],
      animate: true,
      duration: 1
    })
  }
}

// Exponer métodos para uso externo
defineExpose({
  zoomIn,
  zoomOut,
  resetView
})
</script>

<style scoped>
#map {
  border-radius: 8px;
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
</style>
