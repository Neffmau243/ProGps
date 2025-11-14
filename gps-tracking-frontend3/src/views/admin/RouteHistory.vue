<template>
  <MainLayout>
    <div class="route-history">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">📍 Historial de Ubicaciones</h1>
        <p class="hero-subtitle">Consulta rutas y trayectorias de dispositivos GPS</p>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Dispositivo</label>
            <select 
              v-model="selectedDevice" 
              class="filter-select"
              :disabled="isLoading"
            >
              <option :value="null">Selecciona un dispositivo</option>
              <option 
                v-for="device in devices" 
                :key="device.id" 
                :value="device.id"
              >
                {{ device.name }} ({{ device.serial }})
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Fecha Inicio</label>
            <input 
              v-model="startDate" 
              type="datetime-local" 
              class="filter-input"
              :disabled="isLoading"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Fecha Fin</label>
            <input 
              v-model="endDate" 
              type="datetime-local" 
              class="filter-input"
              :disabled="isLoading"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label" style="opacity: 0;">Acción</label>
            <button 
              class="btn-primary" 
              @click="loadHistory"
              :disabled="isLoading || !selectedDevice"
            >
              <span v-if="!isLoading">🔍 Buscar</span>
              <span v-else class="loading-dots">Buscando</span>
            </button>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-if="!historyData && !isLoading" class="info-card">
        <div class="info-icon">🗺️</div>
        <h3 class="info-title">Selecciona un dispositivo y rango de fechas</h3>
        <p class="info-text">Podrás ver la ruta completa en el mapa y las estadísticas del recorrido</p>
        <p class="info-tip">💡 Tip: Asegúrate de que el empleado haya enviado ubicaciones desde su dashboard</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-card">
        <div class="spinner"></div>
        <p>Cargando historial...</p>
      </div>

      <!-- History Data -->
      <div v-if="historyData && historyData.locations && historyData.locations.length > 0" class="history-content">
        <!-- Device Info Card -->
        <div class="device-info-card">
          <div class="device-header">
            <div class="device-icon">📱</div>
            <div class="device-details">
              <h2 class="device-name">{{ historyData.device.name }}</h2>
              <p class="device-user">
                <span class="user-icon">👤</span>
                Usuario: {{ historyData.device.user_name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-content">
              <div class="stat-value">{{ historyData.statistics.total_points }}</div>
              <div class="stat-label">Puntos Registrados</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🛣️</div>
            <div class="stat-content">
              <div class="stat-value">{{ historyData.statistics.distance_km }} km</div>
              <div class="stat-label">Distancia Recorrida</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ formatDuration(historyData.statistics.duration_minutes) }}</div>
              <div class="stat-label">Duración Total</div>
            </div>
          </div>
        </div>

        <!-- Route Map -->
        <div class="map-section">
          <div class="map-header">
            <h2 class="section-title">
              <span class="title-icon">🗺️</span>
              Ruta Recorrida
            </h2>
            <div class="map-legend">
              <div class="legend-item">
                <span class="legend-dot start"></span>
                <span class="legend-text">Inicio</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot end"></span>
                <span class="legend-text">Fin</span>
              </div>
            </div>
          </div>

          <div class="map-container">
            <RouteMapView 
              ref="routeMapRef"
              :locations="historyData.locations"
            />
          </div>
        </div>

        <!-- Locations List -->
        <div class="locations-section">
          <div class="locations-header">
            <h2 class="section-title">
              <span class="title-icon">📋</span>
              Detalle de Ubicaciones
            </h2>
            <div class="locations-badge">
              {{ historyData.locations.length }} puntos
            </div>
          </div>

          <div class="locations-list">
            <div 
              v-for="(location, index) in historyData.locations" 
              :key="index"
              class="location-item"
              :class="getLocationClass(index, historyData.locations.length)"
            >
              <div class="location-number" :class="getLocationNumberClass(index, historyData.locations.length)">
                {{ index + 1 }}
              </div>
              <div class="location-details">
                <div class="location-coords">
                  <span class="coord-label">📍</span>
                  <span class="coord-value">{{ location.latitude }}, {{ location.longitude }}</span>
                </div>
                <div class="location-meta">
                  <span class="meta-item">
                    <span class="meta-icon">🕐</span>
                    {{ formatDate(location.timestamp) }}
                  </span>
                  <span class="meta-item accuracy">
                    <span class="meta-icon">🎯</span>
                    {{ location.accuracy }}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Locations Found -->
      <div v-if="historyData && (!historyData.locations || historyData.locations.length === 0)" class="warning-card">
        <div class="warning-icon">⚠️</div>
        <h3 class="warning-title">No se encontraron ubicaciones</h3>
        <p class="warning-text">No hay registros GPS para este dispositivo en el rango de fechas seleccionado.</p>
        <div class="warning-tips">
          <p class="tips-title">💡 Asegúrate de que:</p>
          <ul class="tips-list">
            <li>El empleado haya activado el rastreo GPS</li>
            <li>Las fechas seleccionadas sean correctas</li>
            <li>El dispositivo esté asignado al usuario correcto</li>
          </ul>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import RouteMapView from '@/components/maps/RouteMapView.vue';
import { useDevicesStore } from '@/stores/devicesStore';
import { locationsService } from '@/services/locationsService';
import type { Device } from '@/types';

const devicesStore = useDevicesStore();

