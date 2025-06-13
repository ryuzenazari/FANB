<template>
  <div class="task-item" :class="{ 'completed': task.status === 'completed' }">
    <div class="task-header">
      <div class="task-status">
        <input 
          type="checkbox" 
          :checked="task.status === 'completed'" 
          @change="toggleStatus"
          class="task-checkbox"
        />
      </div>
      <div class="task-content">
        <h3 class="task-title">{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">{{ task.description }}</p>
        
        <div class="task-details">
          <div v-if="task.dueDate" class="detail-item due-date">
            <span class="detail-icon">🗓️</span>
            <span>{{ formatDate(task.dueDate) }}</span>
          </div>
          <div v-if="task.category" class="detail-item category">
            <span class="detail-icon">📂</span>
            <span>{{ task.category }}</span>
          </div>
        </div>
      </div>
      <div class="task-priority" :class="`priority-${task.priority}`">
        {{ priorityLabel }}
      </div>
    </div>
    
    <div class="task-footer">
      <div class="task-meta">
        <span class="created-at">
          Dibuat: {{ formatDateShort(task.createdAt) }}
        </span>
      </div>
      <div class="task-actions">
        <button @click="$emit('edit')" class="btn-edit">
          <span class="action-icon">✏️</span> Edit
        </button>
        <button @click="$emit('delete')" class="btn-delete">
          <span class="action-icon">🗑️</span> Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'update-status', task: Task): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const priorityLabel = computed(() => {
  switch(props.task.priority) {
    case 'low': return 'Rendah';
    case 'medium': return 'Sedang';
    case 'high': return 'Tinggi';
    case 'urgent': return 'Urgent';
    default: return props.task.priority;
  }
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateShort = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
};

const toggleStatus = () => {
  const updatedTask = { ...props.task };
  updatedTask.status = updatedTask.status === 'completed' ? 'todo' : 'completed';
  
  if (updatedTask.status === 'completed') {
    updatedTask.completedAt = new Date();
  } else {
    updatedTask.completedAt = undefined;
  }
  
  emit('update-status', updatedTask);
};
</script>

<style scoped>
.task-item {
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.task-item:hover {
  background-color: rgba(30, 41, 59, 0.8);
  transform: translateY(-2px);
}

.task-item.completed {
  opacity: 0.6;
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.task-status {
  padding-top: 0.25rem;
}

.task-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.completed .task-title {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-description {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.task-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background-color: rgba(255, 255, 255, 0.05);
}

.detail-icon {
  font-size: 0.875rem;
}

.due-date {
  color: #94a3b8;
}

.category {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.task-priority {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.priority-low {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.priority-medium {
  background-color: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.priority-high {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.priority-urgent {
  background-color: rgba(236, 72, 153, 0.2);
  color: #ec4899;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.created-at {
  color: #64748b;
  font-size: 0.75rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.action-icon {
  font-size: 0.875rem;
}

.btn-edit {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.btn-edit:hover {
  background-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.btn-delete {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}
</style> 