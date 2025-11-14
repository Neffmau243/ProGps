// ============================================
// Auth Store - User authentication state
// ============================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';
import type { User, LoginRequest } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isEmployee = computed(() => user.value?.role === 'employee');

  // Actions
  async function login(credentials: LoginRequest) {
    try {
      isLoading.value = true;
      error.value = null;
      
      console.log('Attempting login with:', { email: credentials.email });
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      token.value = response.token;
      user.value = response.user;
      
      // Save to localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        error.value = Array.isArray(firstError) ? firstError[0] : 'Error de validación';
      } else {
        error.value = err.response?.data?.message || 'Error al iniciar sesión';
      }
      
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear state
      user.value = null;
      token.value = null;
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async function fetchUser() {
    try {
      isLoading.value = true;
      const userData = await authService.me();
      user.value = userData;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Fetch user error:', err);
      // If fetching user fails, logout
      logout();
    } finally {
      isLoading.value = false;
    }
  }

  function initializeFromStorage() {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        logout();
      }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isEmployee,
    
    // Actions
    login,
    logout,
    fetchUser,
    initializeFromStorage,
  };
});
