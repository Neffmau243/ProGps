<template>
  <v-footer 
    app
    class="app-footer"
    :class="{ 'dark-footer': themeStore.isDark }"
    elevation="8"
  >
    <v-container fluid>
      <v-row align="center" justify="center">
        <!-- Información de copyright -->
        <v-col cols="12" md="4" class="text-center text-md-left">
          <div class="footer-text">
            <v-icon size="small" class="mr-1">mdi-copyright</v-icon>
            <strong>{{ currentYear }} ProGPS</strong>
          </div>
          <div class="footer-subtitle">
            Sistema de Rastreo GPS en Tiempo Real
          </div>
        </v-col>

        <!-- Enlaces rápidos -->
        <v-col cols="12" md="4" class="text-center">
          <div class="footer-links">
            <v-btn
              v-for="link in quickLinks"
              :key="link.to"
              :to="link.to"
              variant="text"
              size="small"
              class="mx-1"
            >
              <v-icon start size="small">{{ link.icon }}</v-icon>
              {{ link.text }}
            </v-btn>
          </div>
        </v-col>

        <!-- Información de versión y contacto -->
        <v-col cols="12" md="4" class="text-center text-md-right">
          <div class="footer-text">
            <v-chip size="small" color="primary" variant="flat">
              <v-icon start size="small">mdi-rocket-launch</v-icon>
              Versión {{ version }}
            </v-chip>
          </div>
          <div class="footer-subtitle mt-2">
            <v-icon size="small" class="mr-1">mdi-email</v-icon>
            soporte@progps.com
          </div>
        </v-col>
      </v-row>

      <!-- Barra de tecnologías -->
      <v-divider class="my-3" />
      
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <div class="footer-tech">
            <v-chip
              v-for="tech in technologies"
              :key="tech.name"
              size="x-small"
              variant="outlined"
              class="mx-1 my-1"
            >
              <v-icon start size="x-small">{{ tech.icon }}</v-icon>
              {{ tech.name }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const themeStore = useThemeStore()
const authStore = useAuthStore()

const currentYear = computed(() => new Date().getFullYear())
const version = '1.0.0'

const quickLinks = computed(() => {
  const links = [
    { to: '/about', text: 'Acerca de', icon: 'mdi-information' }
  ]
  
  if (authStore.isAuthenticated) {
    links.unshift({ to: '/profile', text: 'Perfil', icon: 'mdi-account' })
  }
  
  return links
})

const technologies = [
  { name: 'Vue 3', icon: 'mdi-vuejs' },
  { name: 'TypeScript', icon: 'mdi-language-typescript' },
  { name: 'Vuetify', icon: 'mdi-material-design' },
  { name: 'Laravel', icon: 'mdi-laravel' },
  { name: 'Leaflet', icon: 'mdi-map' },
  { name: 'MySQL', icon: 'mdi-database' }
]
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  padding: 16px 0;
  margin-top: auto;
}

.dark-footer {
  background: linear-gradient(135deg, #434343 0%, #000000 100%);
}

.footer-text {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-md-left .footer-text {
  justify-content: flex-start;
}

.text-md-right .footer-text {
  justify-content: flex-end;
}

.footer-subtitle {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.footer-tech {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

:deep(.v-btn) {
  color: white !important;
  text-transform: none;
}

:deep(.v-btn:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.v-chip) {
  color: white !important;
}

:deep(.v-divider) {
  border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 960px) {
  .footer-text {
    justify-content: center !important;
  }
  
  .footer-links {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
