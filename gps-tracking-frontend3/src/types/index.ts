// ============================================
// Types & Interfaces for ProGPS Application
// ============================================

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'admin' | 'employee';
}

// Device Types
export interface Device {
  id: number;
  name: string;
  serial: string; // Backend usa 'serial' no 'serial_number'
  status: 'activo' | 'inactivo' | 'mantenimiento'; // Backend usa español
  user_id: number | null;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDeviceRequest {
  name: string;
  serial: string; // Backend usa 'serial'
  status: 'activo' | 'inactivo' | 'mantenimiento';
  user_id?: number | null;
}

export interface UpdateDeviceRequest {
  name?: string;
  serial?: string; // Backend usa 'serial'
  status?: 'activo' | 'inactivo' | 'mantenimiento';
  user_id?: number | null;
}

// Location/GPS Types
export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed?: number | null;
  battery_level?: number | null;
  device_id: number;
  device?: Device;
  user_id: number;
  user?: User;
  timestamp: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateLocationRequest {
  latitude: number;
  longitude: number;
  accuracy: number;
  device_id: number;
}

export interface LocationsHistoryParams {
  device_id?: number;
  user_id?: number;
  start_date?: string;
  end_date?: string;
}

// Statistics Types
export interface DashboardStats {
  total_users: number;
  total_devices: number;
  active_devices: number;
  total_locations: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// UI State Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | null;
  data?: any;
}
