/**
 * Mapeo de emojis a iconos de Material Design Icons (MDI)
 * Esto facilita la migración gradual de emojis a iconos profesionales
 */

export const iconMap = {
  // Navegación y UI
  '📊': 'mdi:chart-box-outline',
  '👥': 'mdi:account-group',
  '📱': 'mdi:cellphone',
  '🗺️': 'mdi:map',
  '📍': 'mdi:map-marker',
  '👤': 'mdi:account',
  '🔍': 'mdi:magnify',
  '➕': 'mdi:plus',
  '⚡': 'mdi:lightning-bolt',
  
  // Estados y Notificaciones
  '✅': 'mdi:check-circle',
  '⚠️': 'mdi:alert',
  '🔒': 'mdi:lock',
  '🔔': 'mdi:bell',
  '🔄': 'mdi:refresh',
  '🔌': 'mdi:power-plug',
  '⏳': 'mdi:timer-sand',
  '🚪': 'mdi:logout',
  
  // Acciones y Edición
  '✏️': 'mdi:pencil',
  '🗑️': 'mdi:delete',
  '👑': 'mdi:crown',
  'ℹ️': 'mdi:information',
  
  // Tiempo y Medición
  '⏱️': 'mdi:timer',
  '🕐': 'mdi:clock-outline',
  '🎯': 'mdi:target',
  
  // Rutas y Navegación
  '🛣️': 'mdi:road',
  '📋': 'mdi:clipboard-text',
  
  // Otros
  '💡': 'mdi:lightbulb',
  '🚀': 'mdi:rocket-launch',
  '🛑': 'mdi:stop',
} as const

export type EmojiKey = keyof typeof iconMap

/**
 * Obtiene el nombre del icono MDI para un emoji dado
 */
export function getIconForEmoji(emoji: EmojiKey): string {
  return iconMap[emoji] || 'mdi:help-circle'
}

/**
 * Colecciones de iconos recomendadas por categoría
 */
export const iconCollections = {
  // Material Design Icons - La más completa
  mdi: {
    user: 'mdi:account',
    users: 'mdi:account-group',
    device: 'mdi:cellphone',
    map: 'mdi:map',
    location: 'mdi:map-marker',
    dashboard: 'mdi:view-dashboard',
    search: 'mdi:magnify',
    add: 'mdi:plus',
    edit: 'mdi:pencil',
    delete: 'mdi:delete',
    check: 'mdi:check',
    close: 'mdi:close',
    menu: 'mdi:menu',
    settings: 'mdi:cog',
    logout: 'mdi:logout',
    bell: 'mdi:bell',
    lock: 'mdi:lock',
    unlock: 'mdi:lock-open',
    eye: 'mdi:eye',
    eyeOff: 'mdi:eye-off',
    calendar: 'mdi:calendar',
    clock: 'mdi:clock-outline',
    refresh: 'mdi:refresh',
    filter: 'mdi:filter',
    download: 'mdi:download',
    upload: 'mdi:upload',
    info: 'mdi:information',
    warning: 'mdi:alert',
    error: 'mdi:alert-circle',
    success: 'mdi:check-circle',
  },
  
  // Solar Icons - Diseño moderno (como en gps-tracking-frontend)
  solar: {
    user: 'solar:user-bold',
    users: 'solar:users-group-rounded-bold',
    device: 'solar:smartphone-bold',
    map: 'solar:map-bold',
    location: 'solar:map-point-bold',
    dashboard: 'solar:widget-bold',
    search: 'solar:magnifer-bold',
    add: 'solar:add-circle-bold',
    edit: 'solar:pen-bold',
    delete: 'solar:trash-bin-trash-bold',
    check: 'solar:check-circle-bold',
    close: 'solar:close-circle-bold',
    menu: 'solar:hamburger-menu-bold',
    settings: 'solar:settings-bold',
    logout: 'solar:logout-bold',
    bell: 'solar:bell-bold',
    lock: 'solar:lock-bold',
    unlock: 'solar:lock-unlocked-bold',
    eye: 'solar:eye-bold',
    eyeOff: 'solar:eye-closed-bold',
    calendar: 'solar:calendar-bold',
    clock: 'solar:clock-circle-bold',
    refresh: 'solar:refresh-bold',
    filter: 'solar:filter-bold',
    download: 'solar:download-bold',
    upload: 'solar:upload-bold',
    info: 'solar:info-circle-bold',
    warning: 'solar:danger-triangle-bold',
    error: 'solar:close-circle-bold',
    success: 'solar:check-circle-bold',
  },
  
  // Heroicons - Minimalista y elegante
  heroicons: {
    user: 'heroicons:user',
    users: 'heroicons:user-group',
    device: 'heroicons:device-phone-mobile',
    map: 'heroicons:map',
    location: 'heroicons:map-pin',
    dashboard: 'heroicons:squares-2x2',
    search: 'heroicons:magnifying-glass',
    add: 'heroicons:plus',
    edit: 'heroicons:pencil',
    delete: 'heroicons:trash',
    check: 'heroicons:check',
    close: 'heroicons:x-mark',
    menu: 'heroicons:bars-3',
    settings: 'heroicons:cog-6-tooth',
    logout: 'heroicons:arrow-right-on-rectangle',
    bell: 'heroicons:bell',
    lock: 'heroicons:lock-closed',
    unlock: 'heroicons:lock-open',
    eye: 'heroicons:eye',
    eyeOff: 'heroicons:eye-slash',
    calendar: 'heroicons:calendar',
    clock: 'heroicons:clock',
    refresh: 'heroicons:arrow-path',
    filter: 'heroicons:funnel',
    download: 'heroicons:arrow-down-tray',
    upload: 'heroicons:arrow-up-tray',
    info: 'heroicons:information-circle',
    warning: 'heroicons:exclamation-triangle',
    error: 'heroicons:x-circle',
    success: 'heroicons:check-circle',
  },
}

/**
 * Colección de iconos por defecto (puedes cambiarla aquí)
 */
export const defaultCollection = iconCollections.mdi

/**
 * Helper para obtener un icono de la colección por defecto
 */
export function getIcon(name: keyof typeof defaultCollection): string {
  return defaultCollection[name] || 'mdi:help-circle'
}
