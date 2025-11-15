<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">
            <i :class="['bi', isEdit ? 'bi-pencil' : 'bi-plus-circle']"></i>
            {{ isEdit ? 'Editar Checkpoint' : 'Nuevo Checkpoint' }}
          </h2>
          <button class="modal-close" @click="close" title="Cerrar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-body">
          <!-- Nombre -->
          <div class="form-group">
            <label class="form-label" for="checkpoint-name">
              <i class="bi bi-tag"></i>
              Nombre del Checkpoint
            </label>
            <input
              id="checkpoint-name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Ej: Oficina Central, Punto de Control 1..."
              required
            />
          </div>

          <!-- Buscador de Dirección -->
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-search"></i>
              Buscar Ubicación por Dirección
            </label>
            
            <!-- Ciudad y País -->
            <div class="form-row">
              <div class="form-group" style="margin-bottom: var(--space-sm);">
                <input
                  v-model="searchCity"
                  type="text"
                  class="form-input"
                  placeholder="Ciudad (ej: Arequipa, Lima, Cusco...)"
                />
              </div>
              <div class="form-group" style="margin-bottom: var(--space-sm);">
                <input
                  v-model="searchCountry"
                  type="text"
                  class="form-input"
                  placeholder="País (ej: Perú)"
                />
              </div>
            </div>

            <!-- Búsqueda -->
            <div class="search-container">
              <input
                id="address-search"
                v-model="searchQuery"
                type="text"
                class="form-input"
                placeholder="Calle, avenida, plaza, hospital, universidad..."
                @input="searchAddressDebounced"
                @keyup.enter="searchAddress"
              />
              <button
                type="button"
                class="btn-search"
                @click="searchAddress"
                :disabled="isSearching || !searchQuery"
              >
                <i :class="['bi', isSearching ? 'bi-hourglass-split' : 'bi-search']"></i>
              </button>
            </div>
            <small class="form-hint">
              🔍 Escribe para ver sugerencias automáticas de lugares en {{ searchCity }}
            </small>
          </div>

          <!-- Resultados de búsqueda -->
          <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-header">
              <i class="bi bi-pin-map"></i>
              Selecciona una ubicación:
            </div>
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="result-item"
              @click="selectSearchResult(result)"
            >
              <i class="bi bi-geo-alt-fill"></i>
              <div class="result-info">
                <div class="result-name">{{ result.display_name }}</div>
              </div>
            </div>
          </div>

          <div class="divider">
            <span class="divider-text">o ingresa coordenadas manualmente</span>
          </div>

          <!-- Coordenadas -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="checkpoint-lat">
                <i class="bi bi-geo-alt"></i>
                Latitud
              </label>
              <input
                id="checkpoint-lat"
                v-model.number="formData.latitude"
                type="number"
                step="any"
                class="form-input"
                placeholder="-12.046374"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="checkpoint-lng">
                <i class="bi bi-geo-alt"></i>
                Longitud
              </label>
              <input
                id="checkpoint-lng"
                v-model.number="formData.longitude"
                type="number"
                step="any"
                class="form-input"
                placeholder="-77.042793"
                required
              />
            </div>
          </div>

          <!-- Botón de ubicación actual -->
          <div class="form-group">
            <button
              type="button"
              class="btn btn-location"
              @click="useCurrentLocation"
              :disabled="isLoadingLocation"
            >
              <i :class="['bi', isLoadingLocation ? 'bi-hourglass-split' : 'bi-crosshair']"></i>
              {{ isLoadingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual' }}
            </button>
            <small class="form-hint">
              💡 También puedes hacer clic en el mapa para elegir la ubicación
            </small>
          </div>

          <!-- Radio -->
          <div class="form-group">
            <label class="form-label" for="checkpoint-radius">
              <i class="bi bi-circle"></i>
              Radio (metros)
            </label>
            <input
              id="checkpoint-radius"
              v-model.number="formData.radius"
              type="number"
              min="10"
              max="1000"
              step="10"
              class="form-input"
              required
            />
            <small class="form-hint">
              El checkpoint será detectado cuando el usuario esté dentro de este radio
            </small>
          </div>

          <!-- Color -->
          <div class="form-group">
            <label class="form-label" for="checkpoint-color">
              <i class="bi bi-palette"></i>
              Color
            </label>
            <div class="color-picker">
              <div
                v-for="color in colorOptions"
                :key="color"
                class="color-option"
                :class="{ selected: formData.color === color }"
                :style="{ backgroundColor: color }"
                @click="formData.color = color"
                :title="color"
              ></div>
            </div>
          </div>

          <!-- Estado -->
          <div class="form-group">
            <label class="form-checkbox">
              <input
                v-model="formData.active"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-label">
                <i :class="['bi', formData.active ? 'bi-check-circle-fill' : 'bi-circle']"></i>
                Checkpoint activo
              </span>
            </label>
            <small class="form-hint">
              Solo los checkpoints activos se verificarán en tiempo real
            </small>
          </div>

          <!-- Botones -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
              <i class="bi bi-x-circle"></i>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i :class="['bi', isEdit ? 'bi-check-circle' : 'bi-plus-circle']"></i>
              {{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Checkpoint } from '@/composables/useCheckpoints';

interface Props {
  isOpen: boolean;
  checkpoint?: Checkpoint | null;
  prefilledCoords?: { latitude: number; longitude: number } | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', data: Omit<Checkpoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>): void;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  checkpoint: null,
  prefilledCoords: null,
});

const emit = defineEmits<Emits>();

const colorOptions = [
  '#C0F11C', // Verde neón
  '#00D9FF', // Cyan
  '#FF00FF', // Magenta
  '#FFD700', // Dorado
  '#FF6B6B', // Rojo coral
  '#4ECDC4', // Turquesa
  '#95E1D3', // Mint
  '#FFA500', // Naranja
];

const defaultFormData = {
  name: '',
  latitude: -12.046374,
  longitude: -77.042793,
  radius: 100,
  color: '#C0F11C',
  active: true,
};

const formData = ref({ ...defaultFormData });
const isEdit = ref(false);
const isLoadingLocation = ref(false);
const searchQuery = ref('');
const searchCity = ref('Arequipa');
const searchCountry = ref('Perú');
const isSearching = ref(false);
const searchResults = ref<any[]>([]);

// Cargar datos del checkpoint si está en modo edición o si hay coordenadas prellenadas
watch(() => [props.checkpoint, props.prefilledCoords] as const, ([newCheckpoint, newCoords]) => {
  if (newCheckpoint) {
    isEdit.value = true;
    formData.value = {
      name: newCheckpoint.name,
      latitude: newCheckpoint.latitude,
      longitude: newCheckpoint.longitude,
      radius: newCheckpoint.radius,
      color: newCheckpoint.color,
      active: newCheckpoint.active,
    };
  } else if (newCoords) {
    isEdit.value = false;
    formData.value = {
      ...defaultFormData,
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
    };
  } else {
    isEdit.value = false;
    formData.value = { ...defaultFormData };
  }
}, { immediate: true });

const close = () => {
  emit('close');
  // Reset form después de cerrar
  setTimeout(() => {
    formData.value = { ...defaultFormData };
    isEdit.value = false;
  }, 300);
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
  close();
};

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización');
    return;
  }

  isLoadingLocation.value = true;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.latitude = position.coords.latitude;
      formData.value.longitude = position.coords.longitude;
      isLoadingLocation.value = false;
      console.log('📍 Ubicación actual obtenida:', position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      isLoadingLocation.value = false;
      console.error('Error obteniendo ubicación:', error);
      alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

// Buscar dirección usando OpenCage API (2500 requests/día gratis, sin CORS)
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const searchAddress = async () => {
  if (!searchQuery.value || searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }

  if (!searchCity.value || !searchCountry.value) {
    alert('Por favor ingresa la ciudad y el país antes de buscar');
    return;
  }

  isSearching.value = true;

  try {
    // Usar OpenCage API (2500 requests/día gratis, sin CORS)
    const query = `${searchQuery.value}, ${searchCity.value}, ${searchCountry.value}`;
    
    // Token público de OpenCage
    const apiKey = 'c63386b4f77e46de817bdf94f051e027';
    
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?` +
      `key=${apiKey}` +
      `&q=${encodeURIComponent(query)}` +
      `&limit=10` +
      `&language=es` +
      `&countrycode=pe` +
      `&no_annotations=1`
    );

    if (!response.ok) {
      throw new Error('Error en la búsqueda');
    }

    const data = await response.json();
    
    // Convertir formato OpenCage
    searchResults.value = data.results.map((item: any) => ({
      lat: item.geometry.lat,
      lon: item.geometry.lng,
      display_name: item.formatted,
      properties: item
    }));

    console.log(`🔍 Resultados en ${searchCity.value}:`, searchResults.value.length);
  } catch (error) {
    console.error('Error buscando dirección:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// Búsqueda con debounce (autocompletado)
const searchAddressDebounced = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    searchAddress();
  }, 500); // Espera 500ms después de que el usuario deja de escribir
};

// Seleccionar un resultado de búsqueda
const selectSearchResult = (result: any) => {
  formData.value.latitude = parseFloat(result.lat);
  formData.value.longitude = parseFloat(result.lon);
  
  // Limpiar resultados
  searchResults.value = [];
  searchQuery.value = '';
  
  console.log('📍 Ubicación seleccionada:', result.display_name);
  console.log('Coordenadas:', formData.value.latitude, formData.value.longitude);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background-color: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 2px solid var(--border-default);
  background: linear-gradient(135deg, rgba(192, 241, 28, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.modal-close {
  background: none;
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all var(--transition-base);
}

.modal-close:hover {
  border-color: var(--color-inactive);
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--color-inactive);
}

.modal-body {
  padding: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-sm);
}

.form-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-neon-green);
  background-color: rgba(192, 241, 28, 0.05);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-hint {
  display: block;
  margin-top: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.color-picker {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.color-option {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 3px solid var(--border-default);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.color-option:hover {
  transform: scale(1.1);
  border-color: var(--color-text-primary);
}

.color-option.selected {
  border-color: var(--color-neon-green);
  border-width: 4px;
  transform: scale(1.15);
  box-shadow: 0 0 20px currentColor;
}

.color-option.selected::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-black);
  font-size: var(--font-size-xl);
  font-weight: var(--font-bold);
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  transition: all var(--transition-base);
}

.checkbox-label i {
  font-size: var(--font-size-xl);
  transition: all var(--transition-base);
}

.checkbox-input:checked + .checkbox-label i {
  color: var(--color-neon-green);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 2px solid var(--border-default);
}

.btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary {
  background-color: transparent;
  border-color: var(--border-default);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  border-color: var(--border-hover);
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-primary {
  background-color: var(--color-neon-green);
  border-color: var(--color-neon-green);
  color: var(--color-black);
}

.btn-primary:hover {
  background-color: #a8cc17;
  border-color: #a8cc17;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(192, 241, 28, 0.3);
}

.btn-location {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  border: 2px dashed var(--color-neon-green);
  border-radius: var(--radius-md);
  background-color: rgba(192, 241, 28, 0.05);
  color: var(--color-neon-green);
  font-weight: var(--font-medium);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-location:hover:not(:disabled) {
  background-color: rgba(192, 241, 28, 0.15);
  border-style: solid;
  transform: translateY(-2px);
}

.btn-location:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-location i {
  font-size: var(--font-size-lg);
}

/* Search Container */
.search-container {
  display: flex;
  gap: var(--space-xs);
}

.search-container .form-input {
  flex: 1;
}

.btn-search {
  width: 48px;
  height: 48px;
  background-color: var(--color-neon-green);
  border: 2px solid var(--color-neon-green);
  border-radius: var(--radius-md);
  color: var(--color-black);
  font-size: var(--font-size-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.btn-search:hover:not(:disabled) {
  background-color: #a8cc17;
  border-color: #a8cc17;
  transform: translateY(-2px);
}

.btn-search:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: var(--space-lg) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-default);
}

.divider-text {
  padding: 0 var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-style: italic;
}

/* Search Results */
.search-results {
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  margin-bottom: var(--space-lg);
  max-height: 300px;
  overflow-y: auto;
}

.results-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
  margin-bottom: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background-color: rgba(192, 241, 28, 0.03);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xs);
  cursor: pointer;
  transition: all var(--transition-base);
}

.result-item:hover {
  background-color: rgba(192, 241, 28, 0.15);
  border-color: var(--color-neon-green);
  transform: translateX(4px);
}

.result-item i {
  color: var(--color-neon-green);
  font-size: var(--font-size-lg);
  margin-top: 2px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
}

/* Scrollbar for search results */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.2);
}

.search-results::-webkit-scrollbar-thumb {
  background-color: var(--color-neon-green);
  border-radius: var(--radius-full);
}

/* Scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.2);
}

.modal-container::-webkit-scrollbar-thumb {
  background-color: var(--color-neon-green);
  border-radius: var(--radius-full);
}
</style>
