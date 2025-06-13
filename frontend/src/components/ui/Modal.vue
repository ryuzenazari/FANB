<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => {
      return ['sm', 'md', 'lg', 'xl', 'full'].includes(value);
    }
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const closeModal = () => {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false);
    emit('close');
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.closeOnEsc && event.key === 'Escape' && props.modelValue) {
    closeModal();
  }
};

// Add keydown event listener
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

// Clean up
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

// Prevent body scrolling when modal is open
watch(() => props.modelValue, (newValue) => {
  console.log('Modal: modelValue changed to:', newValue);
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-backdrop" @click.self="closeModal">
        <div :class="['modal-container', `modal-${size}`]">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="closeModal">
              <span class="close-icon">×</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-container {
  background-color: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f9fafb;
}

.modal-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f9fafb;
}

.close-icon {
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.75rem;
}

/* Modal sizes */
.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 500px;
}

.modal-lg {
  max-width: 700px;
}

.modal-xl {
  max-width: 900px;
}

.modal-full {
  max-width: 96vw;
  max-height: 96vh;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container:not(.modal-full) {
    max-width: none;
    width: calc(100% - 2rem);
    margin: 0 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style> 