<template>
  <MainLayout>
    <div class="dashboard-admin">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">Dashboard Administrador</h1>
        <p class="hero-subtitle">Vista General del Sistema GPS en Tiempo Real</p>

        <!-- Statistics Cards -->
        <div v-if="isLoading" class="stats-grid">
          <div v-for="i in 4" :key="i" class="stat-card loading">
            <div class="spinner"></div>
          </div>
        </div>

        <div v-else class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalUsers }}</div>
              <div class="stat-label">Usuarios</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📱</div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalDevices }}</div>
              <div class="stat-label">Dispositivos</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-content">
              <div class="stat-value">{{ currentLocations.length }}</div>
              <div class="stat-label">Ubicaciones</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.activeDevices }}</div>
              <div class="stat-label">Activos</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <div class="map-header">
          <h2 class="section-title">
            <span class="title-icon">🗺️</span>
            Ubicaciones en Tiempo Real
          </h2>
          <div class="map-header-right">
            <div 
              class="ws-status" 
              :class="{ connected: wsConnected, disconnected: !wsConnected }"
            >
              <span class="ws-dot"></span>
              <span class="ws-text">
                {{ wsConnected ? '🔌 WebSocket Activo' : '⏳ Conectando...' }}
              </span>
            </div>
            <div class="locations-badge">
              <span class="badge-icon">📍</span>
              <span class="badge-count">{{ currentLocations.length }}</span>
            </div>
          </div>
        </div>

        <div class="map-grid">
          <!-- Mapa -->
          <div class="map-container-wrapper">
            <MapView 
              v-if="currentLocations.length > 0" 
              :locations="currentLocations"
            />
            <div v-else class="map-placeholder">
              <div class="placeholder-content">
                <span class="placeholder-icon">📍</span>
                <h3>Sin Ubicaciones</h3>
                <p>No hay dispositivos reportando ubicación en este momento</p>
              </div>
            </div>
          </div>

          <!-- Panel lateral - Dispositivos activos -->
          <div class="devices-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <span class="panel-icon">📱</span>
                Dispositivos Activos
              </h3>
              <div class="panel-badge">{{ currentLocations.length }}</div>
            </div>

            <div class="devices-list">
              <div 
                v-for="location in currentLocations" 
                :key="location.device_id"
                class="device-item"
              >
                <div class="device-avatar" :class="getTimeColorClass(location.minutes_ago)">
                  <span class="avatar-icon">📍</span>
                </div>
                <div class="device-info">
                  <div class="device-name">{{ location.device_name }}</div>
                  <div class="device-user">
                    <span class="user-icon">👤</span>
                    {{ location.user_name }}
                  </div>
                </div>
                <div class="device-time">
                  <div 
                    class="time-badge" 
                    :class="getTimeColorClass(location.minutes_ago)"
                  >
                    <span class="time-icon">🕐</span>
                    {{ formatTimeAgo(location.minutes_ago) }}
                  </div>
                </div>
              </div>

              <div v-if="currentLocations.length === 0" class="no-devices">
                <span class="no-devices-icon">ℹ️</span>
                <p>No hay dispositivos activos en este momento</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <h2 class="section-title">
          <span class="title-icon">⚡</span>
          Acciones Rápidas
        </h2>
        <div class="quick-actions">
          <router-link to="/admin/users" class="action-btn">
            <span class="action-icon">👥</span>
            <span class="action-label">Gestionar Usuarios</span>
          </router-link>
          <router-link to="/admin/devices" class="action-btn">
            <span class="action-icon">📱</span>
            <span class="action-label">Gestionar Dispositivos</span>
          </router-link>
          <router-link to="/admin/history" class="action-btn">
            <span class="action-icon">📍</span>
            <span class="action-label">Ver Historial</span>
          </router-link>
          <router-link to="/profile" class="action-btn">
            <span class="action-icon">�</span>
            <span class="action-label">Mi Perfil</span>
          </router-link>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import MapView from '@/components/maps/MapView.vue';
import { useUsersStore } from '@/stores/usersStore';
import { useDevicesStore } from '@/stores/devicesStore';
import { locationsService } from '@/services/locationsService';

const usersStore = useUsersStore();
const devicesStore = useDevicesStore();
const isLoading = ref(true);
const currentLocations = ref<any[]>([]);
const wsConnected = ref(false);

const statistics = computed(() => {
  const users = usersStore.users;
  const devices = devicesStore.devices;
  
  // Contar dispositivos realmente activos (con ubicación reciente, < 5 minutos)
  const recentlyActive = currentLocations.value.filter(
    loc => !loc.minutes_ago || loc.minutes_ago < 5
  ).length;

  return {
    totalUsers: users.length,
    totalDevices: devices.length,
    activeDevices: recentlyActive, // Dispositivos con ubicación reciente
  };
});

const getTimeColorClass = (minutes?: number) => {
  if (!minutes || minutes < 2) return 'time-success';
  if (minutes < 5) return 'time-warning';
  return 'time-error';
};

