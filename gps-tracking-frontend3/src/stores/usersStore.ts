// ============================================
// Users Store - User management state (Admin only)
// ============================================

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usersService } from '@/services/usersService';
import type { User, RegisterRequest } from '@/types';

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchUsers() {
    try {
      isLoading.value = true;
      error.value = null;
      users.value = await usersService.getAll();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar usuarios';
      console.error('Fetch users error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserById(id: number) {
    try {
      isLoading.value = true;
      error.value = null;
      currentUser.value = await usersService.getById(id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar usuario';
      console.error('Fetch user error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createUser(userData: RegisterRequest) {
    try {
      isLoading.value = true;
      error.value = null;
      const newUser = await usersService.create(userData);
      users.value.push(newUser);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear usuario';
      console.error('Create user error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(id: number, userData: Partial<RegisterRequest>) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedUser = await usersService.update(id, userData);
      
      // Update in list
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar usuario';
      console.error('Update user error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(id: number) {
    try {
      isLoading.value = true;
      error.value = null;
      await usersService.delete(id);
      
      // Remove from list
      users.value = users.value.filter(u => u.id !== id);
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar usuario';
      console.error('Delete user error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
});
