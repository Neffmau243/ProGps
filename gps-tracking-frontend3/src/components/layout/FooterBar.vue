<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Column 1: Branding -->
      <div class="footer-column">
        <div class="footer-logo">
          <span class="logo-text">Pro<span class="logo-gps">GPS</span></span>
        </div>
        <p class="footer-copyright">
          © {{ currentYear }} ProGPS - Todos los derechos reservados
        </p>
      </div>

      <!-- Column 2: Legal Links -->
      <div class="footer-column footer-center">
        <a href="#" class="footer-link">Términos de Uso</a>
        <a href="#" class="footer-link">Política de Privacidad</a>
        <a href="#" class="footer-link">Ayuda</a>
        <a href="#" class="footer-link" v-if="authStore.isAdmin">Documentación API</a>
      </div>

      <!-- Column 3: Contact & Info -->
      <div class="footer-column footer-right">
        <p class="footer-info">Versión 2.0.0</p>
        <a href="mailto:support@progps.com" class="footer-link">
          📧 Soporte: support@progps.com
        </a>
        <a href="https://github.com" target="_blank" class="footer-link">
          🌐 GitHub
        </a>
        <p class="footer-info">Desarrollado por Neffmau</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-default);
  padding: var(--space-lg) var(--space-xl);
  margin-top: auto;
}

.footer-content {
  max-width: var(--max-content-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  align-items: start;
}

/* Columns */
.footer-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-center {
  align-items: center;
  text-align: center;
}

.footer-right {
  align-items: flex-end;
  text-align: right;
}

/* Logo */
.footer-logo {
  margin-bottom: var(--space-sm);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.logo-gps {
  color: var(--color-neon-green);
}

/* Text Styles */
.footer-copyright,
.footer-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.footer-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  display: inline-block;
}

.footer-link:hover {
  color: var(--color-neon-green);
  text-shadow: var(--glow-neon);
}

/* Responsive for smaller screens (future) */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-right {
    grid-column: 1 / -1;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-column {
    align-items: center;
  }

  .footer-center,
  .footer-right {
    align-items: center;
    text-align: center;
  }
}
</style>
