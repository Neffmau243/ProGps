<template>
  <div class="route-map-container">
    <div id="route-map" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  latitude: string | number;
  longitude: string | number;
  accuracy?: string | number;
  timestamp?: string;
}

const props = defineProps<{
  locations: Location[];
}>();

const map = ref<L.Map | null>(null);
const polyline = ref<L.Polyline | null>(null);
const startMarker = ref<L.Marker | null>(null);
const endMarker = ref<L.Marker | null>(null);

// Iconos personalizados para inicio y fin con estilo neón
const startIcon = L.divIcon({
  className: 'custom-start-marker',
  html: `
    <div style="
      background-color: #C0F11C;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      border: 4px solid #000;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(192, 241, 28, 0.8), 0 4px 12px rgba(0,0,0,0.4);
    ">
      <div style="
        width: 12px;
        height: 12px;
        background-color: #000;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const endIcon = L.divIcon({
  className: 'custom-end-marker',
  html: `
    <div style="
      background-color: #FF4444;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      border: 4px solid #000;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(255, 68, 68, 0.8), 0 4px 12px rgba(0,0,0,0.4);
    ">
      <div style="
        width: 12px;
        height: 12px;
        background-color: #000;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const formatTime = (timestamp?: string) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

const initMap = () => {
  map.value = L.map('route-map', {
    zoomControl: false,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true
  }).setView([-12.046374, -77.042793], 13);

  // Tile layer oscuro
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19,
    minZoom: 3
  }).addTo(map.value as any);

  // Escala
  L.control.scale({
    position: 'bottomleft',
    metric: true,
    imperial: false,
    maxWidth: 200
  }).addTo(map.value as any);
};

const drawRoute = (locations: Location[]) => {
  if (!map.value || !locations || locations.length === 0) {
    console.log('No se puede dibujar ruta:', { hasMap: !!map.value, locationsCount: locations?.length });
    return;
  }

  console.log('Dibujando ruta con', locations.length, 'puntos');

  // Limpiar elementos anteriores
  if (polyline.value && map.value) {
    (map.value as any).removeLayer(polyline.value);
  }
  if (startMarker.value && map.value) {
    (map.value as any).removeLayer(startMarker.value);
  }
  if (endMarker.value && map.value) {
    (map.value as any).removeLayer(endMarker.value);
  }

  // Convertir ubicaciones a coordenadas
  const coordinates: [number, number][] = locations.map(loc => [
    typeof loc.latitude === 'string' ? parseFloat(loc.latitude) : loc.latitude,
    typeof loc.longitude === 'string' ? parseFloat(loc.longitude) : loc.longitude
  ]);

  // Dibujar la ruta (polyline) con estilo neón
  polyline.value = L.polyline(coordinates, {
    color: '#C0F11C',
    weight: 4,
    opacity: 0.9,
    smoothFactor: 1
  }).addTo(map.value as any);

  // Marcador de inicio (verde neón)
  const firstLocation = locations[0];
  if (firstLocation) {
    const firstLat = typeof firstLocation.latitude === 'string' ? parseFloat(firstLocation.latitude) : firstLocation.latitude;
    const firstLng = typeof firstLocation.longitude === 'string' ? parseFloat(firstLocation.longitude) : firstLocation.longitude;
    
    startMarker.value = L.marker([firstLat, firstLng], { icon: startIcon })
      .addTo(map.value as any);

    startMarker.value.bindPopup(`
      <div style="
        background-color: #000;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        border: 2px solid #C0F11C;
        min-width: 200px;
      ">
        <h3 style="margin: 0 0 8px 0; color: #C0F11C; font-size: 16px;">
          <span style="display: inline-block; width: 12px; height: 12px; background: #C0F11C; border-radius: 50%; margin-right: 6px;"></span>
          Punto de Inicio
        </h3>
        <p style="margin: 4px 0; font-size: 13px;">
          <strong style="color: #C0F11C;">⏰ Hora:</strong> ${formatTime(firstLocation.timestamp)}
        </p>
        ${firstLocation.accuracy ? `
          <p style="margin: 4px 0; font-size: 13px;">
            <strong style="color: #C0F11C;">🎯 Precisión:</strong> ${firstLocation.accuracy}m
          </p>
        ` : ''}
      </div>
    `);
  }

  // Marcador de fin (rojo)
  const lastLocation = locations[locations.length - 1];
  if (lastLocation) {
    const lastLat = typeof lastLocation.latitude === 'string' ? parseFloat(lastLocation.latitude) : lastLocation.latitude;
    const lastLng = typeof lastLocation.longitude === 'string' ? parseFloat(lastLocation.longitude) : lastLocation.longitude;
    
    endMarker.value = L.marker([lastLat, lastLng], { icon: endIcon })
      .addTo(map.value as any);

    endMarker.value.bindPopup(`
      <div style="
        background-color: #000;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        border: 2px solid #FF4444;
        min-width: 200px;
      ">
        <h3 style="margin: 0 0 8px 0; color: #FF4444; font-size: 16px;">
          <span style="display: inline-block; width: 12px; height: 12px; background: #FF4444; border-radius: 50%; margin-right: 6px;"></span>
          Punto Final
        </h3>
        <p style="margin: 4px 0; font-size: 13px;">
          <strong style="color: #FF4444;">⏰ Hora:</strong> ${formatTime(lastLocation.timestamp)}
        </p>
        ${lastLocation.accuracy ? `
          <p style="margin: 4px 0; font-size: 13px;">
            <strong style="color: #FF4444;">🎯 Precisión:</strong> ${lastLocation.accuracy}m
          </p>
        ` : ''}
      </div>
    `);
  }

  // Ajustar vista para mostrar toda la ruta
  map.value.fitBounds(polyline.value.getBounds(), { 
    padding: [50, 50],
    animate: true,
    duration: 1
  });

  console.log('Ruta dibujada exitosamente');
};

onMounted(() => {
  initMap();
  if (props.locations && props.locations.length > 0) {
    setTimeout(() => drawRoute(props.locations), 100);
  }
});

watch(() => props.locations, (newLocations) => {
  console.log('Watch disparado, ubicaciones:', newLocations?.length);
  drawRoute(newLocations);
}, { deep: true, immediate: true });

// Métodos expuestos para control externo
const zoomIn = () => {
  if (map.value) {
    map.value.zoomIn();
  }
};

const zoomOut = () => {
  if (map.value) {
    map.value.zoomOut();
  }
};

const resetView = () => {
  if (map.value && polyline.value) {
    map.value.fitBounds(polyline.value.getBounds(), { 
      padding: [50, 50],
      animate: true,
      duration: 1
    });
  }
};

defineExpose({
  zoomIn,
  zoomOut,
  resetView
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
.route-map-container {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
  background-color: #0a0a0a;
}

/* Estilos globales para Leaflet */
:deep(.leaflet-popup-content-wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.leaflet-popup-tip) {
  background-color: #000 !important;
  border: 2px solid #C0F11C !important;
}

:deep(.leaflet-container) {
  background-color: #0a0a0a !important;
}

:deep(.custom-start-marker),
:deep(.custom-end-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.leaflet-control-scale-line) {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 2px solid #C0F11C !important;
  color: #C0F11C !important;
}
</style>
