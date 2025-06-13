<template>
  <div class="habit-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <!-- Nama Kebiasaan -->
        <div class="form-group full-width">
          <label for="name" class="form-label required">Nama Kebiasaan</label>
          <input
            id="name"
            v-model="habitData.name"
            type="text"
            class="form-input"
            placeholder="Masukkan nama kebiasaan"
            required
            autofocus
          />
        </div>

        <!-- Deskripsi -->
        <div class="form-group full-width">
          <label for="description" class="form-label">Deskripsi</label>
          <textarea
            id="description"
            v-model="habitData.description"
            class="form-textarea"
            placeholder="Tambahkan deskripsi kebiasaan"
            rows="3"
          ></textarea>
        </div>

        <!-- Frekuensi & Nilai Frekuensi -->
        <div class="form-group">
          <label for="frequency" class="form-label required">Frekuensi</label>
          <select id="frequency" v-model="habitData.frequency" class="form-select" required>
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
          </select>
        </div>

        <div class="form-group">
          <label for="frequencyValue" class="form-label required">
            {{ frequencyValueLabel }}
          </label>
          <select 
            v-if="habitData.frequency === 'weekly'" 
            id="frequencyValue" 
            v-model="habitData.frequencyValue" 
            class="form-select"
            required
          >
            <option value="1">Minggu</option>
            <option value="2">Senin</option>
            <option value="3">Selasa</option>
            <option value="4">Rabu</option>
            <option value="5">Kamis</option>
            <option value="6">Jumat</option>
            <option value="7">Sabtu</option>
          </select>
          <input
            v-else-if="habitData.frequency === 'monthly'"
            id="frequencyValue"
            v-model.number="habitData.frequencyValue"
            type="number"
            min="1"
            max="31"
            class="form-input"
            required
          />
          <input
            v-else
            type="hidden"
            v-model.number="habitData.frequencyValue"
            value="1"
          />
        </div>

        <!-- Tanggal Mulai & Kategori -->
        <div class="form-group">
          <label for="startDate" class="form-label">Tanggal Mulai</label>
          <input
            id="startDate"
            v-model="habitData.startDate"
            type="date"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="category" class="form-label">Kategori</label>
          <div class="select-with-add">
            <select id="category" v-model="habitData.category" class="form-select">
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

        <!-- Target & Pengingat -->
        <div class="form-group">
          <label for="targetCount" class="form-label required">Target Harian</label>
          <input
            id="targetCount"
            v-model.number="habitData.targetCount"
            type="number"
            min="1"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="reminder" class="form-label">Pengingat</label>
          <input
            id="reminder"
            v-model="habitData.reminder"
            type="time"
            class="form-input"
          />
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
          <!-- Warna -->
          <div class="form-group">
            <label for="color" class="form-label">Warna</label>
            <input
              id="color"
              v-model="habitData.color"
              type="color"
              class="form-input color-input"
            />
          </div>

          <!-- Ikon -->
          <div class="form-group">
            <label for="icon" class="form-label">Ikon</label>
            <select id="icon" v-model="habitData.icon" class="form-select">
              <option value="📝">📝 Catatan</option>
              <option value="💧">💧 Air</option>
              <option value="🏃">🏃 Olahraga</option>
              <option value="📚">📚 Belajar</option>
              <option value="🧘">🧘 Meditasi</option>
              <option value="💊">💊 Obat</option>
              <option value="🥗">🥗 Makanan Sehat</option>
              <option value="😴">😴 Tidur</option>
              <option value="🚭">🚭 Berhenti Merokok</option>
              <option value="💰">💰 Menabung</option>
            </select>
          </div>

          <!-- Tingkat Kesulitan -->
          <div class="form-group">
            <label for="difficulty" class="form-label">Tingkat Kesulitan</label>
            <div class="range-input-container">
              <input
                id="difficulty"
                v-model.number="habitData.difficulty"
                type="range"
                min="1"
                max="5"
                step="1"
                class="range-input"
              />
              <div class="range-value">{{ difficultyText }}</div>
            </div>
          </div>

          <!-- Catatan -->
          <div class="form-group full-width">
            <label for="notes" class="form-label">Catatan</label>
            <textarea
              id="notes"
              v-model="habitData.notes"
              class="form-textarea"
              placeholder="Tambahkan catatan untuk kebiasaan ini"
              rows="2"
            ></textarea>
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
          :disabled="isSubmitting || !habitData.name"
        >
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>{{ habit ? 'Simpan Perubahan' : 'Tambah Kebiasaan' }}</span>
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

// Define interfaces
interface Habit {
  id?: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  frequencyValue: number;
  startDate?: string;
  category?: string;
  targetCount: number;
  reminder?: string;
  color?: string;
  icon?: string;
  difficulty?: number;
  notes?: string;
  archived?: boolean;
}

const props = defineProps({
  habit: {
    type: Object as () => Habit | null,
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
const newCategory = ref('');
const newCategoryInput = ref<HTMLInputElement | null>(null);

// Initialize habit data
const habitData = reactive<Habit>({
  name: props.habit?.name || '',
  description: props.habit?.description || '',
  frequency: props.habit?.frequency || 'daily',
  frequencyValue: props.habit?.frequencyValue || 1,
  startDate: props.habit?.startDate ? formatDateForInput(new Date(props.habit.startDate)) : formatDateForInput(new Date()),
  category: props.habit?.category || '',
  targetCount: props.habit?.targetCount || 1,
  reminder: props.habit?.reminder || '',
  color: props.habit?.color || '#5469FF',
  icon: props.habit?.icon || '📝',
  difficulty: props.habit?.difficulty || 3,
  notes: props.habit?.notes || '',
  archived: props.habit?.archived || false
});

// Format date for date input
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Computed properties
const frequencyValueLabel = computed(() => {
  switch (habitData.frequency) {
    case 'weekly':
      return 'Hari dalam Minggu';
    case 'monthly':
      return 'Tanggal dalam Bulan';
    default:
      return '';
  }
});

const difficultyText = computed(() => {
  const difficultyMap = [
    'Sangat Mudah',
    'Mudah',
    'Sedang',
    'Sulit',
    'Sangat Sulit'
  ];
  
  return difficultyMap[habitData.difficulty ? habitData.difficulty - 1 : 2];
});

// Methods
function toggleAdvancedDetails() {
  showAdvancedDetails.value = !showAdvancedDetails.value;
}

function addNewCategory() {
  const category = newCategory.value.trim();
  if (category) {
    habitData.category = category;
    emit('add-category', category);
    showAddCategoryModal.value = false;
    newCategory.value = '';
  }
}

function handleSubmit() {
  // Clone habit data to avoid reactivity issues
  const habitToSubmit = JSON.parse(JSON.stringify(habitData));
  
  // Add ID if its an existing habit
  if (props.habit?.id) {
    habitToSubmit.id = props.habit.id;
  }
  
  // Convert date string to Date object if exists
  if (habitToSubmit.startDate) {
    habitToSubmit.startDate = new Date(habitToSubmit.startDate);
  }
  
  emit('submit', habitToSubmit);
}

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
.habit-form {
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

.color-input {
  height: 40px;
  padding: 2px;
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