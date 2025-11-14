<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)">✕</button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

const getIcon = (type: string) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };
  return icons[type as keyof typeof icons] || 'ℹ️';
};

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Date.now().toString();
  const duration = toast.duration || 3000;
  
  toasts.value.push({ ...toast, id });
  
  setTimeout(() => {
    removeToast(id);
  }, duration);
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

defineExpose({ addToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: calc(var(--navbar-height) + var(--space-lg));
  right: var(--space-lg);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
}

.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-error);
}

.toast-warning {
  border-left: 4px solid var(--color-maintenance);
}

.toast-info {
  border-left: 4px solid var(--color-info);
}

.toast-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.toast-close {
  background: none;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  padding: var(--space-xs);
  line-height: 1;
  transition: all var(--transition-base);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: var(--bg-tertiary);
  color: var(--color-neon-green);
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-base);
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