const devices = ref<Device[]>([]);
const selectedDevice = ref<number | null>(null);
const startDate = ref('');
const endDate = ref('');
const historyData = ref<any>(null);
const isLoading = ref(false);
const routeMapRef = ref<any>(null);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const formatDuration = (minutes: number) => {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} seg`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  
  return `${mins} min`;
};

const getLocationClass = (index: number, total: number) => {
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return '';
};

const getLocationNumberClass = (index: number, total: number) => {
  if (index === 0) return 'start';
  if (index === total - 1) return 'end';
  return 'middle';
};

const loadHistory = async () => {
  if (!selectedDevice.value || !startDate.value || !endDate.value) {
    alert('Por favor completa todos los campos');
    return;
  }

  isLoading.value = true;
  historyData.value = null;
  
  try {
    const data = await locationsService.getHistory({
      device_id: selectedDevice.value,
      start_date: startDate.value.replace('T', ' '),
      end_date: endDate.value.replace('T', ' ')
    });
    
    historyData.value = data;
    
    if (data.locations && data.locations.length > 0) {
      console.log(`✅ ${data.locations.length} ubicaciones encontradas`);
    }
  } catch (error: any) {
    console.error('Error al cargar historial:', error);
    alert(error.message || 'Error al cargar historial');
    historyData.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    // Load devices
    await devicesStore.fetchDevices();
    devices.value = devicesStore.devices;
    
    // Set default dates (today)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
    
    startDate.value = startOfDay.toISOString().slice(0, 16);
    endDate.value = endOfDay.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error loading devices:', error);
  }
});
</script>

<style scoped>
.route-history {
  max-width: 1440px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  margin-bottom: var(--space-2xl);
}

.hero-title {
  font-size: var(--font-size-4xl);
  color: var(--color-neon-green);
  margin-bottom: var(--space-sm);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* Filters Section */
.filters-section {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.filter-select,
.filter-input {
  padding: var(--space-md);
  background-color: var(--bg-primary);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-neon-green);
  box-shadow: 0 0 0 3px rgba(192, 241, 28, 0.1);
}

.filter-select:disabled,
.filter-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  padding: var(--space-md) var(--space-xl);
  background-color: var(--color-neon-green);
  color: var(--color-black);
  border: 2px solid var(--color-black);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  background-color: #d4ff3e;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-dots::after {
  content: '...';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

/* Info Card */
.info-card {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3xl);
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.info-icon {
  font-size: 64px;
  margin-bottom: var(--space-lg);
  opacity: 0.5;
}

.info-title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.info-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.info-tip {
  font-size: var(--font-size-sm);
  color: var(--color-neon-green);
  font-style: italic;
}

/* Loading Card */
.loading-card {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3xl);
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.loading-card p {
  color: var(--color-text-secondary);
  margin-top: var(--space-md);
}

/* Device Info Card */
.device-info-card {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.device-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.device-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(192, 241, 28, 0.1);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-neon-green);
}

.device-details {
  flex: 1;
}

.device-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
  margin-bottom: var(--space-xs);
}

.device-user {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.stat-card {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-base);
}

.stat-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 48px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Map Section */
.map-section {
  margin-bottom: var(--space-2xl);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
}

.title-icon {
  font-size: var(--font-size-3xl);
}

.map-legend {
  display: flex;
  gap: var(--space-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-black);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.legend-dot.start {
  background-color: #C0F11C;
}

.legend-dot.end {
  background-color: #FF4444;
}

.legend-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.map-container {
  height: 500px;
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.map-container:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-lg);
}

/* Locations Section */
.locations-section {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.locations-header {
  padding: var(--space-xl);
  border-bottom: 2px solid var(--border-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(192, 241, 28, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
}

.locations-badge {
  background-color: var(--color-neon-green);
  color: var(--color-black);
  font-weight: var(--font-bold);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  border: 2px solid var(--color-black);
}

.locations-list {
  max-height: 500px;
  overflow-y: auto;
  padding: var(--space-md);
}

.location-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: rgba(192, 241, 28, 0.03);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
  transition: all var(--transition-base);
}

.location-item:hover {
  background-color: rgba(192, 241, 28, 0.08);
  border-color: var(--border-hover);
  transform: translateX(4px);
}

.location-item.first {
  border-left: 4px solid #C0F11C;
}

.location-item.last {
  border-left: 4px solid #FF4444;
}

.location-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-size-base);
  border: 3px solid;
  flex-shrink: 0;
}

.location-number.start {
  background-color: rgba(192, 241, 28, 0.2);
  border-color: #C0F11C;
  color: #C0F11C;
}

.location-number.end {
  background-color: rgba(255, 68, 68, 0.2);
  border-color: #FF4444;
  color: #FF4444;
}

.location-number.middle {
  background-color: rgba(192, 241, 28, 0.1);
  border-color: var(--border-default);
  color: var(--color-text-secondary);
}

.location-details {
  flex: 1;
  min-width: 0;
}

.location-coords {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.coord-label {
  font-size: var(--font-size-lg);
}

.coord-value {
  font-family: monospace;
  font-weight: var(--font-medium);
}

.location-meta {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.meta-item {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.meta-item.accuracy {
  color: var(--color-neon-green);
  font-weight: var(--font-medium);
}

.meta-icon {
  font-size: var(--font-size-base);
}

/* Warning Card */
.warning-card {
  background-color: var(--bg-card);
  border: 2px solid #FFA726;
  border-radius: var(--radius-lg);
  padding: var(--space-3xl);
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.warning-icon {
  font-size: 64px;
  margin-bottom: var(--space-lg);
}

.warning-title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.warning-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
}

.warning-tips {
  background-color: rgba(255, 167, 38, 0.1);
  border: 1px solid #FFA726;
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.tips-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-bold);
  color: #FFA726;
  margin-bottom: var(--space-sm);
}

.tips-list {
  margin: 0;
  padding-left: var(--space-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.tips-list li {
  margin-bottom: var(--space-xs);
}

/* Responsive */
@media (max-width: 1366px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
