<template>
  <div class="habit-modal" v-if="isOpen">
    <div class="modal-overlay" @click.self="closeModal"></div>
    <div class="modal-container" :class="{ 'is-loading': isSubmitting }">
      <div class="modal-header">
        <h2>{{ mode === 'edit' ? 'Edit Kebiasaan' : 'Tambah Kebiasaan Baru' }}</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <HabitForm
          :habit="habit"
          :categories="categories"
          :is-submitting="isSubmitting"
          @submit="handleSubmit"
          @cancel="closeModal"
          @add-category="handleAddCategory"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { useHabitStore } from '../../store/habit';
import HabitForm from './HabitForm.vue';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add'
  },
  habit: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'update']);

// Store
const habitStore = useHabitStore();

// State
const isSubmitting = ref(false);
const categories = ref<string[]>([]);

// Methods
const closeModal = () => {
  if (isSubmitting.value) return;
  emit('close');
};

const handleSubmit = async (habitData: any) => {
  try {
    isSubmitting.value = true;
    
    if (props.mode === 'edit' && habitData.id) {
      await habitStore.updateHabit(habitData.id, habitData);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: 'Kebiasaan berhasil diperbarui',
          type: 'success'
        }
      }));
    } else {
      await habitStore.createHabit(habitData);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: 'Kebiasaan berhasil dibuat',
          type: 'success'
        }
      }));
    }
    
    emit('update');
    closeModal();
  } catch (error: any) {
    console.error('Error saving habit:', error);
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: error?.message || 'Terjadi kesalahan saat menyimpan kebiasaan',
        type: 'error'
      }
    }));
  } finally {
    isSubmitting.value = false;
  }
};

const handleAddCategory = (category: string) => {
  if (!categories.value.includes(category)) {
    categories.value.push(category);
  }
};

// Fetch categories when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    try {
      await habitStore.fetchCategories();
      categories.value = habitStore.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
});
</script>

<style scoped>
.habit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  background-color: #1e293b;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 101;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #f1f5f9;
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.is-loading {
  position: relative;
}

.is-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.is-loading::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 11;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
}
</style> 