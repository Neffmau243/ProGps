<template>
  <div class="icons-example">
    <h1>🎨 Ejemplos de Iconos con Unplugin-Icons</h1>
    
    <!-- Método 1: Importación directa -->
    <section class="example-section">
      <h2>Método 1: Importación Directa</h2>
      <p class="description">Importa los iconos directamente como componentes Vue</p>
      
      <div class="icons-grid">
        <div class="icon-item">
          <IconUser class="icon-display" />
          <span class="icon-label">Usuario</span>
        </div>
        
        <div class="icon-item">
          <IconDevice class="icon-display" />
          <span class="icon-label">Dispositivo</span>
        </div>
        
        <div class="icon-item">
          <IconMap class="icon-display" />
          <span class="icon-label">Mapa</span>
        </div>
        
        <div class="icon-item">
          <IconLocation class="icon-display" />
          <span class="icon-label">Ubicación</span>
        </div>
        
        <div class="icon-item">
          <IconDashboard class="icon-display" />
          <span class="icon-label">Dashboard</span>
        </div>
        
        <div class="icon-item">
          <IconSearch class="icon-display" />
          <span class="icon-label">Buscar</span>
        </div>
      </div>
      
      <div class="code-example">
        <pre><code>&lt;script setup&gt;
import IconUser from '~icons/mdi/account'
import IconDevice from '~icons/mdi/cellphone'
&lt;/script&gt;

&lt;template&gt;
  &lt;IconUser /&gt;
  &lt;IconDevice /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </section>

    <!-- Método 2: Componente wrapper -->
    <section class="example-section">
      <h2>Método 2: Componente Wrapper (Recomendado)</h2>
      <p class="description">Usa el componente Icon con nombres dinámicos</p>
      
      <div class="icons-grid">
        <div class="icon-item">
          <Icon name="mdi:account" :size="48" />
          <span class="icon-label">Usuario</span>
        </div>
        
        <div class="icon-item">
          <Icon name="mdi:cellphone" :size="48" />
          <span class="icon-label">Dispositivo</span>
        </div>
        
        <div class="icon-item">
          <Icon name="mdi:map" :size="48" />
          <span class="icon-label">Mapa</span>
        </div>
        
        <div class="icon-item">
          <Icon name="mdi:map-marker" :size="48" color="var(--color-neon-green)" />
          <span class="icon-label">Ubicación</span>
        </div>
      </div>
      
      <div class="code-example">
        <pre><code>&lt;script setup&gt;
import Icon from '@/components/common/Icon.vue'
&lt;/script&gt;

&lt;template&gt;
  &lt;Icon name="mdi:account" :size="48" /&gt;
  &lt;Icon name="mdi:cellphone" :size="48" /&gt;
  &lt;Icon name="mdi:map-marker" color="green" /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </section>

    <!-- Diferentes colecciones -->
    <section class="example-section">
      <h2>Diferentes Colecciones de Iconos</h2>
      
      <div class="collection-group">
        <h3>Material Design Icons (MDI)</h3>
        <div class="icons-grid">
          <Icon name="mdi:account" :size="40" />
          <Icon name="mdi:cellphone" :size="40" />
          <Icon name="mdi:map" :size="40" />
          <Icon name="mdi:bell" :size="40" />
          <Icon name="mdi:cog" :size="40" />
        </div>
      </div>
      
      <div class="collection-group">
        <h3>Solar Icons</h3>
        <div class="icons-grid">
          <Icon name="solar:user-bold" :size="40" />
          <Icon name="solar:smartphone-bold" :size="40" />
          <Icon name="solar:map-bold" :size="40" />
          <Icon name="solar:bell-bold" :size="40" />
          <Icon name="solar:settings-bold" :size="40" />
        </div>
      </div>
      
      <div class="collection-group">
        <h3>Heroicons</h3>
        <div class="icons-grid">
          <Icon name="heroicons:user" :size="40" />
          <Icon name="heroicons:device-phone-mobile" :size="40" />
          <Icon name="heroicons:map" :size="40" />
          <Icon name="heroicons:bell" :size="40" />
          <Icon name="heroicons:cog-6-tooth" :size="40" />
        </div>
      </div>
    </section>

    <!-- Tamaños -->
    <section class="example-section">
      <h2>Diferentes Tamaños</h2>
      <div class="sizes-demo">
        <Icon name="mdi:account" size="xs" />
        <Icon name="mdi:account" size="sm" />
        <Icon name="mdi:account" size="md" />
        <Icon name="mdi:account" size="lg" />
        <Icon name="mdi:account" size="xl" />
        <Icon name="mdi:account" size="2xl" />
      </div>
      
      <div class="code-example">
        <pre><code>&lt;Icon name="mdi:account" size="xs" /&gt;  &lt;!-- 16px --&gt;
