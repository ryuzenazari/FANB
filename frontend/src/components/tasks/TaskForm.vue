<template>
  <div class="task-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <!-- Judul Tugas -->
        <div class="form-group full-width">
          <label for="title" class="form-label required">Judul Tugas</label>
          <input
            id="title"
            v-model="taskData.title"
            type="text"
            class="form-input"
            placeholder="Masukkan judul tugas"
            required
            autofocus
          />
        </div>

        <!-- Deskripsi -->
        <div class="form-group full-width">
          <label for="description" class="form-label">Deskripsi</label>
          <textarea
            id="description"
            v-model="taskData.description"
            class="form-textarea"
            placeholder="Tambahkan deskripsi tugas"
            rows="3"
          ></textarea>
        </div>

        <!-- Prioritas & Status -->
        <div class="form-group">
          <label for="priority" class="form-label required">Prioritas</label>
          <select id="priority" v-model="taskData.priority" class="form-select" required>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            <option value="urgent">Mendesak</option>
          </select>
        </div>

        <div class="form-group">
          <label for="status" class="form-label required">Status</label>
          <select id="status" v-model="taskData.status" class="form-select" required>
            <option value="todo">Akan Dikerjakan</option>
            <option value="in-progress">Sedang Dikerjakan</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        <!-- Tenggat Waktu & Kategori -->
        <div class="form-group">
          <label for="dueDate" class="form-label">Tenggat Waktu</label>
          <input
            id="dueDate"
            v-model="taskData.dueDate"
            type="datetime-local"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="category" class="form-label">Kategori</label>
          <div class="select-with-add">
            <select id="category" v-model="taskData.category" class="form-select">
              <option value="">Tanpa Kategori</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <button 
              type="button" 
              class="add-category-btn" 
              @click="showAddCategoryModal = true"
            >
              +
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-group full-width">
          <label class="form-label">Tags</label>
          <div class="tags-input">
            <div class="tags-container" v-if="taskData.tags && taskData.tags.length > 0">
              <span 
                v-for="(tag, index) in taskData.tags" 
                :key="index" 
                class="tag-item"
              >
                #{{ tag }}
                <button 
                  type="button" 
                  class="remove-tag" 
                  @click="removeTag(index)"
                >×</button>
              </span>
            </div>
            
            <div class="add-tag-input">
              <input
                v-model="newTag"
                type="text"
                placeholder="Tambahkan tag"
                class="form-input tag-input"
                @keydown.enter.prevent="addTag"
              />
              <button 
                type="button" 
                class="add-tag-btn" 
                @click="addTag"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <button 
            type="button" 
            class="toggle-advanced-btn"
            @click="toggleAdvancedDetails"
          >
            {{ showAdvancedDetails ? 'Sembunyikan Detail Lanjutan' : 'Tampilkan Detail Lanjutan' }}
            <span class="toggle-icon">{{ showAdvancedDetails ? '▲' : '▼' }}</span>
          </button>
        </div>

        <!-- Detail Lanjutan -->
        <div v-if="showAdvancedDetails" class="advanced-details full-width">
          <!-- Estimasi Waktu -->
          <div class="form-group">
            <label for="estimatedTime" class="form-label">Estimasi Waktu (menit)</label>
            <input
              id="estimatedTime"
              v-model.number="taskData.estimatedTime"
              type="number"
              min="0"
              class="form-input"
            />
          </div>

          <!-- Tingkat Kesulitan -->
          <div class="form-group">
            <label for="difficulty" class="form-label">Tingkat Kesulitan</label>
            <div class="range-input-container">
              <input
                id="difficulty"
                v-model.number="taskData.difficulty"
                type="range"
                min="1"
                max="5"
                step="1"
                class="range-input"
              />
              <div class="range-value">{{ difficultyText }}</div>
            </div>
          </div>

          <!-- Kebutuhan Energi -->
          <div class="form-group">
            <label class="form-label">Kebutuhan Energi</label>
            <div class="radio-options">
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="taskData.energy"
                  value="low"
                  name="energy" 
                />
                <span>Rendah</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="taskData.energy"
                  value="medium"
                  name="energy" 
                />
                <span>Sedang</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="taskData.energy"
                  value="high"
                  name="energy" 
                />
                <span>Tinggi</span>
              </label>
            </div>
          </div>

          <!-- Konteks -->
          <div class="form-group">
            <label for="context" class="form-label">Konteks</label>
            <select id="context" v-model="taskData.context" class="form-select">
              <option value="work">Pekerjaan</option>
              <option value="personal">Pribadi</option>
              <option value="home">Rumah</option>
              <option value="errands">Tugas Luar</option>
              <option value="education">Pendidikan</option>
              <option value="health">Kesehatan</option>
              <option value="finance">Keuangan</option>
              <option value="social">Sosial</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <!-- Subtasks -->
          <div class="form-group full-width">
            <label class="form-label">Subtasks</label>
            
            <div class="subtasks-list" v-if="taskData.subtasks && taskData.subtasks.length > 0">
              <div 
                v-for="(subtask, index) in taskData.subtasks" 
                :key="index"
                class="subtask-item"
              >
                <div class="subtask-content">
                  <input 
                    type="checkbox" 
                    v-model="subtask.completed" 
                    :id="`subtask-${index}`"
                    class="subtask-checkbox"
                  />
                  <input
                    v-model="subtask.title"
                    type="text"
                    :placeholder="`Subtask ${index + 1}`"
                    class="form-input subtask-input"
                    required
                  />
                </div>
                <button 
                  type="button" 
                  class="remove-subtask-btn" 
                  @click="removeSubtask(index)"
                >
                  ×
                </button>
              </div>
            </div>
            
            <button 
              type="button" 
              class="add-subtask-btn" 
              @click="addSubtask"
            >
              + Tambah Subtask
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="$emit('cancel')">
          Batal
        </button>
        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="isSubmitting || !taskData.title"
        >
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>{{ task ? 'Simpan Perubahan' : 'Tambah Tugas' }}</span>
        </button>
      </div>

      <!-- Modal untuk kategori baru -->
      <div v-if="showAddCategoryModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Kategori Baru</h3>
          
          <div class="form-group">
            <input
              v-model="newCategory"
              type="text"
              class="form-input"
              placeholder="Nama kategori"
              ref="newCategoryInput"
              @keydown.enter="addNewCategory"
            />
          </div>
          
          <div class="modal-actions">
            <button 
              type="button" 
              class="cancel-btn" 
              @click="showAddCategoryModal = false"
            >
              Batal
            </button>
            <button 
              type="button" 
              class="submit-btn" 
              @click="addNewCategory" 
              :disabled="!newCategory"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces
