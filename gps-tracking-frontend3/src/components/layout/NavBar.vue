<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="navbar-logo">
        <span class="logo-text">Pro<span class="logo-gps">GPS</span></span>
      </div>

      <!-- Navigation Items (only for authenticated users) -->
      <div v-if="authStore.isAuthenticated" class="navbar-nav">
        <!-- Admin Navigation -->
        <template v-if="authStore.isAdmin">
          <router-link to="/admin/dashboard" class="nav-item">
            <span class="nav-icon">📊</span>
            Dashboard
          </router-link>
          <router-link to="/admin/users" class="nav-item">
            <span class="nav-icon">👥</span>
            Usuarios
          </router-link>
          <router-link to="/admin/devices" class="nav-item">
            <span class="nav-icon">📱</span>
            Dispositivos
          </router-link>
          <router-link to="/admin/map" class="nav-item">
            <span class="nav-icon">🗺️</span>
            Mapa en Vivo
          </router-link>
          <router-link to="/admin/history" class="nav-item">
            <span class="nav-icon">📍</span>
            Historial
          </router-link>
        </template>

        <!-- Employee Navigation -->
        <template v-else-if="authStore.isEmployee">
          <router-link to="/employee/dashboard" class="nav-item">
            <span class="nav-icon">📊</span>
            Dashboard
          </router-link>
          <router-link to="/employee/my-devices" class="nav-item">
            <span class="nav-icon">📱</span>
            Mis Dispositivos
          </router-link>
        </template>
      </div>

      <!-- Right Side Items -->
      <div v-if="authStore.isAuthenticated" class="navbar-right">
        <!-- Notifications (Future implementation) -->
        <button class="nav-notification" title="Notificaciones">
          <span class="notification-icon">🔔</span>
          <span class="notification-badge">3</span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="nav-user" @click="toggleUserMenu">
          <div class="user-avatar">{{ userInitial }}</div>
          <span class="user-name">{{ authStore.user?.name }}</span>
          <span class="dropdown-arrow">▼</span>

          <!-- Dropdown Menu -->
          <div v-if="showUserMenu" class="user-menu">
            <router-link to="/profile" class="menu-item" @click="showUserMenu = false">
              <span class="menu-icon">👤</span>
              Perfil
            </router-link>
            <button class="menu-item" @click="handleLogout">
              <span class="menu-icon">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const showUserMenu = ref(false);

const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U';
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  await authStore.logout();
  showUserMenu.value = false;
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-default);
  z-index: 1000;
}

.navbar-content {
  height: 100%;
  max-width: 100%;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
}

/* Logo */
.navbar-logo {
  flex-shrink: 0;
}

.logo-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  cursor: pointer;
}

.logo-gps {
  color: var(--color-neon-green);
}

/* Navigation Items */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  position: relative;
}

.nav-item:hover {
  color: var(--color-neon-green);
  background-color: var(--bg-secondary);
}

.nav-item.router-link-active {
  color: var(--color-neon-green);
  background-color: var(--bg-secondary);
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background-color: var(--color-neon-green);
  box-shadow: var(--glow-neon);
}

.nav-icon {
  font-size: var(--font-size-lg);
}

/* Right Side */
.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex-shrink: 0;
}

/* Notifications */
.nav-notification {
  position: relative;
  background: none;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.nav-notification:hover {
  background-color: var(--bg-secondary);
}

.notification-icon {
  font-size: var(--font-size-xl);
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: var(--color-neon-green);
  color: var(--color-black);
  font-size: var(--font-size-xs);
  font-weight: var(--font-bold);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
}

/* User Profile */
.nav-user {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.nav-user:hover {
  background-color: var(--bg-secondary);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-info));
  color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-size-base);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.dropdown-arrow {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  transition: transform var(--transition-base);
}

/* User Menu Dropdown */
.user-menu {
  position: absolute;
  top: calc(100% + var(--space-sm));
  right: 0;
  min-width: 200px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-sm);
  z-index: 1001;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-align: left;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  background: none;
}

.menu-item:hover {
  background-color: var(--bg-tertiary);
  color: var(--color-neon-green);
}

.menu-icon {
  font-size: var(--font-size-lg);
}

/* Responsive adjustments for smaller screens (future) */
@media (max-width: 768px) {
  .navbar-nav {
    display: none; /* Will be replaced with hamburger menu */
  }
  
  .user-name {
    display: none;
  }
}
</style>
