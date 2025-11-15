<template>
  <MainLayout>
    <div class="devices-management">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-header">
          <div>
            <h1 class="hero-title">Gestión de Dispositivos</h1>
            <p class="hero-subtitle">Administra todos los dispositivos GPS del sistema</p>
          </div>
          <button class="btn-primary" @click="openCreateModal">
            <i class="bi bi-plus-circle btn-icon"></i>
            Crear Dispositivo
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o serial..."
            class="search-input"
          />
        </div>
        
        <div class="filter-buttons">
          <button 
            class="filter-btn"
            :class="{ active: filterStatus === null }"
            @click="filterStatus = null"
          >
            Todos ({{ devices.length }})
          </button>
          <button 
            class="filter-btn status-active"
            :class="{ active: filterStatus === 'activo' }"
            @click="filterStatus = 'activo'"
          >
            ● Activos ({{ activeCount }})
          </button>
          <button 
            class="filter-btn status-inactive"
            :class="{ active: filterStatus === 'inactivo' }"
            @click="filterStatus = 'inactivo'"
          >
            ● Inactivos ({{ inactiveCount }})
          </button>
          <button 
            class="filter-btn status-maintenance"
            :class="{ active: filterStatus === 'mantenimiento' }"
            @click="filterStatus = 'mantenimiento'"
          >
            ● Mantenimiento ({{ maintenanceCount }})
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="devicesStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando dispositivos...</p>
      </div>

      <!-- Devices Grid -->
      <div v-else-if="filteredDevices.length > 0" class="devices-grid">
        <div 
          v-for="device in filteredDevices" 
          :key="device.id" 
          class="device-card"
        >
          <div class="device-header">
            <i class="bi bi-phone device-icon"></i>
            <div 
              class="device-status-dot" 
              :class="`status-${device.status}`"
              :title="getStatusLabel(device.status)"
            ></div>
          </div>

          <div class="device-body">
            <h3 class="device-name">{{ device.name }}</h3>
            <p class="device-serial">Serial: {{ device.serial }}</p>
            
            <div class="device-status-badge" :class="`status-${device.status}`">
              {{ getStatusLabel(device.status) }}
            </div>

            <div v-if="device.user" class="device-user">
              <span class="user-label">Asignado a:</span>
              <span class="user-name">{{ device.user.name }}</span>
            </div>
            <div v-else class="device-user unassigned">
              <span>Sin asignar</span>
            </div>
          </div>

          <div class="device-footer">
            <button 
              class="device-action-btn"
              @click="openStatusModal(device)"
              title="Cambiar estado"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <button 
              class="device-action-btn"
              @click="openEditModal(device)"
              title="Editar"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button 
              class="device-action-btn delete"
              @click="confirmDelete(device)"
              title="Eliminar"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="bi bi-phone empty-icon"></i>
        <h3>No se encontraron dispositivos</h3>
        <p>{{ searchQuery ? 'Intenta con otro término de búsqueda' : 'Crea tu primer dispositivo' }}</p>
      </div>

      <!-- Create/Edit Modal -->
      <Modal 
        :is-open="isModalOpen" 
        :title="modalMode === 'create' ? 'Crear Dispositivo' : 'Editar Dispositivo'"
        @close="closeModal"
      >
        <form @submit.prevent="handleSubmit" class="device-form">
          <div class="form-group">
            <label for="name" class="form-label">Nombre del Dispositivo</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Ej: Dispositivo GPS 001"
              required
            />
          </div>

          <div class="form-group">
            <label for="serial_number" class="form-label">Número de Serie</label>
            <input
              id="serial_number"
              v-model="formData.serial"
              type="text"
              class="form-input"
              placeholder="Ej: GPS-12345-ABCDE"
              required
            />
          </div>

          <div class="form-group">
            <label for="status" class="form-label">Estado</label>
            <select id="status" v-model="formData.status" class="form-input" required>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="mantenimiento">En Mantenimiento</option>
            </select>
          </div>

          <div class="form-group">
            <label for="user_id" class="form-label">Asignar a Usuario (Opcional)</label>
            <select id="user_id" v-model="formData.user_id" class="form-input">
              <option :value="null">Sin asignar</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>

          <div v-if="formError" class="form-error">
            <i class="bi bi-exclamation-triangle error-icon"></i>
            {{ formError }}
          </div>
        </form>

        <template #footer>
          <button type="button" class="btn-secondary" @click="closeModal">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-primary" 
            @click="handleSubmit"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">
              {{ modalMode === 'create' ? 'Crear Dispositivo' : 'Guardar Cambios' }}
            </span>
            <span v-else class="spinner"></span>
          </button>
        </template>
      </Modal>

      <!-- Status Change Modal -->
      <Modal 
        :is-open="isStatusModalOpen" 
        title="Cambiar Estado del Dispositivo"
        @close="closeStatusModal"
      >
        <div class="status-change-form">
          <p class="status-info">
            Cambia el estado del dispositivo <strong>{{ selectedDevice?.name }}</strong>
          </p>

          <div class="status-options">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              class="status-option"
              :class="[`status-${status.value}`, { selected: newStatus === status.value }]"
              @click="newStatus = status.value"
            >
              <span class="status-dot"></span>
              <span class="status-label">{{ status.label }}</span>
            </button>
          </div>
        </div>

        <template #footer>
          <button type="button" class="btn-secondary" @click="closeStatusModal">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-primary" 
            @click="handleStatusChange"
            :disabled="isChangingStatus || newStatus === selectedDevice?.status"
          >
            <span v-if="!isChangingStatus">Cambiar Estado</span>
            <span v-else class="spinner"></span>
          </button>
        </template>
      </Modal>

      <!-- Delete Confirmation Modal -->
      <Modal 
        :is-open="isDeleteModalOpen" 
        title="Confirmar Eliminación"
        @close="cancelDelete"
      >
        <div class="delete-confirmation">
          <i class="bi bi-exclamation-triangle delete-icon"></i>
          <p>¿Estás seguro de que deseas eliminar el dispositivo <strong>{{ deviceToDelete?.name }}</strong>?</p>
          <p class="delete-warning">Esta acción no se puede deshacer.</p>
        </div>

        <template #footer>
          <button type="button" class="btn-secondary" @click="cancelDelete">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-danger" 
            @click="handleDelete"
            :disabled="isDeleting"
          >
            <span v-if="!isDeleting">Eliminar</span>
            <span v-else class="spinner"></span>
          </button>
        </template>
      </Modal>

      <!-- Toast Notifications -->
      <ToastNotification ref="toast" />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Modal from '@/components/common/Modal.vue';
