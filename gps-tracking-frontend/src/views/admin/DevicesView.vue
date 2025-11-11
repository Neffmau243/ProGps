<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-cellphone-link</v-icon>
            Gestión de Dispositivos
            <v-spacer />
            <v-btn color="primary" @click="openCreateDialog">
              <v-icon start>mdi-plus</v-icon>
              Crear Dispositivo
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="devices"
              :loading="loading"
              loading-text="Cargando dispositivos..."
            >
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.user="{ item }">
                {{ item.user?.name || 'Sin asignar' }}
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
          {{ editingDevice ? 'Editar Dispositivo' : 'Crear Dispositivo' }}
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="formData.name"
              label="Nombre"
              variant="outlined"
            />
            <v-text-field
              v-model="formData.serial"
              label="Serial"
              variant="outlined"
            />
            <v-select
              v-model="formData.user_id"
              :items="users"
              item-title="name"
              item-value="id"
              label="Usuario"
              variant="outlined"
            />
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="Estado"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveDevice" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de eliminar el dispositivo <strong>{{ deviceToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteDevice" :loading="deleting">Eliminar</v-btn>
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
const devices = ref<any[]>([])
const users = ref<any[]>([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editingDevice = ref<any>(null)
const deviceToDelete = ref<any>(null)
const saving = ref(false)
const deleting = ref(false)

const formData = ref({
  name: '',
  serial: '',
  user_id: null,
  status: 'activo'
})

const statusOptions = ['activo', 'inactivo', 'mantenimiento']

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Serial', key: 'serial' },
  { title: 'Usuario', key: 'user' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const getStatusColor = (status: string) => {
  const colors: any = {
    activo: 'success',
    inactivo: 'error',
    mantenimiento: 'warning'
  }
  return colors[status] || 'grey'
}

const loadDevices = async () => {
  loading.value = true
  try {
    const response = await api.get('/devices')
    devices.value = response.data
  } catch (error) {
    toast.error('Error al cargar dispositivos')
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data
  } catch (error) {
    toast.error('Error al cargar usuarios')
  }
}

const openCreateDialog = () => {
  editingDevice.value = null
  formData.value = {
    name: '',
    serial: '',
    user_id: null,
    status: 'activo'
  }
  dialog.value = true
}

const openEditDialog = (device: any) => {
  editingDevice.value = device
  formData.value = {
    name: device.name,
    serial: device.serial,
    user_id: device.user_id,
    status: device.status
  }
  dialog.value = true
}

const saveDevice = async () => {
  saving.value = true
  try {
    if (editingDevice.value) {
      await api.put(`/devices/${editingDevice.value.id}`, formData.value)
      toast.success('Dispositivo actualizado exitosamente')
    } else {
      await api.post('/devices', formData.value)
      toast.success('Dispositivo creado exitosamente')
    }
    dialog.value = false
    loadDevices()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error al guardar dispositivo')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (device: any) => {
  deviceToDelete.value = device
  deleteDialog.value = true
}

const deleteDevice = async () => {
  deleting.value = true
  try {
    await api.delete(`/devices/${deviceToDelete.value.id}`)
    toast.success('Dispositivo eliminado exitosamente')
    deleteDialog.value = false
    loadDevices()
  } catch (error) {
    toast.error('Error al eliminar dispositivo')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadDevices()
  loadUsers()
})
</script>
