<template>
  <div class="task-list">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Memuat tugas...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <Button @click="fetchTasks" variant="secondary" size="sm">
        Coba Lagi
      </Button>
    </div>
    
    <div v-else-if="tasks.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>Belum Ada Tugas</h3>
      <p>Tugas yang Anda buat akan muncul di sini.</p>
      <Button @click="$emit('add-task')" variant="primary">
        Tambah Tugas Baru
      </Button>
    </div>
    
    <template v-else>
      <TransitionGroup name="list" tag="div" class="tasks-container">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id" 
          class="task-item-wrapper"
        >
          <TaskItem 
            :task="task"
            @update-status="updateTaskStatus"
            @edit="$emit('edit-task', task)"
            @delete="confirmDelete(task)"
          />
        </div>
      </TransitionGroup>
      
      <div v-if="filteredTasks.length === 0" class="no-results">
        <p>Tidak ada tugas yang sesuai dengan filter Anda.</p>
        <Button @click="resetFilters" variant="secondary" size="sm">
          Reset Filter
        </Button>
      </div>
    </template>
    
    <!-- Dialog Konfirmasi Hapus -->
    <Modal 
      v-model="showDeleteConfirm"
      :title="'Hapus Tugas'" 
      @close="cancelDelete"
    >
      <p>Apakah Anda yakin ingin menghapus tugas <strong>{{ taskToDelete?.title }}</strong>?</p>
      <div class="modal-actions">
        <Button @click="cancelDelete" variant="secondary">
          Batal
        </Button>
        <Button @click="deleteTask" variant="danger">
          Hapus
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TaskItem from './TaskItem.vue';
import Button from '../ui/Button.vue';
import Modal from '../ui/Modal.vue';

// Definisikan tipe untuk Task
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  category?: string;
  tags?: string[];
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number;
  actualTime?: number;
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Props
const props = defineProps<{
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  filters?: {
    status?: string;
    priority?: string;
    search?: string;
    category?: string;
    tag?: string;
  };
  sortBy?: {
    field: string;
    order: 'asc' | 'desc';
  };
}>();

// Emit events
const emit = defineEmits<{
  (e: 'update-task', task: Task): void;
  (e: 'delete-task', id: string): void;
  (e: 'add-task'): void;
  (e: 'edit-task', task: Task): void;
  (e: 'refresh'): void;
}>();

// Local state
const showDeleteConfirm = ref(false);
const taskToDelete = ref<Task | null>(null);

// Computed properties
const filteredTasks = computed(() => {
  let result = [...props.tasks];
  
  // Filter berdasarkan status
  if (props.filters?.status) {
    result = result.filter(task => task.status === props.filters?.status);
  }
  
  // Filter berdasarkan prioritas
  if (props.filters?.priority) {
    result = result.filter(task => task.priority === props.filters?.priority);
  }
  
  // Filter berdasarkan kategori
  if (props.filters?.category) {
    result = result.filter(task => task.category === props.filters?.category);
  }
  
  // Filter berdasarkan tag
  if (props.filters?.tag) {
    result = result.filter(task => task.tags?.includes(props.filters?.tag || ''));
  }
  
  // Filter berdasarkan pencarian
  if (props.filters?.search) {
    const searchLower = props.filters.search.toLowerCase();
    result = result.filter(task => 
      task.title.toLowerCase().includes(searchLower) || 
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort tasks
  if (props.sortBy) {
    const { field, order } = props.sortBy;
    
    result.sort((a: any, b: any) => {
      let valueA = a[field];
      let valueB = b[field];
      
      // Perlakuan khusus untuk date fields
      if (field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }
  
  return result;
});

// Methods
const updateTaskStatus = (task: Task) => {
  emit('update-task', task);
};

const confirmDelete = (task: Task) => {
  console.log('TaskList: Confirming delete for task:', task.id, task.title);
  taskToDelete.value = task;
  showDeleteConfirm.value = true;
  console.log('TaskList: showDeleteConfirm set to:', showDeleteConfirm.value);
};

const cancelDelete = () => {
  console.log('TaskList: Delete cancelled');
  showDeleteConfirm.value = false;
  console.log('TaskList: showDeleteConfirm set to:', showDeleteConfirm.value);
  taskToDelete.value = null;
};

const deleteTask = () => {
  if (taskToDelete.value) {
    const taskId = taskToDelete.value.id;
    console.log('TaskList: Emitting delete-task event for task ID:', taskId);
    console.log('TaskList: Task to delete:', JSON.stringify(taskToDelete.value));
    console.log('TaskList: Task ID type:', typeof taskId);
    
    // Double check task ID exists and is string
    if (!taskId) {
      console.error('TaskList: Task ID is missing or invalid:', taskId);
      return;
    }
    
    emit('delete-task', taskId);
    showDeleteConfirm.value = false;
    taskToDelete.value = null;
  } else {
    console.error('TaskList: Attempted to delete task but taskToDelete is null');
  }
};

const resetFilters = () => {
  emit('refresh');
};

const fetchTasks = () => {
  emit('refresh');
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.task-list {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.error-message p {
  color: #ef4444;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f9fafb;
}

.empty-state p {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.task-item-wrapper {
  transition: all 0.3s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform 0.5s ease;
}

.no-results {
  text-align: center;
  padding: 1.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style> 