// ============================================
// Devices Service - Device management endpoints
// ============================================

import apiClient from './api';
import type { Device, CreateDeviceRequest, UpdateDeviceRequest } from '@/types';

export const devicesService = {
  // Get all devices (filtered by role)
  async getAll(): Promise<Device[]> {
    const response = await apiClient.get<Device[]>('/devices');
    // Backend retorna array directo, no { data: [] }
    return Array.isArray(response.data) ? response.data : [];
  },

  // Get device by ID
  async getById(id: number): Promise<Device> {
    const response = await apiClient.get<Device>(`/devices/${id}`);
    return response.data;
  },

  // Create device (Admin only)
  async create(deviceData: CreateDeviceRequest): Promise<Device> {
    const response = await apiClient.post<Device>('/devices', deviceData);
    return response.data;
  },

  // Update device (Admin only)
  async update(id: number, deviceData: UpdateDeviceRequest): Promise<Device> {
    const response = await apiClient.put<Device>(`/devices/${id}`, deviceData);
    return response.data;
  },

  // Delete device (Admin only)
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/devices/${id}`);
  },

  // Change device status (Admin only)
  async changeStatus(id: number, status: 'activo' | 'inactivo' | 'mantenimiento'): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${id}/status`, { status });
    return response.data;
  },
};
