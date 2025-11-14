// ============================================
// Locations Store - GPS tracking and history
// ============================================

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { locationsService } from '@/services/locationsService';
import type { Location, LocationsHistoryParams, CreateLocationRequest } from '@/types';

export const useLocationsStore = defineStore('locations', () => {
  // State
  const locations = ref<Location[]>([]);
  const currentLocations = ref<Location[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchLocationHistory(params: LocationsHistoryParams) {
    try {
      isLoading.value = true;
      error.value = null;
      locations.value = await locationsService.getHistory(params);
      return locations.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar historial';
      console.error('Fetch location history error:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCurrentLocations() {
    try {
      isLoading.value = true;
      error.value = null;
      currentLocations.value = await locationsService.getCurrentLocations();
      return currentLocations.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar ubicaciones actuales';
      console.error('Fetch current locations error:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createLocation(locationData: CreateLocationRequest) {
    try {
      isLoading.value = true;
      error.value = null;
      const newLocation = await locationsService.create(locationData);
      locations.value.unshift(newLocation); // Add to beginning
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al guardar ubicación';
      console.error('Create location error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function clearLocations() {
    locations.value = [];
    currentLocations.value = [];
    error.value = null;
  }

  return {
    // State
    locations,
    currentLocations,
    isLoading,
    error,
    
    // Actions
    fetchLocationHistory,
    fetchCurrentLocations,
    createLocation,
    clearLocations,
  };
});
