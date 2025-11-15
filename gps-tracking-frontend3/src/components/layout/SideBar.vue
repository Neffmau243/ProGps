<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-content">
      <!-- Collapse Button -->
      <button class="collapse-btn" @click="toggleSidebar" title="Colapsar/Expandir">
        <i v-if="!isCollapsed" class="bi bi-chevron-left"></i>
        <i v-else class="bi bi-chevron-right"></i>
      </button>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <!-- Admin Menu -->
        <template v-if="authStore.isAdmin">
          <router-link to="/admin/dashboard" class="sidebar-item">
            <i class="bi bi-speedometer2 sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Dashboard</span>
          </router-link>

          <router-link to="/admin/users" class="sidebar-item">
            <i class="bi bi-people sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Usuarios</span>
          </router-link>

          <router-link to="/admin/devices" class="sidebar-item">
            <i class="bi bi-phone sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Dispositivos</span>
          </router-link>

          <router-link to="/admin/map" class="sidebar-item">
            <i class="bi bi-map sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Mapa en Vivo</span>
          </router-link>

          <router-link to="/admin/history" class="sidebar-item">
            <i class="bi bi-clock-history sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Historial</span>
          </router-link>

          <div v-if="!isCollapsed" class="sidebar-divider"></div>

          <router-link to="/profile" class="sidebar-item">
            <i class="bi bi-person sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Perfil</span>
          </router-link>
        </template>

        <!-- Employee Menu -->
        <template v-else-if="authStore.isEmployee">
          <router-link to="/employee/dashboard" class="sidebar-item">
            <i class="bi bi-speedometer2 sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Dashboard</span>
          </router-link>

          <router-link to="/employee/my-devices" class="sidebar-item">
            <i class="bi bi-phone sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Mis Dispositivos</span>
          </router-link>

          <div v-if="!isCollapsed" class="sidebar-divider"></div>

          <router-link to="/profile" class="sidebar-item">
            <i class="bi bi-person sidebar-icon"></i>
            <span v-if="!isCollapsed" class="sidebar-label">Perfil</span>
          </router-link>
        </template>
      </nav>

      <!-- Quick Actions (Admin Only) -->
      <div v-if="authStore.isAdmin && !isCollapsed" class="sidebar-quick-actions">
        <div class="quick-actions-title">Accesos Rápidos</div>
        <button class="quick-action-btn" @click="$emit('create-user')">
          <i class="bi bi-plus-circle quick-icon"></i>
          Nuevo Usuario
        </button>
        <button class="quick-action-btn" @click="$emit('create-device')">
          <i class="bi bi-plus-circle quick-icon"></i>
          Nuevo Dispositivo
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const isCollapsed = ref(false);

const emit = defineEmits(['create-user', 'create-device', 'toggle-collapse']);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse', isCollapsed.value);
};

// Emitir evento inicial
watch(() => isCollapsed.value, (value) => {
  emit('toggle-collapse', value);
}, { immediate: true });
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-default);
  transition: width var(--transition-base);
  z-index: 900;
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-md) 0;
}

/* Collapse Button */
.collapse-btn {
  align-self: flex-end;
  margin: 0 var(--space-md) var(--space-md);
  padding: var(--space-sm);
  background: none;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.collapse-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--color-neon-green);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: 0 var(--space-sm);
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  white-space: nowrap;
  position: relative;
}

.sidebar.collapsed .sidebar-item {
  justify-content: center;
}

.sidebar-item:hover {
  background-color: var(--bg-secondary);
  color: var(--color-text-primary);
}

.sidebar-item.router-link-active {
  background-color: var(--bg-secondary);
  color: var(--color-neon-green);
}

.sidebar-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background-color: var(--color-neon-green);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  box-shadow: var(--glow-neon);
}

.sidebar-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.sidebar-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-divider {
  height: 1px;
  background-color: var(--border-default);
  margin: var(--space-md) var(--space-md);
}

/* Quick Actions */
.sidebar-quick-actions {
  padding: var(--space-md);
  border-top: 1px solid var(--border-default);
}

.quick-actions-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-sm);
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-xs);
  background-color: var(--bg-secondary);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  text-align: left;
}

.quick-action-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--color-neon-green);
  border-color: var(--border-active);
}

.quick-icon {
  font-size: 16px;
}

/* Scrollbar for Sidebar */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--color-gray-darker);
  border-radius: var(--radius-full);
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--color-neon-green);
}

/* Responsive (future) */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
  }
}
</style>
