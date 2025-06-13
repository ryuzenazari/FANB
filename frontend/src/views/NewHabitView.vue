<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useHabitStore } from '../store/habit';

// Store & Router
const habitStore = useHabitStore();
const router = useRouter();

// State
const isSubmitting = ref(false);
const showIconPicker = ref(false);

const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const availableIcons = [
  '📌', '✅', '🏃', '💪', '🧘', '📚', '💧', '🍎', '🥦', '😴', 
  '🧠', '💼', '💰', '🎯', '⏰', '🎵', '✍️', '🎨', '🧹', '🌱'
];

type FrequencyType = 'daily' | 'weekly' | 'monthly';

const habitData = reactive({
  name: '',
  description: '',
  category: '',
  icon: '📌',
  frequency: 'daily' as FrequencyType,
  frequencyValue: 1,
  targetCount: 1,
  unit: 'kali',
  reminderEnabled: false,
  reminderTime: '08:00',
  notes: '',
  color: '#4F46E5'
});

// Computed
const isFormValid = computed(() => {
  return habitData.name.trim() !== '' && 
    habitData.targetCount > 0;
});

// Methods
const setFrequency = (frequency: FrequencyType) => {
  habitData.frequency = frequency;
  
  // Reset frequency value based on selected frequency
  if (frequency === 'daily') {
    habitData.frequencyValue = 1;
  } else if (frequency === 'weekly') {
    habitData.frequencyValue = 1; // Sunday by default
  } else if (frequency === 'monthly') {
    habitData.frequencyValue = 1; // 1st day of month by default
  }
};

const selectIcon = (icon: string) => {
  habitData.icon = icon;
  showIconPicker.value = false;
};

const saveHabit = async () => {
  if (!isFormValid.value) return;
  
  try {
    isSubmitting.value = true;
    
    await habitStore.createHabit({
      ...habitData,
      startDate: new Date().toISOString()
    });
    
    // Show success notification
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Kebiasaan berhasil dibuat!',
        type: 'success'
      }
    }));
    
    // Redirect to habits page
    router.push('/habits');
  } catch (error: any) {
    // Show error notification
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: error?.message || 'Gagal membuat kebiasaan baru',
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

<template>
  <div class="new-habit-view">
    <header class="page-header">
      <h1>Buat Kebiasaan Baru</h1>
      <p class="subtitle">Tambahkan kebiasaan baru untuk membangun rutinitas yang lebih baik</p>
    </header>

    <div class="habit-form-container">
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
            <span v-else>Simpan Kebiasaan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.new-habit-view {
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