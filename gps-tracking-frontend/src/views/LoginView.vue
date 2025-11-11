<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card elevation="12" class="pa-4">
              <v-card-title class="text-center">
                <v-icon size="64" color="primary" class="mb-4">mdi-map-marker-radius</v-icon>
                <h2>GPS Tracking</h2>
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    :error-messages="errors.email"
                    required
                  />

                  <v-text-field
                    v-model="password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    :error-messages="errors.password"
                    required
                  />

                  <v-alert v-if="errorMessage" type="error" class="mb-4">
                    {{ errorMessage }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                  >
                    Iniciar Sesión
                  </v-btn>
                </v-form>
              </v-card-text>

              <v-card-actions class="justify-center">
                <ThemeToggle />
              </v-card-actions>
            </v-card>

            <v-card class="mt-4 pa-4" variant="outlined">
              <v-card-title class="text-center text-subtitle-2">
                Credenciales de Prueba
              </v-card-title>
              <v-card-text class="text-caption">
                <p><strong>Admin:</strong> admin@gps.com / admin123</p>
                <p><strong>Empleado:</strong> juan@gps.com / empleado123</p>
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
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
