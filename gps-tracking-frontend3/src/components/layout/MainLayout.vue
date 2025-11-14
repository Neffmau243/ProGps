<template>
  <div class="main-layout">
    <!-- Navbar -->
    <NavBar />

    <!-- Sidebar -->
    <SideBar 
      v-if="authStore.isAuthenticated"
      @create-user="handleCreateUser"
      @create-device="handleCreateDevice"
    />

    <!-- Main Content Area -->
    <main class="main-content" :class="{ 'with-sidebar': authStore.isAuthenticated }">
      <div class="content-wrapper">
        <slot />
      </div>

      <!-- Footer -->
      <FooterBar />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import NavBar from './NavBar.vue';
import SideBar from './SideBar.vue';
import FooterBar from './FooterBar.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleCreateUser = () => {
  router.push('/admin/users?action=create');
};

const handleCreateDevice = () => {
  router.push('/admin/devices?action=create');
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.main-content {
  margin-top: var(--navbar-height);
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  flex-direction: column;
  transition: margin-left var(--transition-base);
}

.main-content.with-sidebar {
  margin-left: var(--sidebar-width);
}

.content-wrapper {
  flex: 1;
  padding: var(--space-xl);
  max-width: 100%;
}

/* Adjust for collapsed sidebar (will be handled by Sidebar component) */
@media (max-width: 768px) {
  .main-content.with-sidebar {
    margin-left: 0;
  }
}
</style>
