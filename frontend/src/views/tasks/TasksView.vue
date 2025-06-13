<template>
  <div class="tasks-view">
    <div class="page-header">
      <div class="left-section">
        <h1>Manajemen Tugas</h1>
        <p class="subtitle">Kelola dan pantau tugas-tugas Anda</p>
      </div>
      
      <div class="actions">
        <button 
          class="add-task-btn" 
          @click="openTaskModal('add')"
        >
          Tambah Tugas
        </button>
      </div>
    </div>

    <div class="task-summary">
      <div class="summary-card">
        <div class="summary-icon tasks-icon">📋</div>
        <div class="summary-info">
          <span class="summary-label">Total Tugas</span>
          <span class="summary-value">{{ taskStore.totalTasks }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon pending-icon">⏳</div>
        <div class="summary-info">
          <span class="summary-label">Belum Selesai</span>
          <span class="summary-value">{{ taskStore.pendingTasks.length }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon completed-icon">✅</div>
        <div class="summary-info">
          <span class="summary-label">Selesai</span>
          <span class="summary-value">{{ taskStore.completedTasks.length }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon overdue-icon">⚠️</div>
        <div class="summary-info">
          <span class="summary-label">Terlambat</span>
          <span class="summary-value">{{ taskStore.overdueTasksCount }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon today-icon">📅</div>
        <div class="summary-info">
          <span class="summary-label">Hari Ini</span>
          <span class="summary-value">{{ taskStore.todayTasksCount }}</span>
        </div>
      </div>
    </div>

    <div class="task-container">
      <TaskFilters 
        :categories="taskStore.categories"
        :tags="taskStore.tags"
        :initial-filters="taskStore.filters"
        :initial-sort="{ field: taskStore.sortBy }"
        @update-filters="handleFilterUpdate"
        @update-sort="handleSortUpdate"
      />

      <div class="tasks-main">
        <TaskList 
          :tasks="formattedTasks"
          :loading="taskStore.isLoading"
          :error="taskStore.error"
          @update-task="handleTaskUpdate"
          @delete-task="handleTaskDelete"
          @edit-task="openTaskModal('edit', $event)"
          @add-task="openTaskModal('add')"
          @refresh="debouncedFetch(taskStore.currentPage)"
        />
        
        <!-- Pagination -->
        <div class="pagination" v-if="taskStore.totalPages > 1">
          <button 
            class="pagination-btn prev" 
            :disabled="taskStore.currentPage <= 1"
            @click="goToPage(taskStore.currentPage - 1)"
          >
            &laquo; Sebelumnya
          </button>
          
          <div class="page-status">
            Halaman {{ taskStore.currentPage }} dari {{ taskStore.totalPages }}
          </div>
          
          <button 
            class="pagination-btn next" 
            :disabled="taskStore.currentPage >= taskStore.totalPages"
            @click="goToPage(taskStore.currentPage + 1)"
          >
            Berikutnya &raquo;
          </button>
        </div>
      </div>
    </div>
    
    <!-- Task Modal -->
    <Modal 
      v-if="showTaskModal" 
      v-model="showTaskModal"
      :title="taskModalMode === 'add' ? 'Tambah Tugas Baru' : 'Edit Tugas'"
      size="lg"
      @close="closeTaskModal"
    >
      <TaskForm 
        :task="selectedTask"
        :categories="taskStore.categories"
        :is-submitting="isSubmitting"
        @submit="saveTask"
        @cancel="closeTaskModal"
      />
    </Modal>

    <!-- Global notification -->
    <div 
      v-if="notification.show" 
      class="notification"
      :class="[notification.type]"
    >
      {{ notification.message }}
      <button class="close-notification" @click="clearNotification">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, onUnmounted, defineExpose } from 'vue';
import { useTaskStore } from '../../store/task';
import TaskList from '../../components/tasks/TaskList.vue';
import TaskFilters from '../../components/tasks/TaskFilters.vue';
import TaskForm from '../../components/tasks/TaskForm.vue';
import Modal from '../../components/ui/Modal.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import axios from '../../plugins/axios';

// Store
const taskStore = useTaskStore();
const authStore = useAuthStore();
const route = useRoute();

// Computed
const formattedTasks = computed(() => {
  return taskStore.tasks.map(task => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt)
  }));
});

// Request handling
let lastFetchTimeout: number | null = null;
const isRequestPending = ref(false);

const debouncedFetch = (page: number = 1, wait: number = 300) => {
  // Jangan fetch jika user tidak login
  if (!authStore.isLoggedIn) {
    console.log('Skipping task fetch: User not logged in');
    return;
  }

  if (lastFetchTimeout) {
    clearTimeout(lastFetchTimeout);
  }

  if (isRequestPending.value) {
    console.log('Request already pending, debouncing...');
    return;
  }

  lastFetchTimeout = window.setTimeout(async () => {
    try {
      isRequestPending.value = true;
      await taskStore.fetchTasks(page);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      isRequestPending.value = false;
      lastFetchTimeout = null;
    }
  }, wait);
};

// State
const showTaskModal = ref(false);
const taskModalMode = ref<'add' | 'edit'>('add');
const selectedTask = ref<any>(null);
const isSubmitting = ref(false);
const notification = reactive({
  show: false,
  message: '',
  type: 'success',
  timeout: null as number | null
});

// Define event handler untuk open-new-task-form
const handleOpenNewTask = () => openTaskModal('add');

