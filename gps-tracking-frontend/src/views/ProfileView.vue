<template>
  <v-app>
    <AppHeader />
    <AppSidebar v-if="authStore.isAdmin" />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-account</v-icon>
                Mi Perfil
              </v-card-title>

              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="formData.name"
                    label="Nombre"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                  />

                  <v-text-field
                    v-model="formData.email"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                  />

                  <v-text-field
                    :value="authStore.user?.role"
                    label="Rol"
                    prepend-inner-icon="mdi-shield-account"
                    variant="outlined"
                    readonly
                  />

                  <v-divider class="my-4" />

                  <h3 class="mb-4">Cambiar Contraseña</h3>

                  <v-text-field
                    v-model="formData.current_password"
                    label="Contraseña Actual"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                  />

                  <v-text-field
                    v-model="formData.new_password"
                    label="Nueva Contraseña"
                    type="password"
                    prepend-inner-icon="mdi-lock-reset"
                    variant="outlined"
                  />

                  <v-text-field
                    v-model="formData.confirm_password"
                    label="Confirmar Contraseña"
                    type="password"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                  />

                  <v-btn
                    color="primary"
                    size="large"
                    block
                    @click="saveProfile"
                    :loading="saving"
                  >
                    Guardar Cambios
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const authStore = useAuthStore()
const toast = useToast()
const saving = ref(false)

const formData = ref({
  name: '',
  email: '',
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const saveProfile = () => {
  if (formData.value.new_password && formData.value.new_password !== formData.value.confirm_password) {
    toast.error('Las contraseñas no coinciden')
    return
  }

  toast.success('Perfil actualizado (funcionalidad pendiente)')
}

onMounted(() => {
  if (authStore.user) {
    formData.value.name = authStore.user.name
    formData.value.email = authStore.user.email
  }
})
</script>
