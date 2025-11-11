<template>
  <div id="map" style="width: 100%; height: 100%;"></div>
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

  map.value = L.map('map').setView(center, zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
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
</script>

<style scoped>
#map {
  border-radius: 8px;
}
</style>
