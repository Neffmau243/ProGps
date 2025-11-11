<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-account-multiple</v-icon>
            Gestión de Usuarios
            <v-spacer />
            <v-btn color="primary" @click="openCreateDialog">
              <v-icon start>mdi-plus</v-icon>
              Crear Usuario
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              loading-text="Cargando usuarios..."
            >
              <template v-slot:item.role="{ item }">
                <v-chip :color="item.role.name === 'admin' ? 'primary' : 'secondary'" size="small">
                  {{ item.role.name }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn icon size="small" @click="openEditDialog(item)" class="mr-2">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon size="small" color="error" @click="confirmDelete(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Dialog Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingUser ? 'Editar Usuario' : 'Crear Usuario' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="formData.name"
              label="Nombre"
              :rules="[rules.required]"
              variant="outlined"
            />
            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
            />
            <v-text-field
              v-if="!editingUser"
              v-model="formData.password"
              label="Password"
              type="password"
              :rules="[rules.required, rules.minLength]"
              variant="outlined"
            />
            <v-select
              v-model="formData.role_id"
              :items="roles"
              item-title="name"
              item-value="id"
              label="Rol"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de eliminar al usuario <strong>{{ userToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteUser" :loading="deleting">Eliminar</v-btn>
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
  minLength: (v: string) => v.length >= 8 || 'Mínimo 8 caracteres'
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
      await api.put(`/users/${editingUser.value.id}`, formData.value)
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
