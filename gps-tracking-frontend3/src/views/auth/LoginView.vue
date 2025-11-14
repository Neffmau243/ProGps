<template>
  <div class="login-view">
    <div class="login-hero">
      <!-- Logo -->
      <div class="login-logo">
        <span class="logo-text">Pro<span class="logo-gps">GPS</span></span>
        <p class="logo-subtitle">Sistema de Rastreo GPS en Tiempo Real</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <h2 class="login-title">Iniciar Sesión</h2>
        <p class="login-subtitle">Ingrese sus credenciales para continuar</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email Input -->
          <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="correo@ejemplo.com"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn-login"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Ingresar</span>
            <span v-else class="spinner"></span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="demo-credentials">
          <p class="demo-title">Credenciales de Prueba:</p>
          <div class="demo-item">
            <strong>Admin:</strong> admin@gps.com / password
          </div>
          <div class="demo-item">
            <strong>Empleado:</strong> juan@gps.com / password
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="login-footer">
        <p>© {{ currentYear }} ProGPS - Sistema de Rastreo GPS</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const currentYear = computed(() => new Date().getFullYear());

const handleLogin = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    const success = await authStore.login({
      email: email.value,
      password: password.value,
    });

    if (success) {
      // Redirect based on role
      if (authStore.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } else {
      error.value = authStore.error || 'Error al iniciar sesión';
      console.error('Error details:', authStore.error);
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Error al iniciar sesión';
    console.error('Full error:', err.response?.data);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: var(--space-xl);
}

.login-hero {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

/* Logo */
.login-logo {
  text-align: center;
  animation: fadeInDown 0.6s ease;
}

.logo-text {
  font-size: 48px;
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-shadow: 0 0 30px rgba(192, 241, 28, 0.3);
}

.logo-gps {
  color: var(--color-neon-green);
  text-shadow: var(--glow-neon-strong);
}

.logo-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
}

/* Login Card */
.login-card {
  width: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-xl);
  animation: fadeInUp 0.6s ease;
}

.login-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.login-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--space-xl);
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 var(--space-md);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.form-input:focus {
  border-color: var(--border-active);
  box-shadow: var(--glow-neon);
  outline: none;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background-color: rgba(255, 59, 59, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.error-icon {
  font-size: var(--font-size-lg);
}

/* Login Button */
.btn-login {
  width: 100%;
  height: 48px;
  background-color: var(--color-neon-green);
  color: var(--color-black);
  font-size: var(--font-size-base);
  font-weight: var(--font-bold);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login:hover:not(:disabled) {
  box-shadow: var(--glow-neon-strong);
  transform: translateY(-2px);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Demo Credentials */
.demo-credentials {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-default);
}

.demo-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.demo-item {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  padding: var(--space-xs);
  text-align: center;
}

.demo-item strong {
  color: var(--color-neon-green);
}

/* Footer */
.login-footer {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  animation: fadeIn 0.8s ease 0.3s both;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .login-hero {
    max-width: 100%;
  }

  .login-card {
    padding: var(--space-xl);
  }

  .logo-text {
    font-size: 36px;
  }
}
</style>
