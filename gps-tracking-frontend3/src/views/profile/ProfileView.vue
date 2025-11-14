<template>
  <MainLayout>
    <div class="profile-view">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="avatar-container">
            <div class="avatar">
              <span class="avatar-icon">👤</span>
            </div>
            <div class="avatar-badge" :class="user?.role">
              {{ getRoleLabel(user?.role) }}
            </div>
          </div>
          <div class="hero-info">
            <h1 class="hero-title">{{ user?.name }}</h1>
            <p class="hero-subtitle">{{ user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="profile-grid">
        <!-- Personal Information Card -->
        <div class="profile-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">ℹ️</span>
              Información Personal
            </h2>
            <button 
              v-if="!isEditingInfo"
              class="btn-icon-small"
              @click="startEditingInfo"
              title="Editar"
            >
              ✏️
            </button>
          </div>

          <div class="card-body">
            <div v-if="!isEditingInfo" class="info-list">
              <div class="info-item">
                <span class="info-label">Nombre completo</span>
                <span class="info-value">{{ user?.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Correo electrónico</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Rol</span>
                <span class="info-value">
                  <span class="role-badge" :class="user?.role">
                    {{ getRoleLabel(user?.role) }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Cuenta creada</span>
                <span class="info-value">{{ formatDate(user?.created_at) }}</span>
              </div>
            </div>

            <form v-else @submit.prevent="updateInfo" class="edit-form">
              <div class="form-group">
                <label for="name" class="form-label">Nombre completo</label>
                <input
                  id="name"
                  v-model="infoForm.name"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Correo electrónico</label>
                <input
                  id="email"
                  v-model="infoForm.email"
                  type="email"
                  class="form-input"
                  required
                />
              </div>

              <div v-if="infoError" class="form-error">
                <span class="error-icon">⚠️</span>
                {{ infoError }}
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="cancelEditingInfo">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn-primary"
                  :disabled="isUpdatingInfo"
                >
                  <span v-if="!isUpdatingInfo">Guardar Cambios</span>
                  <span v-else class="spinner"></span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="profile-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🔒</span>
              Cambiar Contraseña
            </h2>
          </div>

          <div class="card-body">
            <form @submit.prevent="updatePassword" class="password-form">
              <div class="form-group">
                <label for="current-password" class="form-label">Contraseña actual</label>
                <input
                  id="current-password"
                  v-model="passwordForm.current_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="new-password" class="form-label">Nueva contraseña</label>
                <input
                  id="new-password"
                  v-model="passwordForm.new_password"
                  type="password"
                  class="form-input"
                  required
                  minlength="8"
                />
                <span class="form-hint">Mínimo 8 caracteres</span>
              </div>

              <div class="form-group">
                <label for="confirm-password" class="form-label">Confirmar nueva contraseña</label>
                <input
                  id="confirm-password"
                  v-model="passwordForm.confirm_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div v-if="passwordError" class="form-error">
                <span class="error-icon">⚠️</span>
                {{ passwordError }}
              </div>

              <button 
                type="submit" 
                class="btn-primary full-width"
                :disabled="isUpdatingPassword"
              >
                <span v-if="!isUpdatingPassword">Actualizar Contraseña</span>
                <span v-else class="spinner"></span>
              </button>
            </form>
          </div>
        </div>

        <!-- Account Statistics Card (Admin only) -->
        <div v-if="user?.role === 'admin'" class="profile-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📊</span>
              Estadísticas
            </h2>
          </div>

          <div class="card-body">
            <div class="stats-list">
              <div class="stat-item">
                <span class="stat-icon">👥</span>
                <div class="stat-content">
                  <span class="stat-value">{{ statistics.users }}</span>
                  <span class="stat-label">Usuarios</span>
                </div>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📱</span>
                <div class="stat-content">
                  <span class="stat-value">{{ statistics.devices }}</span>
                  <span class="stat-label">Dispositivos</span>
                </div>
              </div>
              <div class="stat-item">
                <span class="stat-icon">✅</span>
                <div class="stat-content">
                  <span class="stat-value">{{ statistics.activeDevices }}</span>
                  <span class="stat-label">Activos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Device Card (Employee only) -->
        <div v-if="user?.role === 'employee'" class="profile-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📱</span>
              Mi Dispositivo
            </h2>
          </div>

          <div class="card-body">
            <div v-if="assignedDevice" class="device-info">
              <div class="device-icon-large">📱</div>
              <h3 class="device-name">{{ assignedDevice.name }}</h3>
              <p class="device-serial">{{ assignedDevice.serial }}</p>
              <div class="device-status-badge" :class="`status-${assignedDevice.status}`">
                {{ getStatusLabel(assignedDevice.status) }}
              </div>
            </div>
            <div v-else class="empty-device">
              <span class="empty-icon">📱</span>
              <p>No tienes dispositivo asignado</p>
            </div>
          </div>
        </div>

        <!-- Danger Zone Card -->
        <div class="profile-card danger-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">⚠️</span>
              Zona de Peligro
            </h2>
          </div>

          <div class="card-body">
            <div class="danger-content">
              <p class="danger-description">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
              </p>
              <button class="btn-danger" @click="openDeleteModal">
                Eliminar mi cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Account Modal -->
      <Modal 
        :is-open="isDeleteModalOpen" 
        title="Confirmar Eliminación de Cuenta"
        @close="closeDeleteModal"
      >
        <div class="delete-confirmation">
          <span class="delete-icon">⚠️</span>
          <p><strong>¿Estás absolutamente seguro?</strong></p>
          <p>Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta.</p>
          
          <div class="form-group">
            <label for="confirm-email" class="form-label">
              Escribe tu correo electrónico para confirmar:
            </label>
            <input
              id="confirm-email"
              v-model="deleteConfirmEmail"
              type="email"
              class="form-input"
              :placeholder="user?.email"
            />
          </div>
        </div>

        <template #footer>
          <button type="button" class="btn-secondary" @click="closeDeleteModal">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-danger" 
            @click="deleteAccount"
            :disabled="deleteConfirmEmail !== user?.email || isDeleting"
          >
            <span v-if="!isDeleting">Eliminar Definitivamente</span>
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
import { useRouter } from 'vue-router';
import MainLayout from '@/components/layout/MainLayout.vue';
import Modal from '@/components/common/Modal.vue';
import ToastNotification from '@/components/common/ToastNotification.vue';
import { useAuthStore } from '@/stores/authStore';
import { useUsersStore } from '@/stores/usersStore';
import { useDevicesStore } from '@/stores/devicesStore';

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const devicesStore = useDevicesStore();
const toast = ref<InstanceType<typeof ToastNotification>>();

// State
const isEditingInfo = ref(false);
const isUpdatingInfo = ref(false);
const isUpdatingPassword = ref(false);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const infoError = ref('');
const passwordError = ref('');
const deleteConfirmEmail = ref('');

const infoForm = ref({
  name: '',
  email: '',
});

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

// Computed
const user = computed(() => authStore.user);

const assignedDevice = computed(() => {
  if (user.value?.role !== 'employee') return null;
  return devicesStore.devices.find(d => d.user_id === user.value?.id);
});

const statistics = computed(() => {
  return {
    users: usersStore.users.length,
    devices: devicesStore.devices.length,
    activeDevices: devicesStore.devices.filter(d => d.status === 'activo').length,
  };
});

// Methods
function getRoleLabel(role: string | undefined): string {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    employee: 'Empleado',
  };
  return labels[role || ''] || role || '';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    mantenimiento: 'Mantenimiento',
  };
  return labels[status] || status;
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function startEditingInfo() {
  if (!user.value) return;
  infoForm.value = {
    name: user.value.name,
    email: user.value.email,
  };
  isEditingInfo.value = true;
  infoError.value = '';
}

function cancelEditingInfo() {
  isEditingInfo.value = false;
  infoError.value = '';
}

async function updateInfo() {
  if (!user.value) return;

  try {
    isUpdatingInfo.value = true;
    infoError.value = '';

    const success = await usersStore.updateUser(user.value.id, infoForm.value);

    if (success) {
      // Update local user data
      if (authStore.user) {
        authStore.user.name = infoForm.value.name;
        authStore.user.email = infoForm.value.email;
      }
      
      toast.value?.addToast({
        type: 'success',
        message: 'Información actualizada exitosamente',
      });
      
      isEditingInfo.value = false;
    } else {
      infoError.value = usersStore.error || 'Error al actualizar información';
    }
  } catch (error: any) {
    infoError.value = error.message || 'Error al actualizar información';
  } finally {
    isUpdatingInfo.value = false;
  }
}

async function updatePassword() {
  try {
    isUpdatingPassword.value = true;
    passwordError.value = '';

    // Validate passwords match
    if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
      passwordError.value = 'Las contraseñas no coinciden';
      return;
    }

    // In a real app, you would call an API endpoint to change password
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.value?.addToast({
      type: 'success',
      message: 'Contraseña actualizada exitosamente',
    });

    // Reset form
    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    };
  } catch (error: any) {
    passwordError.value = error.message || 'Error al actualizar contraseña';
  } finally {
    isUpdatingPassword.value = false;
  }
}

function openDeleteModal() {
  deleteConfirmEmail.value = '';
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  deleteConfirmEmail.value = '';
}

async function deleteAccount() {
  if (!user.value || deleteConfirmEmail.value !== user.value.email) return;

  try {
    isDeleting.value = true;

    const success = await usersStore.deleteUser(user.value.id);

    if (success) {
      toast.value?.addToast({
        type: 'success',
        message: 'Cuenta eliminada exitosamente',
      });

      // Logout and redirect
      setTimeout(() => {
        authStore.logout();
        router.push('/login');
      }, 2000);
    } else {
      toast.value?.addToast({
        type: 'error',
        message: usersStore.error || 'Error al eliminar cuenta',
      });
    }
  } catch (error: any) {
    toast.value?.addToast({
      type: 'error',
      message: error.message || 'Error al eliminar cuenta',
    });
  } finally {
    isDeleting.value = false;
  }
}

// Lifecycle
onMounted(async () => {
  if (user.value?.role === 'admin') {
    await Promise.all([
      usersStore.fetchUsers(),
      devicesStore.fetchDevices(),
    ]);
  } else if (user.value?.role === 'employee') {
    await devicesStore.fetchDevices();
  }
});
</script>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  margin-bottom: var(--space-xl);
  padding: var(--space-2xl);
  background: linear-gradient(135deg, rgba(192, 241, 28, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.hero-content {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--color-neon-green), #9BCF00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--bg-primary);
  box-shadow: var(--shadow-lg);
}

.avatar-icon {
  font-size: 64px;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: -10px;
  padding: var(--space-xs) var(--space-md);
  background-color: var(--bg-card);
  border: 2px solid var(--color-neon-green);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
  text-transform: uppercase;
}

.hero-info {
  flex: 1;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* Profile Grid */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}

.profile-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.profile-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
}

.danger-card {
  border-color: rgba(255, 59, 59, 0.3);
}

.danger-card:hover {
  border-color: var(--color-error);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-default);
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.card-icon {
  font-size: var(--font-size-2xl);
}

.btn-icon-small {
  width: 36px;
  height: 36px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-lg);
  transition: all var(--transition-base);
}

.btn-icon-small:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.1);
}

.card-body {
  padding: var(--space-lg);
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-default);
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.info-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.role-badge {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: rgba(192, 241, 28, 0.2);
  color: var(--color-neon-green);
  border: 1px solid var(--color-neon-green);
}

.role-badge.employee {
  background-color: rgba(107, 107, 107, 0.2);
  color: var(--color-text-secondary);
  border: 1px solid var(--border-default);
}

/* Forms */
.edit-form,
.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
}

.full-width {
  width: 100%;
}

/* Statistics */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Device Info */
.device-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-lg);
}

.device-icon-large {
  font-size: 64px;
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

.empty-device {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2xl);
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

/* Danger Zone */
.danger-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.danger-description {
  color: var(--color-text-secondary);
}

/* Delete Confirmation */
.delete-confirmation {
  padding: var(--space-lg);
  text-align: center;
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

.delete-confirmation .form-group {
  text-align: left;
  margin-top: var(--space-lg);
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
