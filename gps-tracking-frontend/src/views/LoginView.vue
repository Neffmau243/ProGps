<template>
  <v-app>
    <v-main class="login-background">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5" lg="4">
            <!-- Logo y Título -->
            <div class="text-center mb-8 animate-fade-in">
              <div class="logo-container">
                <SolarIcon name="map-point-wave" :size="80" style="linear" class="logo-icon" />
              </div>
              <h1 class="text-h3 font-weight-bold text-white mt-4 text-shadow">GPS Tracking</h1>
              <p class="text-subtitle-1 text-white-70 mt-2">Sistema de Rastreo en Tiempo Real</p>
            </div>

            <!-- Card de Login -->
            <v-card elevation="24" class="login-card animate-slide-up" rounded="xl">
              <v-card-text class="pa-8">
                <h2 class="text-h5 font-weight-bold text-center mb-6">Iniciar Sesión</h2>
                
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="email"
                    label="Correo Electrónico"
                    type="email"
                    variant="outlined"
                    :error-messages="errors.email"
                    color="primary"
                    class="mb-2"
                    required
                    density="comfortable"
                  >
                    <template #prepend-inner>
                      <SolarIcon name="letter" :size="20" class="mr-1" />
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    :error-messages="errors.password"
                    color="primary"
                    class="mb-4"
                    required
                    density="comfortable"
                  >
                    <template #prepend-inner>
                      <SolarIcon name="lock-password" :size="20" class="mr-1" />
                    </template>
                    <template #append-inner>
                      <SolarIcon 
                        :name="showPassword ? 'eye' : 'eye-closed'" 
                        :size="20" 
                        @click="showPassword = !showPassword"
                        style="cursor: pointer;"
                      />
                    </template>
                  </v-text-field>

                  <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
                    <template v-slot:prepend>
                      <SolarIcon name="danger-triangle" :size="24" />
                    </template>
                    {{ errorMessage }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    :loading="loading"
                    class="mb-4 text-none font-weight-bold"
                    elevation="2"
                  >
                    <SolarIcon name="login" :size="20" class="mr-2" />
                    Iniciar Sesión
                  </v-btn>
                </v-form>

                <v-divider class="my-4" />

                <div class="text-center">
                  <ThemeToggle />
                </div>
              </v-card-text>
            </v-card>

            <!-- Credenciales de Prueba -->
            <v-card class="mt-4 animate-fade-in-delay" variant="tonal" rounded="lg">
              <v-card-text class="pa-4">
                <div class="text-center mb-2">
                  <SolarIcon name="info-circle" :size="20" class="text-info" />
                  <span class="text-subtitle-2 font-weight-bold ml-2">Credenciales de Prueba</span>
                </div>
                <v-row dense>
                  <v-col cols="6">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey">Administrador</div>
                      <div class="text-body-2 font-weight-bold">admin@gps.com</div>
                      <div class="text-caption">admin123</div>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey">Empleado</div>
                      <div class="text-body-2 font-weight-bold">juan@gps.com</div>
                      <div class="text-caption">empleado123</div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import SolarIcon from '@/components/SolarIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({ email: '', password: '' })

const handleLogin = async () => {
  errors.value = { email: '', password: '' }
  errorMessage.value = ''

  if (!email.value) {
    errors.value.email = 'El email es requerido'
    return
  }

  if (!password.value) {
    errors.value.password = 'El password es requerido'
    return
  }

  loading.value = true

  try {
    await authStore.login(email.value, password.value)
    toast.success('¡Bienvenido!')
    
    if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    } else {
      router.push('/empleado/dashboard')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.logo-container {
  display: inline-block;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.text-shadow {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.9);
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.v-theme--dark .login-card {
  background: rgba(30, 30, 30, 0.95) !important;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fill-height {
  min-height: 100vh;
}
</style>
