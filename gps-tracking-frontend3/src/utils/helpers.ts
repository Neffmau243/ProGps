// ============================================
// Utilities - Helper functions
// ============================================

/**
 * Traduce el estado del dispositivo de español a etiqueta legible
 */
export function getDeviceStatusLabel(status: 'activo' | 'inactivo' | 'mantenimiento'): string {
  const labels = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    mantenimiento: 'En Mantenimiento',
  };
  return labels[status] || status;
}

/**
 * Traduce el rol del usuario a etiqueta legible
 */
export function getRoleLabel(role: string): string {
  const labels = {
    admin: 'Administrador',
    employee: 'Empleado',
  };
  return labels[role as keyof typeof labels] || role;
}

/**
 * Formatea una fecha a formato legible español
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formatea una fecha y hora a formato corto
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea solo la hora
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Calcula la clase CSS según el estado del dispositivo
 */
export function getDeviceStatusClass(status: 'activo' | 'inactivo' | 'mantenimiento'): string {
  const classes = {
    activo: 'status-active',
    inactivo: 'status-inactive',
    mantenimiento: 'status-maintenance',
  };
  return classes[status] || '';
}
