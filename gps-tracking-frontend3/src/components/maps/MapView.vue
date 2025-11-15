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
        <i class="bi bi-plus-lg"></i>
      </button>
      <button 
        class="map-control-btn"
        @click="zoomOut"
        title="Alejar"
      >
        <i class="bi bi-dash-lg"></i>
      </button>
      <button 
        class="map-control-btn success"
        @click="resetView"
        title="Ajustar vista"
      >
        <i class="bi bi-fullscreen"></i>
      </button>
      <button 
        v-if="allowCreateCheckpoint"
        class="map-control-btn checkpoint"
        @click="toggleCheckpointMode"
        :class="{ active: isCheckpointMode }"
        title="Clic en el mapa para crear checkpoint"
      >
        <i class="bi bi-geo-alt"></i>
      </button>
    </div>

    <!-- Mensaje flotante cuando está en modo checkpoint -->
    <div v-if="isCheckpointMode" class="checkpoint-mode-banner">
      <i class="bi bi-hand-index"></i>
      Haz clic en el mapa donde quieres crear el checkpoint
      <button class="cancel-btn" @click="isCheckpointMode = false">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCheckpoints } from '@/composables/useCheckpoints';

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
  showCheckpoints?: boolean;
  allowCreateCheckpoint?: boolean;
}>();

const emit = defineEmits<{
  (e: 'checkpoint-created', data: { latitude: number; longitude: number }): void;
}>();

const map = ref<L.Map | null>(null);
const markers = ref<{ [key: number]: L.Marker }>({});
const checkpointCircles = ref<{ [key: string]: L.Circle }>({});
const isCheckpointMode = ref(false);
const isUpdatingMarkers = ref(false);

const { activeCheckpoints, checkLocation } = useCheckpoints();

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
  if (!map.value || props.locations.length === 0 || isUpdatingMarkers.value) return;

  try {
    // Cerrar cualquier popup abierto antes de ajustar vista
    map.value.closePopup();
    
    const bounds = L.latLngBounds(
      props.locations.map(loc => [
        typeof loc.latitude === 'string' ? parseFloat(loc.latitude) : loc.latitude,
        typeof loc.longitude === 'string' ? parseFloat(loc.longitude) : loc.longitude
      ])
    );
    
    // Usar animate: false para evitar problemas con marcadores
    map.value.fitBounds(bounds, { 
      padding: [50, 50],
      animate: false // Desactivar animación para evitar errores
    });
  } catch (error) {
    console.warn('Error ajustando vista del mapa:', error);
  }
};

const toggleCheckpointMode = () => {
  isCheckpointMode.value = !isCheckpointMode.value;
  
  if (isCheckpointMode.value && map.value) {
    // Cambiar cursor del mapa
    const container = map.value.getContainer();
    container.style.cursor = 'crosshair';
  } else if (map.value) {
    const container = map.value.getContainer();
    container.style.cursor = 'grab';
  }
};

