// ============================================
// Devices Store - Device management state
// ============================================

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { devicesService } from '@/services/devicesService';
import type { Device, CreateDeviceRequest, UpdateDeviceRequest } from '@/types';

export const useDevicesStore = defineStore('devices', () => {
  // State
  const devices = ref<Device[]>([]);
  const currentDevice = ref<Device | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchDevices() {
    try {
      isLoading.value = true;
      error.value = null;
      devices.value = await devicesService.getAll();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar dispositivos';
      console.error('Fetch devices error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchDeviceById(id: number) {
    try {
      isLoading.value = true;
      error.value = null;
      currentDevice.value = await devicesService.getById(id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar dispositivo';
      console.error('Fetch device error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createDevice(deviceData: CreateDeviceRequest) {
    try {
      isLoading.value = true;
      error.value = null;
      const newDevice = await devicesService.create(deviceData);
      devices.value.push(newDevice);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear dispositivo';
      console.error('Create device error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateDevice(id: number, deviceData: UpdateDeviceRequest) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedDevice = await devicesService.update(id, deviceData);
      
      // Update in list
      const index = devices.value.findIndex(d => d.id === id);
      if (index !== -1) {
        devices.value[index] = updatedDevice;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar dispositivo';
      console.error('Update device error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteDevice(id: number) {
    try {
      isLoading.value = true;
      error.value = null;
      await devicesService.delete(id);
      
      // Remove from list
      devices.value = devices.value.filter(d => d.id !== id);
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar dispositivo';
      console.error('Delete device error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function changeDeviceStatus(id: number, status: 'activo' | 'inactivo' | 'mantenimiento') {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedDevice = await devicesService.changeStatus(id, status);
      
      // Update in list
      const index = devices.value.findIndex(d => d.id === id);
      if (index !== -1) {
        devices.value[index] = updatedDevice;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cambiar estado del dispositivo';
      console.error('Change status error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    devices,
    currentDevice,
    isLoading,
    error,
    
    // Actions
    fetchDevices,
    fetchDeviceById,
    createDevice,
    updateDevice,
    deleteDevice,
    changeDeviceStatus,
  };
});