import ToastNotification from '@/components/common/ToastNotification.vue';
import { useDevicesStore } from '@/stores/devicesStore';
import type { Device } from '@/types';

// Import users store for user assignment
import { useUsersStore } from '@/stores/usersStore';

const devicesStore = useDevicesStore();
const usersStore = useUsersStore();
const toast = ref<InstanceType<typeof ToastNotification>>();

// State
const searchQuery = ref('');
const filterStatus = ref<'activo' | 'inactivo' | 'mantenimiento' | null>(null);
const isModalOpen = ref(false);
const isStatusModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const isSubmitting = ref(false);
const isChangingStatus = ref(false);
const isDeleting = ref(false);
const formError = ref('');
const deviceToDelete = ref<Device | null>(null);
const editingDevice = ref<Device | null>(null);
const selectedDevice = ref<Device | null>(null);
const newStatus = ref<'activo' | 'inactivo' | 'mantenimiento'>('activo');

const formData = ref({
  name: '',
  serial: '',
  status: 'activo' as 'activo' | 'inactivo' | 'mantenimiento',
  user_id: null as number | null,
});

const statusOptions: Array<{ value: 'activo' | 'inactivo' | 'mantenimiento'; label: string }> = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
];

// Computed
const devices = computed(() => devicesStore.devices);
const availableUsers = computed(() => usersStore.users);