const handleMapClick = (e: L.LeafletMouseEvent) => {
  if (isCheckpointMode.value && props.allowCreateCheckpoint) {
    // Emitir evento con las coordenadas donde se hizo clic
    emit('checkpoint-created', {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng
    });
    
    // Crear marcador temporal para mostrar donde se creará el checkpoint
    // con animación desactivada para evitar errores cuando se remueve
    const tempMarker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: L.divIcon({
        className: 'temp-checkpoint-marker',
        html: `
          <div style="
            background-color: #C0F11C;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse-marker 1s ease-in-out;
          ">
            🎯
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }),
      // Desactivar animaciones de zoom para evitar errores al remover
      zIndexOffset: 1000
    }).addTo(map.value as any);
    
    // Desactivar eventos de animación para este marcador
    tempMarker.off('zoomanim');
    
    // Remover el marcador después de 2 segundos de forma segura
    setTimeout(() => {
      try {
        if (map.value && map.value.hasLayer(tempMarker)) {
          map.value.removeLayer(tempMarker);
        }
      } catch (error) {
        console.warn('Error removiendo marcador temporal:', error);
      }
    }, 2000);
    
    // Salir del modo checkpoint
    isCheckpointMode.value = false;
    if (map.value) {
      const container = map.value.getContainer();
      container.style.cursor = 'grab';
    }
  }
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

  // Event listener para clics en el mapa (crear checkpoints)
  map.value.on('click', handleMapClick);

  // Agregar marcadores iniciales
  updateMarkers(props.locations);
  
  // Agregar checkpoints iniciales
  if (props.showCheckpoints !== false) {
    updateCheckpointsOnMap();
  }
});

const updateMarkers = (locations: Location[]) => {
  if (!map.value || isUpdatingMarkers.value) return;
  
  isUpdatingMarkers.value = true;

  try {
    // Cerrar cualquier popup abierto primero
    if (map.value) {
      map.value.closePopup();
    }

    // Remover marcadores antiguos de forma segura
    Object.values(markers.value).forEach(marker => {
      try {
        if (map.value && map.value.hasLayer(marker)) {
          // Cerrar popup del marcador si está abierto
          marker.closePopup();
          // Desactivar todos los eventos de animación
          marker.off('zoomanim');
          marker.off();
          // Remover del mapa
          map.value.removeLayer(marker);
        }
      } catch (error) {
        console.warn('Error removiendo marcador:', error);
      }
    });
    markers.value = {};

    // Crear nuevos marcadores
    locations.forEach(location => {
      if (!map.value) return;

      const lat = typeof location.latitude === 'string' ? parseFloat(location.latitude) : location.latitude;
      const lng = typeof location.longitude === 'string' ? parseFloat(location.longitude) : location.longitude;

      const color = getMarkerColor(location.minutes_ago);
      const icon = createCustomIcon(color);

      // Crear marcador con animaciones de zoom desactivadas por defecto
      const marker = L.marker([lat, lng], { 
        icon,
        zIndexOffset: location.minutes_ago && location.minutes_ago < 2 ? 100 : 0
      }).addTo(map.value as any);

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
      maxWidth: 300,
      closeButton: true,
      autoPan: false, // Desactivar auto-pan que puede causar conflictos
      keepInView: true,
      className: 'location-popup' // Clase para identificación
    });

      markers.value[location.device_id] = marker;

      // Verificar checkpoints para cada ubicación
      if (props.showCheckpoints !== false) {
        checkLocation(lat, lng, location.user_name, location.device_name);
      }
    });

    // Ajustar vista si hay marcadores (usar setTimeout para evitar conflictos)
    if (locations.length > 0) {
      setTimeout(() => {
        if (map.value) {
          try {
            resetView();
          } catch (error) {
            console.warn('Error en resetView:', error);
          }
        }
      }, 100);
    }

    // Actualizar checkpoints en el mapa
    if (props.showCheckpoints !== false) {
      updateCheckpointsOnMap();
    }
  } finally {
    isUpdatingMarkers.value = false;
  }
};

// Función para dibujar checkpoints en el mapa
const updateCheckpointsOnMap = () => {
  if (!map.value) return;

  // Remover círculos antiguos de forma segura
  Object.values(checkpointCircles.value).forEach(circle => {
    try {
      if (map.value && map.value.hasLayer(circle)) {
        // Cerrar popup si está abierto
        circle.closePopup();
        map.value.removeLayer(circle);
      }
    } catch (error) {
      console.warn('Error removiendo círculo de checkpoint:', error);
    }
  });
  checkpointCircles.value = {};

  // Dibujar nuevos checkpoints
  activeCheckpoints.value.forEach(checkpoint => {
    if (!map.value) return;

    const circle = L.circle([checkpoint.latitude, checkpoint.longitude], {
      radius: checkpoint.radius,
      color: checkpoint.color,
      fillColor: checkpoint.color,
      fillOpacity: 0.2,
      weight: 3,
      dashArray: '10, 5',
    }).addTo(map.value as any);

    // Popup para el checkpoint
    circle.bindPopup(`
      <div style="
        background-color: #000;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        border: 2px solid ${checkpoint.color};
        min-width: 200px;
      ">
        <h3 style="margin: 0 0 8px 0; color: ${checkpoint.color}; font-size: 16px;">
          🎯 ${checkpoint.name}
        </h3>
        <p style="margin: 4px 0; font-size: 13px;">
          <strong style="color: ${checkpoint.color};">📍 Radio:</strong> ${checkpoint.radius}m
        </p>
        <p style="margin: 4px 0; font-size: 13px;">
          <strong style="color: ${checkpoint.color};">🔵 Estado:</strong> ${checkpoint.active ? 'Activo' : 'Inactivo'}
        </p>
      </div>
    `, {
      maxWidth: 300
    });

    checkpointCircles.value[checkpoint.id] = circle;
  });
};

watch(() => props.locations, (newLocations) => {
  // Debounce implícito usando nextTick para evitar múltiples llamadas
  if (!isUpdatingMarkers.value && map.value) {
    updateMarkers(newLocations);
  }
}, { deep: true });

// Observar cambios en los checkpoints
watch(activeCheckpoints, () => {
  if (props.showCheckpoints !== false && map.value) {
    updateCheckpointsOnMap();
  }
}, { deep: true });

onBeforeUnmount(() => {
  // Limpiar marcadores antes de destruir el mapa
  Object.values(markers.value).forEach(marker => {
    try {
      if (map.value && map.value.hasLayer(marker)) {
        marker.off('zoomanim');
        map.value.removeLayer(marker);
      }
    } catch (error) {
      console.warn('Error limpiando marcador:', error);
    }
  });
  markers.value = {};

  // Limpiar círculos de checkpoints
  Object.values(checkpointCircles.value).forEach(circle => {
    try {
      if (map.value && map.value.hasLayer(circle)) {
        map.value.removeLayer(circle);
      }
    } catch (error) {
      console.warn('Error limpiando círculo:', error);
    }
  });
  checkpointCircles.value = {};

  // Destruir el mapa
  if (map.value) {
    try {
      map.value.off(); // Remover todos los event listeners
      map.value.remove();
    } catch (error) {
      console.warn('Error destruyendo mapa:', error);
    }
    map.value = null;
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

.map-control-btn.checkpoint {
  background-color: rgba(192, 241, 28, 0.2);
  border-color: var(--color-neon-green);
  font-size: 20px;
}

.map-control-btn.checkpoint:hover {
  background-color: rgba(192, 241, 28, 0.4);
}

.map-control-btn.checkpoint.active {
  background-color: var(--color-neon-green);
  animation: pulse-btn 1s infinite;
}

@keyframes pulse-btn {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(192, 241, 28, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(192, 241, 28, 0);
  }
}

/* Checkpoint Mode Banner */
.checkpoint-mode-banner {
  position: absolute;
  top: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-neon-green);
  color: var(--color-black);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.cancel-btn {
  background: transparent;
  border: none;
  color: var(--color-black);
  cursor: pointer;
  font-size: var(--font-size-lg);
  padding: 0;
  margin-left: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.cancel-btn:hover {
  transform: scale(1.2);
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

:deep(.temp-checkpoint-marker) {
  background: transparent !important;
  border: none !important;
}

@keyframes pulse-marker {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
</style>
