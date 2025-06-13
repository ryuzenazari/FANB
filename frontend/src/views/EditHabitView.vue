<template>
  <div class="edit-habit-view">
    <header class="page-header">
      <h1>Edit Kebiasaan</h1>
      <p class="subtitle">Perbarui detail kebiasaan Anda</p>
    </header>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="goBack" class="back-btn">Kembali</button>
    </div>
    
    <div v-else-if="!habitData" class="error-state">
      <p>Kebiasaan tidak ditemukan</p>
      <button @click="goBack" class="back-btn">Kembali</button>
    </div>

    <div v-else class="habit-form-container">
      <form @submit.prevent="saveHabit" class="habit-form">
        <!-- Nama Kebiasaan -->
        <div class="form-group full-width">
          <label for="name" class="form-label required">Nama Kebiasaan</label>
          <input
            id="name"
            v-model="habitData.name"
            type="text"
            class="form-input"
            placeholder="Contoh: Olahraga, Membaca buku, Minum air putih"
            required
          />
        </div>

        <!-- Deskripsi -->
        <div class="form-group full-width">
          <label for="description" class="form-label">Deskripsi</label>
          <textarea
            id="description"
            v-model="habitData.description"
            class="form-textarea"
            placeholder="Jelaskan kebiasaan ini dengan lebih detail"
            rows="3"
          ></textarea>
        </div>

        <!-- Kategori & Icon -->
        <div class="form-group">
          <label for="category" class="form-label">Kategori</label>
          <div class="select-with-add">
            <select id="category" v-model="habitData.category" class="form-select">
              <option value="">Tanpa Kategori</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="produktivitas">Produktivitas</option>
              <option value="pembelajaran">Pembelajaran</option>
              <option value="kebugaran">Kebugaran</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="keuangan">Keuangan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="icon" class="form-label">Ikon</label>
          <div class="icon-selector">
            <button 
              type="button" 
              class="selected-icon"
              @click="showIconPicker = !showIconPicker"
            >
              {{ habitData.icon || '📌' }}
            </button>
            
            <div v-if="showIconPicker" class="icon-picker">
              <div class="icon-grid">
                <button 
                  v-for="icon in availableIcons" 
                  :key="icon" 
                  type="button"
                  class="icon-option"
                  @click="selectIcon(icon)"
                >
                  {{ icon }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Frekuensi -->
        <div class="form-group full-width">
          <label class="form-label required">Frekuensi</label>
          <div class="frequency-options">
            <div 
              class="frequency-option" 
              :class="{ active: habitData.frequency === 'daily' }"
              @click="setFrequency('daily')"
            >
              <span class="icon">📅</span>
              <span class="label">Harian</span>
            </div>
            
            <div 
              class="frequency-option" 
              :class="{ active: habitData.frequency === 'weekly' }"
              @click="setFrequency('weekly')"
            >
              <span class="icon">📆</span>
              <span class="label">Mingguan</span>
            </div>
            
            <div 
              class="frequency-option" 
              :class="{ active: habitData.frequency === 'monthly' }"
              @click="setFrequency('monthly')"
            >
              <span class="icon">🗓️</span>
              <span class="label">Bulanan</span>
            </div>
          </div>
        </div>

        <!-- Frekuensi Detail -->
        <div class="form-group full-width" v-if="habitData.frequency === 'weekly'">
          <label class="form-label">Hari dalam Seminggu</label>
          <div class="days-selector">
            <button 
              v-for="(day, index) in daysOfWeek" 
              :key="day"
              type="button"
              class="day-btn"
              :class="{ selected: habitData.frequencyValue === index + 1 }"
              @click="habitData.frequencyValue = index + 1"
            >
              {{ day }}
            </button>
          </div>
        </div>

        <div class="form-group full-width" v-if="habitData.frequency === 'monthly'">
          <label class="form-label">Tanggal dalam Sebulan</label>
          <div class="date-selector">
            <input 
              type="number" 
              v-model.number="habitData.frequencyValue"
              min="1"
              max="31"
              class="form-input"
            />
          </div>
        </div>

        <!-- Target -->
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
          <label for="unit" class="form-label">Satuan</label>
          <input
            id="unit"
            v-model="habitData.unit"
            type="text"
            class="form-input"
            placeholder="kali, menit, gelas, dll."
          />
        </div>

        <!-- Pengingat -->
        <div class="form-group full-width">
          <div class="checkbox-group">
            <input 
              type="checkbox" 
              id="enableReminder" 
              v-model="habitData.reminderEnabled"
            />
            <label for="enableReminder">Aktifkan Pengingat</label>
          </div>
        </div>

        <div class="form-group full-width" v-if="habitData.reminderEnabled">
          <label for="reminderTime" class="form-label">Waktu Pengingat</label>
          <input
            id="reminderTime"
            v-model="habitData.reminderTime"
            type="time"
            class="form-input"
          />
        </div>

        <!-- Catatan -->
        <div class="form-group full-width">
          <label for="notes" class="form-label">Catatan Tambahan</label>
          <textarea
            id="notes"
            v-model="habitData.notes"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <!-- Status -->
        <div class="form-group full-width">
          <div class="checkbox-group">
            <input 
              type="checkbox" 
              id="archived" 
              v-model="habitData.archived"
            />
            <label for="archived">Arsipkan Kebiasaan</label>
          </div>
        </div>

        <!-- Tombol Submit -->
        <div class="form-actions">
          <button 
            type="button" 
            class="cancel-btn" 
            @click="goBack"
            :disabled="isSubmitting"
          >
            Batal
          </button>
          
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting || !isFormValid"
          >
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHabitStore } from '../store/habit';
import type { Habit, HabitInput } from '../store/habit';

