<template>
  <div class="new-task-view">
    <header class="page-header">
      <h1>Buat Tugas Baru</h1>
      <p class="subtitle">Tambahkan tugas baru ke daftar tugas Anda</p>
    </header>

    <div class="task-form-container">
      <TaskForm
        :categories="taskStore.categories"
        :is-submitting="isSubmitting"
        @submit="saveTask"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '../../store/task';
import TaskForm from '../../components/tasks/TaskForm.vue';

// Store & Router
const taskStore = useTaskStore();
const router = useRouter();

// State
const isSubmitting = ref(false);

// Methods
const saveTask = async (taskData: any) => {
  try {
    isSubmitting.value = true;
    
    await taskStore.createTask(taskData);
    
    // Show success toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Tugas berhasil dibuat!',
        type: 'success'
      }
    }));
    
    // Redirect to tasks page
    router.push('/tasks');
  } catch (error: any) {
    // Show error toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: error?.message || 'Gagal membuat tugas baru',
        type: 'error'
      }
    }));
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push('/tasks');
};
</script>

<style scoped>
.new-task-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  color: var(--text-secondary);
}

.task-form-container {
  background: var(--surface-1);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 