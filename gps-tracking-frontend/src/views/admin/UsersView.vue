<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main>
      <v-container fluid class="pa-4">
        <!-- Header con título y botón -->
        <div class="d-flex align-center mb-4">
          <div>
            <h1 class="text-h4 font-weight-bold">
              <v-icon size="large" color="primary" class="mr-2">mdi-account-multiple</v-icon>
              Gestión de Usuarios
            </h1>
            <p class="text-subtitle-1 text-grey mt-1">Administra los usuarios del sistema</p>
          </div>
          <v-spacer />
          <v-btn 
            color="primary" 
            @click="openCreateDialog"
            size="large"
            elevation="4"
            class="create-btn"
          >
            <v-icon start>mdi-plus-circle</v-icon>
            Crear Usuario
          </v-btn>
        </div>

        <v-card elevation="8" class="data-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              loading-text="Cargando usuarios..."
              class="elevation-0"
            >
              <template v-slot:item.role="{ item }">
                <v-chip 
                  :color="item.role.name === 'admin' ? 'primary' : 'secondary'" 
                  size="small"
                  variant="flat"
                >
                  <v-icon start size="small">{{ item.role.name === 'admin' ? 'mdi-shield-crown' : 'mdi-account' }}</v-icon>
                  {{ item.role.name }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn 
                  icon 
                  size="small" 
                  @click="openEditDialog(item)" 
                  class="mr-2"
                  variant="tonal"
                  color="primary"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="top">Editar</v-tooltip>
                </v-btn>
                <v-btn 
                  icon 
                  size="small" 
                  color="error" 
                  @click="confirmDelete(item)"
                  variant="tonal"
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Dialog Crear/Editar -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="modal-card" elevation="24">
        <v-card-title class="bg-gradient-primary text-white pa-6">
          <v-icon class="mr-2" color="white">{{ editingUser ? 'mdi-account-edit' : 'mdi-account-plus' }}</v-icon>
          <span class="text-h5 font-weight-bold">
            {{ editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
          </span>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="form">
            <v-text-field
              v-model="formData.name"
              label="Nombre Completo"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-account-outline"
              color="primary"
              class="mb-2"
            />
            <v-text-field
              v-model="formData.email"
              label="Correo Electrónico"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
              color="primary"
              class="mb-2"
            />
            <v-text-field
              v-model="formData.password"
              :label="editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'"
              type="password"
              :rules="editingUser ? [rules.minLengthOptional] : [rules.required, rules.minLength]"
              variant="outlined"
              prepend-inner-icon="mdi-lock-outline"
              color="primary"
              :hint="editingUser ? 'Dejar vacío para mantener la contraseña actual' : 'Mínimo 8 caracteres'"
              persistent-hint
              class="mb-2"
            />
            <v-select
              v-model="formData.role_id"
              :items="roles"
              item-title="name"
              item-value="id"
              label="Rol del Usuario"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-shield-account-outline"
              color="primary"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon>{{ item.raw.name === 'admin' ? 'mdi-shield-crown' : 'mdi-account' }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            @click="dialog = false" 
            size="large"
            variant="outlined"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            @click="saveUser" 
            :loading="saving"
            size="large"
            variant="flat"
          >
            <v-icon start>mdi-content-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card class="modal-card" elevation="24">
        <v-card-title class="bg-gradient-error text-white pa-6">
          <v-icon class="mr-2" color="white">mdi-alert-circle</v-icon>
          <span class="text-h5 font-weight-bold">Confirmar Eliminación</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-alert type="warning" variant="tonal" class="mb-4">
            <template v-slot:prepend>
              <v-icon>mdi-alert</v-icon>
            </template>
            Esta acción no se puede deshacer
          </v-alert>
          <p class="text-h6">
            ¿Estás seguro de eliminar al usuario <strong>{{ userToDelete?.name }}</strong>?
          </p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            @click="deleteDialog = false"
            size="large"
            variant="outlined"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn 
            color="error" 
            @click="deleteUser" 
            :loading="deleting"
            size="large"
            variant="flat"
          >
            <v-icon start>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const toast = useToast()
const users = ref<any[]>([])
const roles = ref([
  { id: 1, name: 'admin' },
  { id: 2, name: 'empleado' }
])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editingUser = ref<any>(null)
const userToDelete = ref<any>(null)
const saving = ref(false)
const deleting = ref(false)

const formData = ref({
  name: '',
  email: '',
  password: '',
  role_id: 2
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (v: string) => v.length >= 8 || 'Mínimo 8 caracteres',
  minLengthOptional: (v: string) => !v || v.length >= 8 || 'Mínimo 8 caracteres si se proporciona'
}

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await api.get('/users')
    users.value = response.data
  } catch (error) {
    toast.error('Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    role_id: 2
  }
  dialog.value = true
}

const openEditDialog = (user: any) => {
  editingUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    password: '',
    role_id: user.role_id
  }
  dialog.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    if (editingUser.value) {
      // Al editar, solo enviar password si no está vacío
      const dataToSend = { ...formData.value }
      if (!dataToSend.password) {
        delete dataToSend.password
      }
      await api.put(`/users/${editingUser.value.id}`, dataToSend)
      toast.success('Usuario actualizado exitosamente')
    } else {
      await api.post('/users', formData.value)
      toast.success('Usuario creado exitosamente')
    }
    dialog.value = false
    loadUsers()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error al guardar usuario')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user: any) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  deleting.value = true
  try {
    await api.delete(`/users/${userToDelete.value.id}`)
    toast.success('Usuario eliminado exitosamente')
    deleteDialog.value = false
    loadUsers()
  } catch (error) {
    toast.error('Error al eliminar usuario')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>


<style scoped>
.data-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.create-btn {
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.modal-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-error {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}
</style>
