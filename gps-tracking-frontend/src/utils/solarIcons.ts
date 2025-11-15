/**
 * Catálogo de Solar Icons útiles para el proyecto GPS Tracking
 * 
 * Estilos disponibles:
 * - linear: Líneas simples
 * - bold: Líneas gruesas
 * - bold-duotone: Líneas gruesas con dos tonos (recomendado)
 * - broken: Líneas discontinuas
 * 
 * Uso:
 * import { SOLAR_ICONS } from '@/utils/solarIcons'
 * <SolarIcon :name="SOLAR_ICONS.GPS" />
 */

export const SOLAR_ICONS = {
  // Navegación y Ubicación
  GPS: 'gps',
  MAP_POINT: 'map-point',
  MAP: 'map',
  COMPASS: 'compass',
  ROUTE: 'route',
  ROUTING: 'routing',
  LOCATION: 'map-point-wave',
  GLOBAL: 'global',
  
  // Usuarios
  USER: 'user',
  USER_CIRCLE: 'user-circle',
  USERS: 'users-group-rounded',
  USER_CHECK: 'user-check',
  USER_PLUS: 'user-plus',
  
  // Dispositivos
  DEVICE: 'smartphone',
  DEVICES: 'devices',
  TABLET: 'tablet',
  LAPTOP: 'laptop',
  
  // Acciones
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop-circle',
  REFRESH: 'refresh',
  SETTINGS: 'settings',
  FILTER: 'filter',
  SEARCH: 'magnifer',
  
  // UI
  HOME: 'home',
  MENU: 'hamburger-menu',
  CLOSE: 'close-circle',
  CHECK: 'check-circle',
  INFO: 'info-circle',
  WARNING: 'danger-triangle',
  ERROR: 'close-circle',
  
  // Dashboard
  CHART: 'chart',
  GRAPH: 'graph',
  CALENDAR: 'calendar',
  CLOCK: 'clock-circle',
  HISTORY: 'history',
  
  // Autenticación
  LOGIN: 'login',
  LOGOUT: 'logout',
  KEY: 'key',
  SHIELD: 'shield-check',
  
  // Archivos
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  FILE: 'file',
  DOCUMENT: 'document',
  
  // Comunicación
  NOTIFICATION: 'bell',
  MESSAGE: 'chat-round-dots',
  EMAIL: 'letter',
  
  // Otros
  EYE: 'eye',
  EYE_CLOSED: 'eye-closed',
  EDIT: 'pen',
  DELETE: 'trash-bin-trash',
  ADD: 'add-circle',
  MINUS: 'minus-circle',
  ARROW_RIGHT: 'arrow-right',
  ARROW_LEFT: 'arrow-left',
  ARROW_UP: 'arrow-up',
  ARROW_DOWN: 'arrow-down',
} as const

export type SolarIconName = typeof SOLAR_ICONS[keyof typeof SOLAR_ICONS]

/**
 * Iconos específicos para el proyecto GPS
 */
export const GPS_ICONS = {
  // Estados de dispositivo
  DEVICE_ACTIVE: 'smartphone-2',
  DEVICE_INACTIVE: 'smartphone-vibration',
  DEVICE_MAINTENANCE: 'settings',
  
  // Tracking
  TRACKING_ON: 'gps',
  TRACKING_OFF: 'gps-off',
  LIVE_TRACKING: 'map-point-wave',
  
  // Reportes
  REPORT: 'document-text',
  STATISTICS: 'chart-square',
  EXPORT: 'export',
  
  // Admin
  ADMIN_PANEL: 'shield-user',
  MANAGE_USERS: 'users-group-rounded',
  MANAGE_DEVICES: 'devices',
} as const
