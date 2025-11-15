<template>
  <MainLayout>
    <div class="dashboard-employee">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">Dashboard Empleado</h1>
        <p class="hero-subtitle">Control de Rastreo GPS</p>

        <!-- GPS Toggle - Main Feature -->
        <div class="gps-toggle-container">
          <button 
            class="gps-toggle-btn"
            :class="{ active: gpsActive }"
            @click="toggleGPS"
            :disabled="isLoading"
          >
            <i class="bi bi-geo-alt gps-icon"></i>
            <span class="gps-status">{{ gpsActive ? 'GPS ACTIVO' : 'GPS INACTIVO' }}</span>
            <span v-if="gpsActive" class="pulse-indicator"></span>
          </button>

          <p class="gps-info">
            {{ gpsActive ? 'El rastreo GPS está activo' : 'Presiona para activar el rastreo GPS' }}
          </p>
        </div>
      </div>

      <!-- Status Cards -->
      <div class="status-grid">
        <!-- Active Device Card -->
        <div class="status-card">
          <i class="bi bi-phone card-icon"></i>
          <div class="card-content">
            <h3 class="card-title">Dispositivo Activo</h3>
            <p class="card-value">{{ activeDevice || 'Ninguno' }}</p>
          </div>
        </div>

        <!-- Last Location Card -->
        <div class="status-card">
          <i class="bi bi-map card-icon"></i>
          <div class="card-content">
            <h3 class="card-title">Última Ubicación</h3>
            <p class="card-value">{{ lastLocationText }}</p>
          </div>
        </div>

        <!-- Tracking Time Card -->
        <div class="status-card">
          <i class="bi bi-stopwatch card-icon"></i>
          <div class="card-content">
            <h3 class="card-title">Tiempo de Rastreo</h3>
            <p class="card-value">{{ trackingTime }}</p>
          </div>
        </div>
      </div>

      <!-- My Devices Preview -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Mis Dispositivos</h2>
          <router-link to="/employee/my-devices" class="btn-secondary">
            Ver Todos
          </router-link>
        </div>

        <div class="devices-preview">
          <div v-if="devices.length === 0" class="text-muted">
            No tienes dispositivos asignados
          </div>
          <div v-else class="devices-grid">
            <div 
              v-for="device in devices.slice(0, 3)" 
              :key="device.id"
              class="device-preview-card"
              :class="{ active: device.id === selectedDeviceId }"
            >
              <i class="bi bi-phone device-icon"></i>
              <div class="device-info">
                <h4>{{ device.name }}</h4>
                <p class="device-serial">{{ device.serial }}</p>
                <span 
                  class="device-status-badge"
                  :class="device.status"
                >
                  {{ device.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import gpsService from '@/services/gpsService';
import { useDevicesStore } from '@/stores/devicesStore';

const devicesStore = useDevicesStore();

const gpsActive = ref(false);
const isLoading = ref(false);
const lastLocation = ref<any>(null);
const trackingTime = ref('0h 0m');
const trackingStartTime = ref<Date | null>(null);
const devices = ref<any[]>([]);
const selectedDeviceId = ref<number | null>(null);
const intervalSeconds = ref(30);

const activeDevice = computed(() => {
  const device = devices.value.find(d => d.id === selectedDeviceId.value);
  return device ? device.name : 'Sin dispositivo';
});

const lastLocationText = computed(() => {
  if (!lastLocation.value) return 'Sin datos';
  return `${lastLocation.value.latitude.toFixed(6)}, ${lastLocation.value.longitude.toFixed(6)}`;
});

const loadDevices = async () => {
  try {
    await devicesStore.fetchDevices();
    devices.value = devicesStore.devices;
    
    if (devices.value.length > 0) {
      selectedDeviceId.value = devices.value[0].id;
    }
  } catch (error) {
    console.error('Error al cargar dispositivos:', error);
  }
};

const updateTrackingTime = () => {
  if (trackingStartTime.value && gpsActive.value) {
    const diff = Date.now() - trackingStartTime.value.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    trackingTime.value = `${hours}h ${minutes}m`;
  }
};

const toggleGPS = async () => {
  if (!gpsService.isSupported()) {
    alert('Tu navegador no soporta geolocalización');
    return;
  }

  if (!selectedDeviceId.value) {
    alert('No tienes un dispositivo asignado');
    return;
  }

  const device = devices.value.find(d => d.id === selectedDeviceId.value);
  if (device && device.status !== 'activo') {
    alert('Tu dispositivo no está activo');
    return;
  }

  isLoading.value = true;

  try {
    if (gpsActive.value) {
      gpsService.stopTracking();
      gpsActive.value = false;
      trackingStartTime.value = null;
      console.log('🛑 Rastreo detenido');
    } else {
      gpsService.startTracking(selectedDeviceId.value, intervalSeconds.value);
      gpsActive.value = true;
      trackingStartTime.value = new Date();
      console.log('▶️ Rastreo iniciado');
    }
  } catch (error: any) {
    console.error('Error al cambiar estado GPS:', error);
    alert(error.message || 'Error al cambiar estado del GPS');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadDevices();

  gpsService.onSuccess((location) => {
    lastLocation.value = location;
    console.log('✅ Callback: Ubicación actualizada en UI');
  });

  gpsService.onError((error) => {
    console.error('❌ Callback: Error GPS:', error);
    alert(`Error GPS: ${error}`);
  });

  // Actualizar tiempo de rastreo cada minuto
  setInterval(updateTrackingTime, 60000);
});

onBeforeUnmount(() => {
  if (gpsActive.value) {
    gpsService.stopTracking();
  }
});
</script>

<style scoped>
.dashboard-employee {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: var(--space-3xl) 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
}

.hero-title {
  font-size: var(--font-size-4xl);
  color: var(--color-neon-green);
  margin-bottom: var(--space-sm);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2xl);
}

/* GPS Toggle */
.gps-toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.gps-toggle-btn {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: var(--bg-tertiary);
  border: 4px solid var(--border-default);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.gps-toggle-btn.active {
  background-color: var(--color-neon-green);
  border-color: var(--color-neon-green);
  box-shadow: var(--glow-neon-strong);
}

.gps-toggle-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.gps-toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gps-icon {
  font-size: 64px;
}

.gps-status {
  font-size: var(--font-size-base);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.gps-toggle-btn.active .gps-status {
  color: var(--color-black);
}

.pulse-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid var(--color-neon-green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.gps-info {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.status-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-base);
}

.status-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xs);
}

.card-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
}

/* Section */
.section {
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
}

.devices-preview {
  padding: var(--space-2xl);
  text-align: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  text-align: left;
}

.device-preview-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.device-preview-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.device-preview-card.active {
  border-color: var(--color-neon-green);
  box-shadow: var(--glow-neon-subtle);
}

.device-icon {
  font-size: 36px;
}

.device-info h4 {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.device-serial {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
}

.device-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.device-status-badge.activo {
  background-color: rgba(192, 241, 28, 0.2);
  color: var(--color-neon-green);
}

.device-status-badge.inactivo {
  background-color: rgba(255, 0, 0, 0.2);
  color: #ff4444;
}

.device-status-badge.mantenimiento {
  background-color: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.text-muted {
  color: var(--color-text-muted);
}
</style>
