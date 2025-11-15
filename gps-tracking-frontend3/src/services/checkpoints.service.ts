// ============================================
// Checkpoints Service
// ============================================

import apiClient from './api';

export interface Checkpoint {
  id: string;
  user_id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckpointCreateData {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  active?: boolean;
}

export interface CheckpointUpdateData {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  color?: string;
  active?: boolean;
}

export interface CheckpointResponse {
  success: boolean;
  data: Checkpoint;
  message?: string;
}

export interface CheckpointsResponse {
  success: boolean;
  data: Checkpoint[];
}

export interface CheckLocationRequest {
  latitude: number;
  longitude: number;
}

export interface CheckLocationResponse {
  success: boolean;
  matched: boolean;
  data: Checkpoint[];
}

const checkpointsService = {
  /**
   * Obtener todos los checkpoints del admin autenticado
   */
  async getAll(): Promise<Checkpoint[]> {
    const response = await apiClient.get<CheckpointsResponse>('/checkpoints');
    return response.data.data;
  },

  /**
   * Obtener solo checkpoints activos
   */
  async getActive(): Promise<Checkpoint[]> {
    const response = await apiClient.get<CheckpointsResponse>('/checkpoints/active');
    return response.data.data;
  },

  /**
   * Obtener un checkpoint específico
   */
  async getById(id: string): Promise<Checkpoint> {
    const response = await apiClient.get<CheckpointResponse>(`/checkpoints/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo checkpoint
   */
  async create(data: CheckpointCreateData): Promise<Checkpoint> {
    const response = await apiClient.post<CheckpointResponse>('/checkpoints', data);
    return response.data.data;
  },

  /**
   * Actualizar un checkpoint existente
   */
  async update(id: string, data: CheckpointUpdateData): Promise<Checkpoint> {
    const response = await apiClient.put<CheckpointResponse>(`/checkpoints/${id}`, data);
    return response.data.data;
  },

  /**
   * Activar/desactivar un checkpoint
   */
  async toggleStatus(id: string): Promise<Checkpoint> {
    const response = await apiClient.patch<CheckpointResponse>(`/checkpoints/${id}/toggle`);
    return response.data.data;
  },

  /**
   * Eliminar un checkpoint
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/checkpoints/${id}`);
  },

  /**
   * Verificar si una ubicación está dentro de algún checkpoint activo
   */
  async checkLocation(latitude: number, longitude: number): Promise<CheckLocationResponse> {
    const response = await apiClient.post<CheckLocationResponse>('/checkpoints/check-location', {
      latitude,
      longitude
    });
    return response.data;
  }
};

export default checkpointsService;
