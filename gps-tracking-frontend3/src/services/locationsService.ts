// ============================================
// Locations Service - GPS tracking endpoints
// ============================================

import apiClient from './api';
import type { Location, CreateLocationRequest, LocationsHistoryParams } from '@/types';

// Backend response types
interface HistoryResponse {
  device: {
    id: number;
    name: string;
    user_name: string;
  };
  locations: Array<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  }>;
  statistics: {
    total_points: number;
    distance_km: number;
    duration_minutes: number;
  };
}

export const locationsService = {
  // Send GPS location (Employee)
  async create(locationData: CreateLocationRequest): Promise<Location> {
    const response = await apiClient.post<Location>('/gps', locationData);
    return response.data;
  },

  // Get current locations of all devices (Admin only)
  async getCurrentLocations(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/locations/current');
    
    // Return backend data as-is, it already has all needed fields:
    // device_id, device_name, device_serial, user_id, user_name,
    // latitude, longitude, accuracy, timestamp, minutes_ago
    return response.data;
  },

  // Get location history with filters (Admin only)
  async getHistory(params: LocationsHistoryParams): Promise<HistoryResponse> {
    const response = await apiClient.get<HistoryResponse>('/locations/history', { params });
    
    // Return full backend response with device info, locations, and statistics
    return response.data;
  },
};

// Export HistoryResponse type for components to use
export type { HistoryResponse };
