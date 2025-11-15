import { ref, computed } from 'vue';
import checkpointsService from '@/services/checkpoints.service';
import type { Checkpoint as APICheckpoint, CheckpointCreateData, CheckpointUpdateData } from '@/services/checkpoints.service';

// Re-exportar tipo para compatibilidad
export type Checkpoint = APICheckpoint;

// Estado global de checkpoints (cargados desde API)
const checkpoints = ref<Checkpoint[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Flag para saber si ya se cargaron los checkpoints
let checkpointsLoaded = false;

export const useCheckpoints = () => {
  // Obtener todos los checkpoints activos
  const activeCheckpoints = computed(() => 
    checkpoints.value.filter(cp => cp.active)
  );

  // Cargar checkpoints desde la API
  const loadCheckpoints = async (forceReload = false) => {
    if (checkpointsLoaded && !forceReload) return;
    
    try {
      isLoading.value = true;
      error.value = null;
      const data = await checkpointsService.getAll();
      checkpoints.value = data;
      checkpointsLoaded = true;
      console.log('✅ Checkpoints cargados desde API:', data.length);
    } catch (err) {
      error.value = 'Error al cargar checkpoints';
      console.error('❌ Error cargando checkpoints:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Crear un nuevo checkpoint
  const createCheckpoint = async (checkpoint: Omit<Checkpoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const data: CheckpointCreateData = {
        name: checkpoint.name,
        description: checkpoint.description,
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
        radius: checkpoint.radius,
        color: checkpoint.color,
        active: checkpoint.active ?? true
      };
      
      const newCheckpoint = await checkpointsService.create(data);
      checkpoints.value.push(newCheckpoint);
      console.log('✅ Checkpoint creado:', newCheckpoint.name);
      return newCheckpoint;
    } catch (err) {
      error.value = 'Error al crear checkpoint';
      console.error('❌ Error creando checkpoint:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Actualizar un checkpoint existente
  const updateCheckpoint = async (id: string, updates: Partial<Omit<Checkpoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const data: CheckpointUpdateData = {
        name: updates.name,
        description: updates.description,
        latitude: updates.latitude,
        longitude: updates.longitude,
        radius: updates.radius,
        color: updates.color,
        active: updates.active
      };
      
      const updatedCheckpoint = await checkpointsService.update(id, data);
      
      // Actualizar en el estado local
      const index = checkpoints.value.findIndex(cp => cp.id === id);
      if (index !== -1) {
        checkpoints.value[index] = updatedCheckpoint;
      }
      
      console.log('✅ Checkpoint actualizado:', updatedCheckpoint.name);
      return true;
    } catch (err) {
      error.value = 'Error al actualizar checkpoint';
      console.error('❌ Error actualizando checkpoint:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Eliminar un checkpoint
  const deleteCheckpoint = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await checkpointsService.delete(id);
      
      // Eliminar del estado local
      const index = checkpoints.value.findIndex(cp => cp.id === id);
      if (index !== -1) {
        checkpoints.value.splice(index, 1);
      }
      
      console.log('✅ Checkpoint eliminado');
      return true;
    } catch (err) {
      error.value = 'Error al eliminar checkpoint';
      console.error('❌ Error eliminando checkpoint:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Verificar si una ubicación está dentro de un checkpoint
  const isLocationInCheckpoint = (
    latitude: number,
    longitude: number,
    checkpoint: Checkpoint
  ): boolean => {
    const R = 6371000; // Radio de la Tierra en metros
    const lat1 = (checkpoint.latitude * Math.PI) / 180;
    const lat2 = (latitude * Math.PI) / 180;
    const deltaLat = ((latitude - checkpoint.latitude) * Math.PI) / 180;
    const deltaLon = ((longitude - checkpoint.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distancia en metros
    return distance <= checkpoint.radius;
  };

  // Verificar todos los checkpoints para una ubicación
  const checkLocation = (
    latitude: number,
    longitude: number,
    userName: string,
    deviceName: string
  ) => {
    const reachedCheckpoints: Checkpoint[] = [];

    activeCheckpoints.value.forEach(checkpoint => {
      if (isLocationInCheckpoint(latitude, longitude, checkpoint)) {
        reachedCheckpoints.push(checkpoint);
        console.log(`🎯 ¡${userName} (${deviceName}) llegó al checkpoint "${checkpoint.name}"!`);
      }
    });

    return reachedCheckpoints;
  };

  // Obtener un checkpoint por ID
  const getCheckpointById = (id: string) => {
    return checkpoints.value.find(cp => cp.id === id);
  };

  // Activar/Desactivar checkpoint
  const toggleCheckpoint = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const updatedCheckpoint = await checkpointsService.toggleStatus(id);
      
      // Actualizar en el estado local
      const index = checkpoints.value.findIndex(cp => cp.id === id);
      if (index !== -1) {
        checkpoints.value[index] = updatedCheckpoint;
      }
      
      console.log(`✅ Checkpoint ${updatedCheckpoint.active ? 'activado' : 'desactivado'}`);
      return updatedCheckpoint.active;
    } catch (err) {
      error.value = 'Error al cambiar estado del checkpoint';
      console.error('❌ Error cambiando estado:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Cargar checkpoints automáticamente al usar el composable
  if (!checkpointsLoaded) {
    loadCheckpoints();
  }

  return {
    checkpoints,
    activeCheckpoints,
    isLoading,
    error,
    loadCheckpoints,
    createCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
    checkLocation,
    getCheckpointById,
    toggleCheckpoint,
  };
};