// Store & Router
const habitStore = useHabitStore();
const router = useRouter();
const route = useRoute();

// State
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const showIconPicker = ref(false);
const habitData = ref<HabitInput | null>(null);

const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const availableIcons = [
  '📌', '✅', '🏃', '💪', '🧘', '📚', '💧', '🍎', '🥦', '😴', 
  '🧠', '💼', '💰', '🎯', '⏰', '🎵', '✍️', '🎨', '🧹', '🌱'
];

// Computed
const isFormValid = computed(() => {
  if (!habitData.value) return false;
  
  return habitData.value.name.trim() !== '' && 
    habitData.value.targetCount > 0;
});

// Lifecycle
onMounted(async () => {
  const habitId = route.params.id as string;
  
  try {
    // Cek apakah ada habit yang sedang diedit dari store
    if (habitStore.editingHabit && habitStore.editingHabit.id === habitId) {
      initializeForm(habitStore.editingHabit);
    } else {
      // Jika tidak ada, fetch dari API
      await habitStore.fetchHabits();
      const habit = habitStore.habits.find(h => h.id === habitId);
      
      if (habit) {
        initializeForm(habit);
      } else {
        error.value = 'Kebiasaan tidak ditemukan';
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data kebiasaan';
  } finally {
    isLoading.value = false;
  }
});

// Methods
const initializeForm = (habit: Habit) => {
  habitData.value = {
    name: habit.name,
    description: habit.description || '',
    category: habit.category || '',
    icon: habit.icon,
    frequency: habit.frequency,
    frequencyValue: habit.frequencyValue,
    targetCount: habit.targetCount,
    unit: habit.unit,
    color: habit.color || '#4F46E5',
    reminderEnabled: habit.reminderEnabled,
    reminderTime: habit.reminderTime || '08:00',
    notes: habit.notes || '',
    startDate: habit.startDate
  };
  
  // Tambahan property untuk edit
  (habitData.value as any).archived = habit.archived;
};

const setFrequency = (frequency: 'daily' | 'weekly' | 'monthly') => {
  if (!habitData.value) return;
  
  habitData.value.frequency = frequency;
  
  // Reset frequency value based on selected frequency
  if (frequency === 'daily') {
    habitData.value.frequencyValue = 1;
  } else if (frequency === 'weekly') {
    habitData.value.frequencyValue = 1; // Sunday by default
  } else if (frequency === 'monthly') {
    habitData.value.frequencyValue = 1; // 1st day of month by default
  }
};

const selectIcon = (icon: string) => {
  if (!habitData.value) return;
  
  habitData.value.icon = icon;
  showIconPicker.value = false;
};

const saveHabit = async () => {
  if (!habitData.value || !isFormValid.value) return;
  
  try {
    isSubmitting.value = true;
    const habitId = route.params.id as string;
    
    // Extract properties for update
    const updateData: Partial<HabitInput> = {
      name: habitData.value.name,
      description: habitData.value.description,
      category: habitData.value.category,
      icon: habitData.value.icon,
      frequency: habitData.value.frequency,
      frequencyValue: habitData.value.frequencyValue,
      targetCount: habitData.value.targetCount,
      unit: habitData.value.unit,
      color: habitData.value.color,
      reminderEnabled: habitData.value.reminderEnabled,
      reminderTime: habitData.value.reminderTime,
      notes: habitData.value.notes
    };
    
    await habitStore.updateHabit(habitId, updateData);
    
    // Handle archive/unarchive if changed
    const habit = habitStore.habits.find(h => h.id === habitId);
    if (habit && (habitData.value as any).archived !== habit.archived) {
      if ((habitData.value as any).archived) {
        await habitStore.archiveHabit(habitId);
      } else {
        await habitStore.unarchiveHabit(habitId);
      }
    }
    
    // Show success notification
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Kebiasaan berhasil diperbarui!',
        type: 'success'
      }
    }));
    
    // Redirect to habits page
    router.push('/habits');
  } catch (error: any) {
    // Show error notification
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: error?.message || 'Gagal memperbarui kebiasaan',
        type: 'error'
      }
    }));
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push('/habits');
};
</script>

<style scoped>
.edit-habit-view {
  max-width: 800px;
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

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.back-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.habit-form-container {
  background: var(--surface-1);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.habit-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.required::after {
  content: "*";
  color: var(--error);
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--surface-2);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-textarea {
  resize: vertical;
}

.select-with-add {
  display: flex;
  gap: 0.5rem;
}

.select-with-add .form-select {
  flex: 1;
}

/* Icon Selector */
.icon-selector {
  position: relative;
}

.selected-icon {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.5rem;
  background: var(--surface-2);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
}

.icon-picker {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.icon-option {
  padding: 0.5rem;
  font-size: 1.25rem;
  background: var(--surface-2);
  border: 1px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-option:hover {
  background: var(--surface-3);
  transform: scale(1.1);
}

/* Frequency Options */
.frequency-options {
  display: flex;
  gap: 1rem;
}

.frequency-option {
  flex: 1;
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--surface-2);
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
}

.frequency-option .icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.frequency-option .label {
  font-weight: 500;
}

.frequency-option.active {
  border-color: var(--primary);
  background: rgba(79, 70, 229, 0.1);
}

/* Days Selector */
.days-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.day-btn {
  padding: 0.5rem 0;
  min-width: 3rem;
  text-align: center;
  background: var(--surface-2);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-btn.selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
}

/* Form Actions */
.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: var(--surface-2);
  border: none;
  color: var(--text-primary);
}

.submit-btn {
  background: var(--primary);
  border: none;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: var(--surface-3);
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.cancel-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .habit-form {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
  
  .frequency-options {
    flex-direction: column;
  }
}
</style> 