interface Subtask {
  id?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface Task {
  id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  category?: string;
  tags?: string[];
  dueDate?: string;
  estimatedTime?: number;
  difficulty?: number;
  energy?: 'low' | 'medium' | 'high';
  context?: string;
  subtasks?: Subtask[];
}

const props = defineProps({
  task: {
    type: Object as () => Task | null,
    default: null
  },
  categories: {
    type: Array as () => string[],
    default: () => []
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel', 'add-category']);

// Form state
const showAdvancedDetails = ref(false);
const showAddCategoryModal = ref(false);
const newTag = ref('');
const newCategory = ref('');
const newCategoryInput = ref<HTMLInputElement | null>(null);

// Initialize task data
const taskData = reactive<Task>({
  title: props.task?.title || '',
  description: props.task?.description || '',
  priority: props.task?.priority || 'medium',
  status: props.task?.status || 'todo',
  category: props.task?.category || '',
  tags: props.task?.tags ? [...props.task.tags] : [],
  dueDate: props.task?.dueDate ? formatDateForInput(new Date(props.task.dueDate)) : '',
  estimatedTime: props.task?.estimatedTime || 0,
  difficulty: props.task?.difficulty || 3,
  energy: props.task?.energy || 'medium',
  context: props.task?.context || 'work',
  subtasks: props.task?.subtasks ? 
    props.task.subtasks.map(st => ({ 
      id: st.id, 
      title: st.title, 
      completed: st.completed,
      createdAt: st.createdAt
    })) : []
});

// Format date for datetime-local input
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Methods
function toggleAdvancedDetails() {
  showAdvancedDetails.value = !showAdvancedDetails.value;
}

function addTag() {
  const tag = newTag.value.trim();
  if (tag && (!taskData.tags || !taskData.tags.includes(tag))) {
    if (!taskData.tags) {
      taskData.tags = [];
    }
    taskData.tags.push(tag);
    newTag.value = '';
  }
}

function removeTag(index: number) {
  if (taskData.tags) {
    taskData.tags.splice(index, 1);
  }
}

function addSubtask() {
  if (!taskData.subtasks) {
    taskData.subtasks = [];
  }
  
  taskData.subtasks.push({
    id: uuidv4(),
    title: '',
    completed: false,
    createdAt: new Date()
  });
}

function removeSubtask(index: number) {
  if (taskData.subtasks) {
    taskData.subtasks.splice(index, 1);
  }
}

function addNewCategory() {
  const category = newCategory.value.trim();
  if (category) {
    taskData.category = category;
    emit('add-category', category);
    showAddCategoryModal.value = false;
    newCategory.value = '';
  }
}

function handleSubmit() {
  // Clone task data to avoid reactivity issues
  const taskToSubmit = JSON.parse(JSON.stringify(taskData));
  
  // Add ID if its a new task
  if (props.task?.id) {
    taskToSubmit.id = props.task.id;
  }
  
  // Convert date string to Date object
  if (taskToSubmit.dueDate) {
    taskToSubmit.dueDate = new Date(taskToSubmit.dueDate);
  }
  
  // Process subtasks
  if (taskToSubmit.subtasks && taskToSubmit.subtasks.length > 0) {
    taskToSubmit.subtasks = taskToSubmit.subtasks.filter(
      (subtask: Subtask) => subtask.title.trim() !== ''
    );
  }
  
  emit('submit', taskToSubmit);
}

// Computed properties
const difficultyText = computed(() => {
  const difficultyMap = [
    'Sangat Mudah',
    'Mudah',
    'Sedang',
    'Sulit',
    'Sangat Sulit'
  ];
  
  return difficultyMap[taskData.difficulty ? taskData.difficulty - 1 : 2];
});

// Handle modal focus
watch(() => showAddCategoryModal.value, (newValue) => {
  if (newValue) {
    nextTick(() => {
      newCategoryInput.value?.focus();
    });
  }
});
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #f9fafb;
  font-size: 0.875rem;
  width: 100%;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #4f90f2;
  box-shadow: 0 0 0 1px rgba(79, 144, 242, 0.5);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.range-input-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-input {
  flex: 1;
  appearance: none;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #4f90f2;
  border-radius: 50%;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #4f90f2;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.range-value {
  font-size: 0.75rem;
  color: #9ca3af;
  min-width: 80px;
  text-align: right;
}

.radio-options {
  display: flex;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #d1d5db;
}

.radio-option input {
  margin: 0;
  cursor: pointer;
}

.select-with-add {
  display: flex;
  gap: 0.5rem;
}

.select-with-add .form-select {
  flex: 1;
}

.add-category-btn {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #d1d5db;
  width: 36px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.add-category-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  background-color: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-tag {
  background: none;
  border: none;
  color: #818cf8;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.remove-tag:hover {
  opacity: 1;
}

.add-tag-input {
  display: flex;
  gap: 0.5rem;
}

.tag-input {
  flex: 1;
}

.add-tag-btn {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #d1d5db;
  padding: 0 0.75rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-tag-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.toggle-advanced-btn {
  background: none;
  border: none;
  color: #4f90f2;
  padding: 0;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.toggle-advanced-btn:hover {
  text-decoration: underline;
}

.toggle-icon {
  font-size: 0.625rem;
}

.advanced-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  margin-top: 0.5rem;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subtask-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.subtask-checkbox {
  width: 16px;
  height: 16px;
}

.subtask-input {
  flex: 1;
}

.remove-subtask-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.2s;
}

.remove-subtask-btn:hover {
  color: #ef4444;
}

.add-subtask-btn {
  background: none;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  width: 100%;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-subtask-btn:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: #d1d5db;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  border-radius: 6px;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.submit-btn {
  background-color: #4f90f2;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #3b82f6;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 1rem;
}

.modal-content {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f9fafb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Responsive */
@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .advanced-details {
    grid-template-columns: 1fr 1fr;
  }
}
</style> 