<template>
  <div 
    v-if="show" 
    class="loading-spinner-container" 
    :class="{ 'loading-spinner-fullscreen': fullscreen, 'loading-spinner-overlay': overlay }"
  >
    <div class="loading-spinner" :class="`loading-spinner-${size}`">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLoadingStore } from '@/store/loading';

interface Props {
  show?: boolean;
  fullscreen?: boolean;
  overlay?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  loadingKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: undefined,
  fullscreen: false,
  overlay: true,
  size: 'medium',
  message: '',
  loadingKey: ''
});

const loadingStore = useLoadingStore();

const show = computed(() => {
  // Jika show diatur secara eksplisit, gunakan itu
  if (typeof props.show !== 'undefined') {
    return props.show;
  }

  // Jika loadingKey diatur, gunakan status dari store
  if (props.loadingKey) {
    return loadingStore.isComponentLoading(props.loadingKey);
  }

  // Default ke true jika tidak ada kondisi yang ditentukan
  return true;
});
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 999;
}

.loading-spinner-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.85);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner-small {
  transform: scale(0.5);
}

.loading-spinner-medium {
  transform: scale(0.75);
}

.loading-spinner-large {
  transform: scale(1);
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 50px;
  height: 50px;
}

.path {
  stroke: var(--primary-color, #6366f1);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.loading-message {
  margin-top: 1rem;
  color: var(--text-primary, #374151);
  font-size: 0.875rem;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style> 