&lt;Icon name="mdi:account" size="sm" /&gt;  &lt;!-- 20px --&gt;
&lt;Icon name="mdi:account" size="md" /&gt;  &lt;!-- 24px --&gt;
&lt;Icon name="mdi:account" size="lg" /&gt;  &lt;!-- 32px --&gt;
&lt;Icon name="mdi:account" size="xl" /&gt;  &lt;!-- 48px --&gt;
&lt;Icon name="mdi:account" size="2xl" /&gt; &lt;!-- 64px --&gt;
&lt;Icon name="mdi:account" :size="100" /&gt; &lt;!-- Custom --&gt;</code></pre>
      </div>
    </section>

    <!-- Colores -->
    <section class="example-section">
      <h2>Diferentes Colores</h2>
      <div class="colors-demo">
        <Icon name="mdi:heart" :size="48" color="#FF0000" />
        <Icon name="mdi:heart" :size="48" color="#00FF00" />
        <Icon name="mdi:heart" :size="48" color="#0000FF" />
        <Icon name="mdi:heart" :size="48" color="var(--color-neon-green)" />
        <Icon name="mdi:heart" :size="48" color="currentColor" />
      </div>
    </section>

    <!-- Uso en botones -->
    <section class="example-section">
      <h2>Uso en Botones</h2>
      <div class="buttons-demo">
        <button class="btn-primary">
          <Icon name="mdi:plus" :size="20" />
          Crear Usuario
        </button>
        
        <button class="btn-secondary">
          <Icon name="mdi:pencil" :size="20" />
          Editar
        </button>
        
        <button class="btn-danger">
          <Icon name="mdi:delete" :size="20" />
          Eliminar
        </button>
        
        <button class="btn-icon">
          <Icon name="mdi:cog" :size="24" />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Método 1: Importación directa
import IconUser from '~icons/mdi/account'
import IconDevice from '~icons/mdi/cellphone'
import IconMap from '~icons/mdi/map'
import IconLocation from '~icons/mdi/map-marker'
import IconDashboard from '~icons/mdi/view-dashboard'
import IconSearch from '~icons/mdi/magnify'

// Método 2: Componente wrapper
import Icon from '@/components/common/Icon.vue'
</script>

<style scoped>
.icons-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

h1 {
  font-size: var(--font-size-4xl);
  color: var(--color-neon-green);
  margin-bottom: var(--space-2xl);
  text-align: center;
}

.example-section {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  margin-bottom: var(--space-2xl);
}

.example-section h2 {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.description {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.icon-item:hover {
  background-color: var(--bg-tertiary);
  transform: translateY(-2px);
}

.icon-display {
  font-size: 48px;
  color: var(--color-neon-green);
}

.icon-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.code-example {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.collection-group {
  margin-bottom: var(--space-xl);
}

.collection-group h3 {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.sizes-demo {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.colors-demo {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.buttons-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.btn-primary,
.btn-secondary,
.btn-danger,
.btn-icon {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all var(--transition-base);
}

.btn-primary {
  background-color: var(--color-neon-green);
  color: var(--color-black);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--border-default);
}

.btn-danger {
  background-color: rgba(255, 59, 59, 0.2);
  color: var(--color-error);
  border: 1px solid var(--color-error);
}

.btn-icon {
  padding: var(--space-sm);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-default);
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-danger:hover,
.btn-icon:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
</style>
