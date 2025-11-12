<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    
    <v-main style="overflow-y: auto; height: 100vh;">
      <v-container fluid class="pa-4" style="padding-bottom: 80px;">
        <!-- Header con título y botón -->
        <div class="d-flex align-center mb-4">
          <div>
            <h1 class="text-h4 font-weight-bold">
              <v-icon size="large" color="primary" class="mr-2">mdi-cellphone-link</v-icon>
              Gestión de Dispositivos
            </h1>
            <p class="text-subtitle-1 text-grey mt-1">Administra los dispositivos GPS del sistema</p>
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
            Crear Dispositivo
          </v-btn>
        </div>

        <v-card elevation="8" class="data-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="devices"
              :loading="loading"
              loading-text="Cargando dispositivos..."
              class="elevation-0"
            >
              <template v-slot:item.status="{ item }">
                <v-chip 
                  :color="getStatusColor(item.status)" 
                  size="small"
                  variant="flat"
                >
                  <v-icon start size="small">mdi-circle</v-icon>
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.user="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-2">mdi-account</v-icon>
                  {{ item.user?.name || 'Sin asignar' }}
                </div>
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
          <v-icon class="mr-2" color="white">{{ editingDevice ? 'mdi-cellphone-edit' : 'mdi-cellphone-plus' }}</v-icon>
          <span class="text-h5 font-weight-bold">
            {{ editingDevice ? 'Editar Dispositivo' : 'Crear Nuevo Dispositivo' }}
          </span>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form>
            <v-text-field
              v-model="formData.name"
              label="Nombre del Dispositivo"
              variant="outlined"
              prepend-inner-icon="mdi-label-outline"
              color="primary"
              class="mb-2"
            />
            <v-text-field
              v-model="formData.serial"
              label="Número de Serie"
              variant="outlined"
              prepend-inner-icon="mdi-barcode"
              color="primary"
              hint="Debe ser único"
              persistent-hint
              class="mb-2"
            />
            <v-select
              v-model="formData.user_id"
              :items="users"
              item-title="name"
              item-value="id"
              label="Usuario Asignado"
              variant="outlined"
              prepend-inner-icon="mdi-account-outline"
              color="primary"
              hint="Opcional - Puedes asignar un usuario después"
              persistent-hint
              clearable
              class="mb-2"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon>mdi-account</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="Estado del Dispositivo"
              variant="outlined"
              prepend-inner-icon="mdi-information-outline"
              color="primary"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="getStatusColor(item.value)">mdi-circle</v-icon>
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
            @click="saveDevice" 
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
            ¿Estás seguro de eliminar el dispositivo <strong>{{ deviceToDelete?.name }}</strong>?
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
            @click="deleteDevice" 
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
    console.error('Error al guardar dispositivo:', error)
    
    // Manejar errores de validación
    if (error.response?.status === 422) {
      const errors = error.response?.data?.errors
      if (errors) {
        const errorMessages = Object.values(errors).flat().join(', ')
        toast.error(`Error de validación: ${errorMessages}`)
      } else {
        toast.error(error.response?.data?.message || 'Error de validación')
      }
    } else {
      toast.error(error.response?.data?.message || 'Error al guardar dispositivo')
    }
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
