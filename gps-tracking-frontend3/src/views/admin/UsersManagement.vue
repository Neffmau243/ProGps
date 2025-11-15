<template>
  <MainLayout>
    <div class="users-management">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-header">
          <div>
            <h1 class="hero-title">Gestión de Usuarios</h1>
            <p class="hero-subtitle">Administra todos los usuarios del sistema</p>
          </div>
          <button class="btn-primary" @click="openCreateModal">
            <i class="bi bi-plus-circle btn-icon"></i>
            Crear Usuario
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
            placeholder="Buscar por nombre o email..."
            class="search-input"
          />
        </div>
        
        <div class="filter-buttons">
          <button 
            class="filter-btn"
            :class="{ active: filterRole === null }"
            @click="filterRole = null"
          >
            Todos ({{ users.length }})
          </button>
          <button 
            class="filter-btn"
            :class="{ active: filterRole === 'admin' }"
            @click="filterRole = 'admin'"
          >
            Admins ({{ adminCount }})
          </button>
          <button 
            class="filter-btn"
            :class="{ active: filterRole === 'empleado' }"
            @click="filterRole = 'empleado'"
          >
            Empleados ({{ employeeCount }})
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="usersStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <!-- Users Table -->
      <div v-else-if="filteredUsers.length > 0" class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td>
                <div class="user-avatar">{{ getUserInitial(user.name) }}</div>
              </td>
              <td class="user-name">{{ user.name }}</td>
              <td class="user-email">{{ user.email }}</td>
              <td>
                <span class="role-badge" :class="`role-${user.role}`">
                  <i :class="['bi', user.role === 'admin' ? 'bi-star-fill' : 'bi-person']"></i>
                  {{ user.role === 'admin' ? 'Admin' : 'Empleado' }}
                </span>
              </td>
              <td class="user-date">{{ formatDate(user.created_at) }}</td>
              <td class="user-actions">
                <button 
                  class="action-btn edit-btn" 
                  @click="openEditModal(user)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="action-btn delete-btn" 
                  @click="confirmDelete(user)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="bi bi-people empty-icon"></i>
        <h3>No se encontraron usuarios</h3>
        <p>{{ searchQuery ? 'Intenta con otro término de búsqueda' : 'Crea tu primer usuario' }}</p>
      </div>

      <!-- Create/Edit Modal -->
      <Modal 
        :is-open="isModalOpen" 
        :title="modalMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'"
        @close="closeModal"
      >
        <form @submit.prevent="handleSubmit" class="user-form">
          <div class="form-group">
            <label for="name" class="form-label">Nombre Completo</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">
              {{ modalMode === 'create' ? 'Contraseña' : 'Nueva Contraseña (dejar vacío para no cambiar)' }}
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              :required="modalMode === 'create'"
            />
          </div>

          <div v-if="modalMode === 'create' || formData.password" class="form-group">
            <label for="password_confirmation" class="form-label">Confirmar Contraseña</label>
            <input
              id="password_confirmation"
              v-model="formData.password_confirmation"
              type="password"
              class="form-input"
              placeholder="••••••••"
              :required="modalMode === 'create' || !!formData.password"
            />
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Rol</label>
            <select id="role" v-model="formData.role" class="form-input" required>
              <option value="">Selecciona un rol</option>
              <option value="admin">Administrador</option>
              <option value="employee">Empleado</option>
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
              {{ modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios' }}
            </span>
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
          <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete?.name }}</strong>?</p>
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
import { useUsersStore } from '@/stores/usersStore';
import type { User } from '@/types';

const usersStore = useUsersStore();
const toast = ref<InstanceType<typeof ToastNotification>>();

// State
const searchQuery = ref('');
const filterRole = ref<'admin' | 'empleado' | null>(null);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const isSubmitting = ref(false);
const isDeleting = ref(false);
const formError = ref('');
const userToDelete = ref<User | null>(null);
const editingUser = ref<User | null>(null);

const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '' as 'admin' | 'empleado' | '',
});

// Computed
const users = computed(() => usersStore.users);

const filteredUsers = computed(() => {
  let filtered = users.value;

  // Filter by role
  if (filterRole.value) {
    filtered = filtered.filter(u => u.role === filterRole.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length);
const employeeCount = computed(() => users.value.filter(u => u.role === 'empleado').length);

// Methods
const getUserInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const openCreateModal = () => {
  modalMode.value = 'create';
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (user: User) => {
  modalMode.value = 'edit';
  editingUser.value = user;
  formData.value = {
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    role: user.role,
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
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  };
  editingUser.value = null;
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    formError.value = '';

    // Validation
    if (formData.value.password && formData.value.password !== formData.value.password_confirmation) {
      formError.value = 'Las contraseñas no coinciden';
      return;
    }

    const payload: any = {
      name: formData.value.name,
      email: formData.value.email,
      role: formData.value.role,
    };

    if (formData.value.password) {
      payload.password = formData.value.password;
      payload.password_confirmation = formData.value.password_confirmation;
    }

    let success = false;
    if (modalMode.value === 'create') {
      success = await usersStore.createUser(payload);
      if (success) {
        toast.value?.addToast({
          type: 'success',
          message: 'Usuario creado exitosamente',
        });
      }
    } else if (editingUser.value) {
      success = await usersStore.updateUser(editingUser.value.id, payload);
      if (success) {
        toast.value?.addToast({
          type: 'success',
          message: 'Usuario actualizado exitosamente',
        });
      }
    }

    if (success) {
      closeModal();
    } else {
      formError.value = usersStore.error || 'Error al guardar el usuario';
    }
  } catch (error: any) {
    formError.value = error.message || 'Error al guardar el usuario';
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (user: User) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const handleDelete = async () => {
  if (!userToDelete.value) return;

  try {
    isDeleting.value = true;
    const success = await usersStore.deleteUser(userToDelete.value.id);

    if (success) {
      toast.value?.addToast({
        type: 'success',
        message: 'Usuario eliminado exitosamente',
      });
      cancelDelete();
    } else {
      toast.value?.addToast({
        type: 'error',
        message: usersStore.error || 'Error al eliminar el usuario',
      });
    }
  } catch (error: any) {
    toast.value?.addToast({
      type: 'error',
      message: error.message || 'Error al eliminar el usuario',
    });
  } finally {
    isDeleting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  usersStore.fetchUsers();
});
</script>

<style scoped>
.users-management {
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

/* Table */
.users-table-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background-color: var(--bg-secondary);
}

.users-table th {
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-row {
  border-bottom: 1px solid var(--border-default);
  transition: all var(--transition-base);
}

.user-row:hover {
  background-color: var(--bg-secondary);
}

.users-table td {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-info));
  color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--font-size-base);
}

.user-name {
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.user-email {
  color: var(--color-text-muted);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-medium);
}

.role-admin {
  background-color: rgba(192, 241, 28, 0.2);
  color: var(--color-neon-green);
  border: 1px solid var(--color-neon-green);
}

.role-employee {
  background-color: rgba(0, 229, 255, 0.2);
  color: var(--color-info);
  border: 1px solid var(--color-info);
}

.user-actions {
  display: flex;
  gap: var(--space-sm);
}

.action-btn {
  padding: var(--space-sm);
  background: none;
  font-size: var(--font-size-lg);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.action-btn:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.1);
}

.edit-btn:hover {
  color: var(--color-neon-green);
}

.delete-btn:hover {
  color: var(--color-error);
}

/* Form */
.user-form {
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
</style>
