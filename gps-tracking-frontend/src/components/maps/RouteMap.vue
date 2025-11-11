<template>
  <div id="route-map" style="width: 100%; height: 100%;"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  latitude: string
  longitude: string
  accuracy: string
  timestamp: string
}

const props = defineProps<{
  locations: Location[]
}>()

const map = ref<L.Map | null>(null)
const polyline = ref<L.Polyline | null>(null)
const startMarker = ref<L.Marker | null>(null)
const endMarker = ref<L.Marker | null>(null)

// Iconos personalizados para inicio y fin
const startIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const endIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const initMap = () => {
  map.value = L.map('route-map', {
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true
  }).setView([-12.046374, -77.042793], 13)

  // Agregar controles de zoom personalizados
  L.control.zoom({
    position: 'topright',
    zoomInTitle: 'Acercar',
    zoomOutTitle: 'Alejar'
  }).addTo(map.value)

  // Agregar control de escala
  L.control.scale({
    position: 'bottomleft',
    metric: true,
    imperial: false,
    maxWidth: 200
  }).addTo(map.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 3
  }).addTo(map.value)
}

const drawRoute = (locations: Location[]) => {
  if (!map.value || !locations || locations.length === 0) {
    console.log('No se puede dibujar ruta:', { hasMap: !!map.value, locationsCount: locations?.length })
    return
  }

  console.log('Dibujando ruta con', locations.length, 'puntos')

  // Limpiar elementos anteriores
  if (polyline.value) {
    map.value.removeLayer(polyline.value)
  }
  if (startMarker.value) {
    map.value.removeLayer(startMarker.value)
  }
  if (endMarker.value) {
    map.value.removeLayer(endMarker.value)
  }

  // Convertir ubicaciones a coordenadas
  const coordinates: [number, number][] = locations.map(loc => [
    parseFloat(loc.latitude),
    parseFloat(loc.longitude)
  ])

  console.log('Coordenadas:', coordinates)

  // Dibujar la ruta (polyline)
  polyline.value = L.polyline(coordinates, {
    color: '#2196F3',
    weight: 4,
    opacity: 0.8,
    smoothFactor: 1
  }).addTo(map.value)

  // Marcador de inicio (verde)
  const firstLocation = locations[0]
  startMarker.value = L.marker(
    [parseFloat(firstLocation.latitude), parseFloat(firstLocation.longitude)],
    { icon: startIcon }
  ).addTo(map.value)

  startMarker.value.bindPopup(`
    <div style="min-width: 180px;">
      <h3 style="margin: 0 0 8px 0; color: #4CAF50;">🟢 Inicio</h3>
      <p style="margin: 4px 0;"><strong>Hora:</strong> ${formatTime(firstLocation.timestamp)}</p>
      <p style="margin: 4px 0;"><strong>Precisión:</strong> ${firstLocation.accuracy}m</p>
    </div>
  `)

  // Marcador de fin (rojo)
  const lastLocation = locations[locations.length - 1]
  endMarker.value = L.marker(
    [parseFloat(lastLocation.latitude), parseFloat(lastLocation.longitude)],
    { icon: endIcon }
  ).addTo(map.value)

  endMarker.value.bindPopup(`
    <div style="min-width: 180px;">
      <h3 style="margin: 0 0 8px 0; color: #FF5252;">🔴 Fin</h3>
      <p style="margin: 4px 0;"><strong>Hora:</strong> ${formatTime(lastLocation.timestamp)}</p>
      <p style="margin: 4px 0;"><strong>Precisión:</strong> ${lastLocation.accuracy}m</p>
    </div>
  `)

  // Ajustar vista para mostrar toda la ruta con animación
  map.value.fitBounds(polyline.value.getBounds(), { 
    padding: [50, 50],
    animate: true,
    duration: 1
  })

  console.log('Ruta dibujada exitosamente')
}

onMounted(() => {
  initMap()
  // Si ya hay ubicaciones cuando se monta, dibujarlas
  if (props.locations && props.locations.length > 0) {
    setTimeout(() => drawRoute(props.locations), 100)
  }
})

watch(() => props.locations, (newLocations) => {
  console.log('Watch disparado, ubicaciones:', newLocations?.length)
  drawRoute(newLocations)
}, { deep: true, immediate: true })

// Métodos para controlar el zoom programáticamente
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
  if (map.value && polyline.value) {
    map.value.fitBounds(polyline.value.getBounds(), { 
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

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
#route-map {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
