<template>
  <div class="bootstrap-icons-example">
    <h1>🎨 Bootstrap Icons - Ejemplos</h1>
    
    <!-- Método 1: Uso directo con clases -->
    <section class="example-section">
      <h2>Método 1: Uso Directo (Más Simple)</h2>
      <p class="description">Usa las clases de Bootstrap Icons directamente</p>
      
      <div class="icons-grid">
        <div class="icon-item">
          <i class="bi bi-person icon-display"></i>
          <span class="icon-label">bi-person</span>
        </div>
        
        <div class="icon-item">
          <i class="bi bi-phone icon-display"></i>
          <span class="icon-label">bi-phone</span>
        </div>
        
        <div class="icon-item">
          <i class="bi bi-map icon-display"></i>
          <span class="icon-label">bi-map</span>
        </div>
        
        <div class="icon-item">
          <i class="bi bi-geo-alt icon-display"></i>
          <span class="icon-label">bi-geo-alt</span>
        </div>
        
        <div class="icon-item">
          <i class="bi bi-speedometer2 icon-display"></i>
          <span class="icon-label">bi-speedometer2</span>
        </div>
        
        <div class="icon-item">
          <i class="bi bi-people icon-display"></i>
          <span class="icon-label">bi-people</span>
        </div>
      </div>
      
      <div class="code-example">
        <pre><code>&lt;i class="bi bi-person"&gt;&lt;/i&gt;
&lt;i class="bi bi-phone"&gt;&lt;/i&gt;
&lt;i class="bi bi-map"&gt;&lt;/i&gt;</code></pre>
      </div>
    </section>

    <!-- Método 2: Componente wrapper -->
    <section class="example-section">
      <h2>Método 2: Componente Wrapper (Recomendado)</h2>
      <p class="description">Usa el componente BootstrapIcon para mayor flexibilidad</p>
      
      <div class="icons-grid">
        <div class="icon-item">
          <BootstrapIcon name="person" :size="48" />
          <span class="icon-label">person</span>
        </div>
        
        <div class="icon-item">
          <BootstrapIcon name="phone" :size="48" />
          <span class="icon-label">phone</span>
        </div>
        
        <div class="icon-item">
          <BootstrapIcon name="map" :size="48" />
          <span class="icon-label">map</span>
        </div>
        
        <div class="icon-item">
          <BootstrapIcon name="geo-alt" :size="48" color="var(--color-neon-green)" />
          <span class="icon-label">geo-alt</span>
        </div>
      </div>
      
      <div class="code-example">
        <pre><code>&lt;BootstrapIcon name="person" :size="48" /&gt;
&lt;BootstrapIcon name="phone" :size="48" /&gt;
&lt;BootstrapIcon name="geo-alt" color="green" /&gt;</code></pre>
      </div>
    </section>

    <!-- Tamaños -->
    <section class="example-section">
      <h2>Diferentes Tamaños</h2>
      
      <div class="sizes-demo">
        <i class="bi bi-person fs-6"></i>
        <i class="bi bi-person fs-5"></i>
        <i class="bi bi-person fs-4"></i>
        <i class="bi bi-person fs-3"></i>
        <i class="bi bi-person fs-2"></i>
        <i class="bi bi-person fs-1"></i>
      </div>
      
      <div class="code-example">
        <pre><code>&lt;i class="bi bi-person fs-6"&gt;&lt;/i&gt;  &lt;!-- Extra pequeño --&gt;
&lt;i class="bi bi-person fs-5"&gt;&lt;/i&gt;  &lt;!-- Pequeño --&gt;
&lt;i class="bi bi-person fs-4"&gt;&lt;/i&gt;  &lt;!-- Normal --&gt;
&lt;i class="bi bi-person fs-3"&gt;&lt;/i&gt;  &lt;!-- Mediano --&gt;
&lt;i class="bi bi-person fs-2"&gt;&lt;/i&gt;  &lt;!-- Grande --&gt;
&lt;i class="bi bi-person fs-1"&gt;&lt;/i&gt;  &lt;!-- Extra grande --&gt;</code></pre>
      </div>
    </section>

    <!-- Colores -->
    <section class="example-section">
      <h2>Diferentes Colores</h2>
      
      <div class="colors-demo">
        <i class="bi bi-heart-fill fs-1" style="color: #FF0000"></i>
        <i class="bi bi-heart-fill fs-1" style="color: #00FF00"></i>
        <i class="bi bi-heart-fill fs-1" style="color: #0000FF"></i>
        <i class="bi bi-heart-fill fs-1" style="color: var(--color-neon-green)"></i>
      </div>
    </section>

    <!-- Iconos comunes del proyecto -->
    <section class="example-section">
      <h2>Iconos del Proyecto GPS</h2>
      
      <div class="project-icons">
        <div class="icon-category">
          <h3>Navegación</h3>
          <div class="icons-row">
            <div class="icon-box">
              <i class="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-people"></i>
              <span>Usuarios</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-phone"></i>
              <span>Dispositivos</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-map"></i>
              <span>Mapa</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-geo-alt"></i>
              <span>Ubicación</span>
            </div>
          </div>
        </div>
        
        <div class="icon-category">
          <h3>Acciones</h3>
          <div class="icons-row">
            <div class="icon-box">
              <i class="bi bi-plus-circle"></i>
              <span>Agregar</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-pencil"></i>
              <span>Editar</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-trash"></i>
              <span>Eliminar</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-search"></i>
              <span>Buscar</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-arrow-clockwise"></i>
              <span>Actualizar</span>
            </div>
          </div>
        </div>
        
        <div class="icon-category">
          <h3>Estados</h3>
          <div class="icons-row">
            <div class="icon-box">
              <i class="bi bi-check-circle text-success"></i>
              <span>Éxito</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-exclamation-triangle text-warning"></i>
              <span>Advertencia</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-x-circle text-danger"></i>
              <span>Error</span>
            </div>
            <div class="icon-box">
              <i class="bi bi-info-circle text-info"></i>
              <span>Info</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Uso en botones -->
    <section class="example-section">
      <h2>Uso en Botones</h2>
      
      <div class="buttons-demo">
        <button class="btn-primary">
          <i class="bi bi-plus-circle"></i>
          Crear Usuario
        </button>
        
        <button class="btn-secondary">
          <i class="bi bi-pencil"></i>
          Editar
        </button>
        
        <button class="btn-danger">
          <i class="bi bi-trash"></i>
          Eliminar
        </button>
        
        <button class="btn-icon">
          <i class="bi bi-gear"></i>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BootstrapIcon from '@/components/common/BootstrapIcon.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
</script>

<style scoped>
.bootstrap-icons-example {
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
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: center;
  font-family: monospace;
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

.project-icons {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.icon-category h3 {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.icons-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  min-width: 100px;
}

.icon-box i {
  font-size: 32px;
}

.icon-box span {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
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