const filteredDevices = computed(() => {
  let filtered = devices.value;

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(d => d.status === filterStatus.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.serial.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const activeCount = computed(() => devices.value.filter(d => d.status === 'activo').length);
const inactiveCount = computed(() => devices.value.filter(d => d.status === 'inactivo').length);
const maintenanceCount = computed(() => devices.value.filter(d => d.status === 'mantenimiento').length);

// Methods
const getStatusLabel = (status: string) => {
  const labels = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    mantenimiento: 'Mantenimiento',
  };
  return labels[status as keyof typeof labels] || status;
};

const openCreateModal = () => {
  modalMode.value = 'create';
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (device: Device) => {
  modalMode.value = 'edit';
  editingDevice.value = device;
  formData.value = {
    name: device.name,
    serial: device.serial,
    status: device.status,
    user_id: device.user_id,
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
  formError.value = '';
};

const resetForm = () => {
  formData.value = {
    name: '',
    serial: '',
    status: 'activo',
    user_id: null,
  };
  editingDevice.value = null;
};

const openStatusModal = (device: Device) => {
  selectedDevice.value = device;
  newStatus.value = device.status;
  isStatusModalOpen.value = true;
};

const closeStatusModal = () => {
  isStatusModalOpen.value = false;
  selectedDevice.value = null;
};

const handleStatusChange = async () => {
  if (!selectedDevice.value) return;

  try {
    isChangingStatus.value = true;
    const success = await devicesStore.changeDeviceStatus(selectedDevice.value.id, newStatus.value);

    if (success) {
      toast.value?.addToast({
        type: 'success',
        message: 'Estado actualizado exitosamente',
      });
      closeStatusModal();
    } else {
      toast.value?.addToast({
        type: 'error',
        message: devicesStore.error || 'Error al cambiar estado',
      });
    }
  } catch (error: any) {
    toast.value?.addToast({
      type: 'error',
      message: error.message || 'Error al cambiar estado',
    });
  } finally {
    isChangingStatus.value = false;
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    formError.value = '';

    let success = false;
    if (modalMode.value === 'create') {
      success = await devicesStore.createDevice(formData.value);
      if (success) {
        toast.value?.addToast({
          type: 'success',
          message: 'Dispositivo creado exitosamente',
        });
      }
    } else if (editingDevice.value) {
      success = await devicesStore.updateDevice(editingDevice.value.id, formData.value);
      if (success) {
        toast.value?.addToast({
          type: 'success',
          message: 'Dispositivo actualizado exitosamente',
        });
      }
    }

    if (success) {
      closeModal();
    } else {
      formError.value = devicesStore.error || 'Error al guardar el dispositivo';
    }
  } catch (error: any) {
    formError.value = error.message || 'Error al guardar el dispositivo';
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (device: Device) => {
  deviceToDelete.value = device;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  deviceToDelete.value = null;
};

const handleDelete = async () => {
  if (!deviceToDelete.value) return;

  try {
    isDeleting.value = true;
    const success = await devicesStore.deleteDevice(deviceToDelete.value.id);

    if (success) {
      toast.value?.addToast({
        type: 'success',
        message: 'Dispositivo eliminado exitosamente',
      });
      cancelDelete();
    } else {
      toast.value?.addToast({
        type: 'error',
        message: devicesStore.error || 'Error al eliminar el dispositivo',
      });
    }
  } catch (error: any) {
    toast.value?.addToast({
      type: 'error',
      message: error.message || 'Error al eliminar el dispositivo',
    });
  } finally {
    isDeleting.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    devicesStore.fetchDevices(),
    usersStore.fetchUsers(),
  ]);
});
</script>

<style scoped>
.devices-management {
  max-width: 1440px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  margin-bottom: var(--space-xl);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
}

.hero-title {
  font-size: var(--font-size-4xl);
  color: var(--color-neon-green);
  margin-bottom: var(--space-sm);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.btn-icon {
  font-size: var(--font-size-lg);
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-lg);
}

.search-input {
  width: 100%;
  padding-left: calc(var(--space-md) * 3);
  height: 48px;
}

.filter-buttons {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-base);
}

.filter-btn:hover {
  border-color: var(--border-hover);
  background-color: var(--bg-tertiary);
}

.filter-btn.active {
  background-color: var(--color-neon-green);
  color: var(--color-black);
  border-color: var(--color-neon-green);
  box-shadow: var(--glow-neon);
}

/* Devices Grid */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.device-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.device-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.device-icon {
  font-size: 48px;
}

.device-status-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.device-status-dot.status-activo {
  background-color: var(--color-active);
  box-shadow: 0 0 10px var(--color-active);
}

.device-status-dot.status-inactivo {
  background-color: var(--color-inactive);
}

.device-status-dot.status-mantenimiento {
  background-color: var(--color-maintenance);
  box-shadow: 0 0 10px var(--color-maintenance);
}

.device-body {
  flex: 1;
  margin-bottom: var(--space-md);
}

.device-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.device-serial {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.device-status-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-md);
}

.device-status-badge.status-activo {
  background-color: rgba(192, 241, 28, 0.2);
  color: var(--color-active);
  border: 1px solid var(--color-active);
}

.device-status-badge.status-inactivo {
  background-color: rgba(107, 107, 107, 0.2);
  color: var(--color-inactive);
  border: 1px solid var(--color-inactive);
}

.device-status-badge.status-mantenimiento {
  background-color: rgba(255, 229, 0, 0.2);
  color: var(--color-maintenance);
  border: 1px solid var(--color-maintenance);
}

.device-user {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.user-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.user-name {
  font-size: var(--font-size-sm);
  color: var(--color-neon-green);
  font-weight: var(--font-medium);
}

.device-user.unassigned span {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-style: italic;
}

.device-footer {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-default);
}

.device-action-btn {
  flex: 1;
  padding: var(--space-sm);
  background-color: var(--bg-secondary);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.device-action-btn:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.1);
}

.device-action-btn.delete:hover {
  background-color: rgba(255, 59, 59, 0.2);
  color: var(--color-error);
}

/* Form */
.device-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-error {
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

/* Status Change */
.status-change-form {
  padding: var(--space-md);
}

.status-info {
  margin-bottom: var(--space-lg);
  color: var(--color-text-secondary);
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.status-option {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  text-align: left;
  transition: all var(--transition-base);
}

.status-option:hover {
  border-color: var(--border-hover);
  background-color: var(--bg-tertiary);
}

.status-option.selected {
  border-color: var(--color-neon-green);
  background-color: rgba(192, 241, 28, 0.1);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-option.status-activo .status-dot {
  background-color: var(--color-active);
}

.status-option.status-inactivo .status-dot {
  background-color: var(--color-inactive);
}

.status-option.status-mantenimiento .status-dot {
  background-color: var(--color-maintenance);
}

.status-label {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

/* Delete Confirmation */
.delete-confirmation {
  text-align: center;
  padding: var(--space-lg);
}

.delete-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-lg);
}

.delete-confirmation p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.delete-warning {
  color: var(--color-error) !important;
  font-weight: var(--font-medium);
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--space-lg);
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  color: var(--color-text-muted);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
