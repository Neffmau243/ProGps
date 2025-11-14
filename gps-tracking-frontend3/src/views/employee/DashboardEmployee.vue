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
            <span class="gps-icon">📍</span>
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
          <div class="card-icon">📱</div>
          <div class="card-content">
            <h3 class="card-title">Dispositivo Activo</h3>
            <p class="card-value">{{ activeDevice || 'Ninguno' }}</p>
          </div>
        </div>

        <!-- Last Location Card -->
        <div class="status-card">
          <div class="card-icon">🗺️</div>
          <div class="card-content">
            <h3 class="card-title">Última Ubicación</h3>
            <p class="card-value">{{ lastLocation || 'Sin datos' }}</p>
          </div>
        </div>

        <!-- Tracking Time Card -->
        <div class="status-card">
          <div class="card-icon">⏱️</div>
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
          <p class="text-muted">Cargando dispositivos...</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';

const gpsActive = ref(false);
const isLoading = ref(false);
const activeDevice = ref('Dispositivo 001');
const lastLocation = ref('');
const trackingTime = ref('0h 0m');

const toggleGPS = async () => {
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    gpsActive.value = !gpsActive.value;
    if (gpsActive.value) {
      lastLocation.value = 'Actualizando...';
    }
    isLoading.value = false;
  }, 1000);
};
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
</style>