const formatTimeAgo = (minutes?: number) => {
  if (!minutes || minutes < 1) return 'Ahora';
  
  const mins = Math.round(minutes);
  if (mins < 60) return `${mins}m`;
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  if (hours < 24) {
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

const loadLocations = async () => {
  try {
    const locations = await locationsService.getCurrentLocations();
    currentLocations.value = locations;
    console.log('📍 Ubicaciones cargadas:', locations.length);
  } catch (error) {
    console.error('Error al cargar ubicaciones:', error);
  }
};

// Simular WebSocket conectado (por ahora)
// TODO: Implementar WebSocket real con Reverb
const startWebSocketSimulation = () => {
  // Simular conexión después de 1 segundo
  setTimeout(() => {
    wsConnected.value = true;
    console.log('✅ WebSocket simulado conectado');
  }, 1000);

  // Actualizar ubicaciones cada 30 segundos
  setInterval(async () => {
    await loadLocations();
  }, 30000);
};

onMounted(async () => {
  console.log('🚀 Iniciando Dashboard Admin');
  
  try {
    isLoading.value = true;
    await Promise.all([
      usersStore.fetchUsers(),
      devicesStore.fetchDevices(),
      loadLocations(),
    ]);

    // Iniciar simulación de WebSocket
    startWebSocketSimulation();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  wsConnected.value = false;
});
</script>

<style scoped>
.dashboard-admin {
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
  margin-bottom: var(--space-xl);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.stat-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
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

.stat-card.loading {
  justify-content: center;
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

.map-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
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

/* WebSocket Status */
.ws-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  transition: all var(--transition-base);
}

.ws-status.connected {
  border-color: var(--color-active);
  background-color: rgba(192, 241, 28, 0.1);
}

.ws-status.disconnected {
  border-color: var(--color-maintenance);
  background-color: rgba(255, 193, 7, 0.1);
}

.ws-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-maintenance);
  animation: pulse 2s infinite;
}

.ws-status.connected .ws-dot {
  background-color: var(--color-active);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.ws-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

/* Locations Badge */
.locations-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-neon-green);
  color: var(--color-black);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  border: 2px solid var(--color-black);
}

.badge-icon {
  font-size: var(--font-size-lg);
}

.badge-count {
  font-size: var(--font-size-base);
}

/* Map Grid */
.map-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-lg);
  height: 600px;
}

.map-container-wrapper {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.map-container-wrapper:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-lg);
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card);
}

.placeholder-content {
  text-align: center;
  padding: var(--space-2xl);
}

.placeholder-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-lg);
  opacity: 0.3;
}

.placeholder-content h3 {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.placeholder-content p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

/* Devices Panel */
.devices-panel {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: var(--space-lg);
  border-bottom: 2px solid var(--border-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(192, 241, 28, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
}

.panel-icon {
  font-size: var(--font-size-xl);
}

.panel-badge {
  background-color: var(--color-neon-green);
  color: var(--color-black);
  font-weight: var(--font-bold);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  border: 2px solid var(--color-black);
}

/* Devices List */
.devices-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-sm);
}

.device-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: rgba(192, 241, 28, 0.03);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
  transition: all var(--transition-base);
}

.device-item:hover {
  background-color: rgba(192, 241, 28, 0.08);
  border-color: var(--border-hover);
  transform: translateX(4px);
}

.device-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 3px solid;
  flex-shrink: 0;
}

.device-avatar.time-success {
  background-color: rgba(192, 241, 28, 0.2);
  border-color: var(--color-active);
}

.device-avatar.time-warning {
  background-color: rgba(255, 193, 7, 0.2);
  border-color: var(--color-maintenance);
}

.device-avatar.time-error {
  background-color: rgba(220, 53, 69, 0.2);
  border-color: var(--color-inactive);
}

.device-info {
  flex: 1;
  min-width: 0;
}

.device-name {
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-user {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.user-icon {
  font-size: var(--font-size-sm);
}

.device-time {
  flex-shrink: 0;
}

.time-badge {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  border: 2px solid;
}

.time-badge.time-success {
  background-color: rgba(192, 241, 28, 0.2);
  border-color: var(--color-active);
  color: var(--color-active);
}

.time-badge.time-warning {
  background-color: rgba(255, 193, 7, 0.2);
  border-color: var(--color-maintenance);
  color: var(--color-maintenance);
}

.time-badge.time-error {
  background-color: rgba(220, 53, 69, 0.2);
  border-color: var(--color-inactive);
  color: var(--color-inactive);
}

.time-icon {
  font-size: var(--font-size-sm);
}

.no-devices {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--color-text-muted);
}

.no-devices-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-md);
  opacity: 0.3;
}

.no-devices p {
  font-size: var(--font-size-sm);
}

/* Section */
.section {
  margin-bottom: var(--space-2xl);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-base);
}

.action-btn:hover {
  border-color: var(--color-neon-green);
  background-color: rgba(192, 241, 28, 0.05);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.action-icon {
  font-size: 48px;
}

.action-label {
  font-size: var(--font-size-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  text-align: center;
}

/* Responsive */
@media (max-width: 1366px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .map-grid {
    grid-template-columns: 1fr 350px;
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .map-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .map-container-wrapper {
    height: 500px;
  }

  .devices-panel {
    height: 400px;
  }
}
</style>


<style scoped>
.dashboard-admin {
  max-width: 1440px;
  margin: 0 auto;
}

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
  margin-bottom: var(--space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.stat-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
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

.section {
  margin-bottom: var(--space-2xl);
}

.section-title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.map-container {
  height: 600px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
