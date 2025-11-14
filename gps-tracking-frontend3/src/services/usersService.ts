// ============================================
// Users Service - User management endpoints (Admin only)
// ============================================

import apiClient from './api';
import type { User, RegisterRequest } from '@/types';

export const usersService = {
  // Get all users (Admin only)
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return Array.isArray(response.data) ? response.data : [];
  },

  // Get user by ID (Admin only)
  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create user (Admin only)
  async create(userData: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  },

  // Update user (Admin only)
  async update(id: number, userData: Partial<RegisterRequest>): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
