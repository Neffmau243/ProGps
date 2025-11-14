<template>
  <div class="map-container">
    <div id="realtime-map" class="map"></div>
    
    <!-- Controles flotantes -->
    <div class="map-controls">
      <button 
        class="map-control-btn"
        @click="zoomIn"
        title="Acercar"
      >
        +
      </button>
      <button 
        class="map-control-btn"
        @click="zoomOut"
        title="Alejar"
      >
        −
      </button>
      <button 
        class="map-control-btn success"
        @click="resetView"
        title="Ajustar vista"
      >
        ⛶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  device_id: number;
  device_name: string;
  serial?: string;
  user_id: number;
  user_name: string;
  latitude: string | number;
  longitude: string | number;
  accuracy?: string | number;
  timestamp?: string;
  minutes_ago?: number;
}

const props = defineProps<{
  locations: Location[];
  center?: [number, number];
  zoom?: number;
}>();

const map = ref<L.Map | null>(null);
const markers = ref<{ [key: number]: L.Marker }>({});

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados con colores
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid #000;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: #000;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const getMarkerColor = (minutesAgo?: number) => {
  if (!minutesAgo || minutesAgo < 2) return '#C0F11C'; // Verde neón
  if (minutesAgo < 5) return '#FFD700'; // Amarillo
  return '#FF4444'; // Rojo
};

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
  if (!map.value || props.locations.length === 0) return;

  const bounds = L.latLngBounds(
    props.locations.map(loc => [
      typeof loc.latitude === 'string' ? parseFloat(loc.latitude) : loc.latitude,
      typeof loc.longitude === 'string' ? parseFloat(loc.longitude) : loc.longitude
    ])
  );
  map.value.fitBounds(bounds, { padding: [50, 50] });
};

onMounted(() => {
  const center = props.center || [-12.046374, -77.042793];
  const zoom = props.zoom || 13;

  map.value = L.map('realtime-map', {
    zoomControl: false,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true
  }).setView(center, zoom);

  // Tile layer oscuro personalizado
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19,
    minZoom: 3
  }).addTo(map.value as any);

  // Agregar marcadores iniciales
  updateMarkers(props.locations);
});

const updateMarkers = (locations: Location[]) => {
  if (!map.value) return;

  // Remover marcadores antiguos
  Object.values(markers.value).forEach(marker => {
    map.value?.removeLayer(marker);
  });
  markers.value = {};

  // Crear nuevos marcadores
  locations.forEach(location => {
    if (!map.value) return;

    const lat = typeof location.latitude === 'string' ? parseFloat(location.latitude) : location.latitude;
    const lng = typeof location.longitude === 'string' ? parseFloat(location.longitude) : location.longitude;

    const color = getMarkerColor(location.minutes_ago);
    const icon = createCustomIcon(color);

    const marker = L.marker([lat, lng], { icon }).addTo(map.value as any);

    const minutesText = !location.minutes_ago || location.minutes_ago < 1 
      ? 'Ahora mismo' 
      : `Hace ${location.minutes_ago} min`;

    marker.bindPopup(`
      <div style="
        background-color: #000;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        border: 2px solid #C0F11C;
        min-width: 200px;
      ">
        <h3 style="margin: 0 0 8px 0; color: #C0F11C; font-size: 16px;">
          📱 ${location.device_name}
        </h3>
        <p style="margin: 4px 0; font-size: 13px;">
          <strong style="color: #C0F11C;">👤 Usuario:</strong> ${location.user_name}
        </p>
        ${location.serial ? `
          <p style="margin: 4px 0; font-size: 13px;">
            <strong style="color: #C0F11C;">🔢 Serial:</strong> ${location.serial}
          </p>
        ` : ''}
        ${location.accuracy ? `
          <p style="margin: 4px 0; font-size: 13px;">
            <strong style="color: #C0F11C;">📍 Precisión:</strong> ${location.accuracy}m
          </p>
        ` : ''}
        <p style="margin: 4px 0; font-size: 13px;">
          <strong style="color: #C0F11C;">🕐 Última vez:</strong> ${minutesText}
        </p>
      </div>
    `, {
      maxWidth: 300
    });

    markers.value[location.device_id] = marker;
  });

  // Ajustar vista si hay marcadores
  if (locations.length > 0) {
    resetView();
  }
};

watch(() => props.locations, (newLocations) => {
  updateMarkers(newLocations);
}, { deep: true });

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
}

.map-controls {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: 1000;
}

.map-control-btn {
  width: 40px;
  height: 40px;
  background-color: var(--color-neon-green);
  color: var(--color-black);
  border: 2px solid var(--color-black);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.map-control-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
  background-color: #d4ff3e;
}

.map-control-btn:active {
  transform: scale(0.95);
}

.map-control-btn.success {
  background-color: #00ff88;
}

.map-control-btn.success:hover {
  background-color: #00ffaa;
}

/* Estilos globales para el mapa (no scoped) */
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

:deep(.custom-marker) {
  background: transparent !important;
  border: none !important;
}
</style>