// Lifecycle Hooks
onMounted(() => {
  console.log('TasksView mounted - Fetching tasks...');
  
  // Debug detailed info about axios configuration
  console.log('Axios base URL:', axios.defaults.baseURL);
  console.log('Current environment mode:', import.meta.env.MODE);
  console.log('Current API URL:', import.meta.env.MODE === 'development' ? '/api' : '/api');
  
  // Try to fetch tasks only if user is logged in
  if (authStore.isLoggedIn) {
    console.log('User is logged in, fetching tasks...');
    debouncedFetch(1, 0);
  } else {
    console.log('User is not logged in, skipping task fetch');
  }
  
  // Debug info
  const token = localStorage.getItem('user-token');
  console.log('Current token exists:', !!token);
  if (token) {
    console.log('Token first 15 chars:', token.substring(0, 15) + '...');
  }
  console.log('Current route:', route.path);
  
  // Tambahkan listener untuk melihat apakah ada perubahan di store
  setTimeout(() => {
    console.log('Tasks after fetch:', taskStore.tasks.length);
    console.log('Task store error:', taskStore.error);
    console.log('Task store loading:', taskStore.loading);
  }, 2000);
  
  // Tambahkan listener untuk event open-new-task-form
  window.addEventListener('open-new-task-form', handleOpenNewTask);
});

// Hapus event listener saat komponen dihapus
onUnmounted(() => {
  window.removeEventListener('open-new-task-form', handleOpenNewTask);
});

// Methods
const handleFilterUpdate = (filters: any) => {
  taskStore.updateFilters(filters);
  debouncedFetch(1, 300); // Reset to page 1 when filters change
};

const handleSortUpdate = (sortBy: string) => {
  taskStore.updateSort(sortBy);
  debouncedFetch(taskStore.currentPage, 300);
};

const openTaskModal = (mode: 'add' | 'edit', task?: any) => {
  taskModalMode.value = mode;
  selectedTask.value = mode === 'edit' ? task : null;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const saveTask = async (taskData: any) => {
  try {
    isSubmitting.value = true;
    
    // Cek jika category adalah string (bukan ID) dan hapus
    // Kategori baru akan ditangani saat menciptakan task di backend
    if (taskData.category && !taskData.category.match(/^[0-9a-fA-F]{24}$/)) {
      const categoryName = taskData.category;
      console.log('Category is not an ObjectId, handling as new category:', categoryName);
      // Menyimpan nama kategori sebagai string biasa
      taskData.categoryName = categoryName;
      delete taskData.category;
    }
    
    if (taskModalMode.value === 'add') {
      await taskStore.createTask(taskData);
      showNotification('Tugas berhasil ditambahkan', 'success');
    } else {
      await taskStore.updateTask(taskData.id, taskData);
      showNotification('Tugas berhasil diperbarui', 'success');
    }
    
    // Refresh task list
    debouncedFetch(taskStore.currentPage);
    
    // Close modal after successful save
    closeTaskModal();
  } catch (error: any) {
    showNotification(error?.message || 'Terjadi kesalahan saat menyimpan tugas', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const handleTaskUpdate = async (task: any) => {
  try {
    await taskStore.updateTask(task.id, task);
    showNotification('Tugas berhasil diperbarui', 'success');
    debouncedFetch(taskStore.currentPage);
  } catch (error: any) {
    showNotification(error || 'Terjadi kesalahan saat memperbarui tugas', 'error');
  }
};

const handleTaskDelete = async (taskId: string) => {
  try {
    console.log('TasksView: Handling task delete for ID:', taskId);
    console.log('TasksView: Task ID type:', typeof taskId);
    
    // Cek apakah task dengan ID ini ada di state
    const taskExists = taskStore.tasks.some(t => {
      console.log(`Comparing task ${t.id} (${typeof t.id}) with ${taskId} (${typeof taskId})`);
      return t.id === taskId;
    });
    console.log('Task exists in state before deletion:', taskExists);
    
    const result = await taskStore.deleteTask(taskId);
    console.log('TasksView: Delete result:', result);
    
    if (result.success) {
      showNotification('Tugas berhasil dihapus', 'success');
      console.log('TasksView: Refreshing task list after delete');
      debouncedFetch(taskStore.currentPage);
    } else {
      showNotification(result.message || 'Gagal menghapus tugas', 'error');
    }
  } catch (error: any) {
    console.error('TasksView: Error in handleTaskDelete:', error);
    showNotification(error?.message || 'Terjadi kesalahan saat menghapus tugas', 'error');
  }
};

const goToPage = (page: number) => {
  if (page < 1 || page > taskStore.totalPages) return;
  debouncedFetch(page, 0);
  
  // Scroll to top of task list
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  // Clear any existing notification timeout
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }
  
  // Set new notification
  notification.show = true;
  notification.message = message;
  notification.type = type;
  
  // Auto-hide after 5 seconds
  notification.timeout = window.setTimeout(() => {
    clearNotification();
  }, 5000);
};

const clearNotification = () => {
  notification.show = false;
  
  if (notification.timeout) {
    clearTimeout(notification.timeout);
    notification.timeout = null;
  }
};

// Ekspos metode untuk diakses dari luar
defineExpose({
  openTaskModal
});

</script>

<style scoped>
.tasks-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.add-task-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-task-btn:hover {
  background-color: #2563eb;
}

.task-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
}

.summary-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.summary-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.tasks-icon {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.pending-icon {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.completed-icon {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.overdue-icon {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.today-icon {
  background-color: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

.summary-info {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f9fafb;
}

.task-container {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
}

.tasks-main {
  margin-top: 1rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pagination-btn {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-status {
  font-size: 0.875rem;
  color: #9ca3af;
}

.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 100;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
}

.notification.success {
  background-color: #10b981;
}

.notification.error {
  background-color: #ef4444;
}

.notification.warning {
  background-color: #f59e0b;
}

.close-notification {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: auto;
}

.close-notification:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .tasks-view {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .task-summary {
    grid-template-columns: 1fr 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-status {
    order: -1;
    margin-bottom: 0.5rem;
  }
}
</style> 