<script setup lang="ts">
import { ref, onMounted, computed, reactive, onUnmounted, defineExpose } from 'vue';
import { useHabitStore } from '../store/habit';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import type { Habit } from '../store/habit';

// Define emits
const emit = defineEmits(['open-habit-form']);

// Store & Router
const habitStore = useHabitStore();
const authStore = useAuthStore();
const router = useRouter();

// State
const loading = ref(true);
const showDeleteModal = ref(false);
const habitToDelete = ref<Habit | null>(null);

const filters = reactive({
  status: 'all',
  frequency: 'all',
  category: 'all',
  search: ''
});

// Define event handler untuk open-new-habit-form
const handleOpenNewHabit = () => {
  console.log('Opening habit form from HabitsView');
  router.push('/habits/new');
};

// Computed
const habits = computed(() => habitStore.habits);
const dailyHabits = computed(() => habitStore.dailyHabits);
const weeklyHabits = computed(() => habitStore.weeklyHabits);
const monthlyHabits = computed(() => habitStore.monthlyHabits);

const filteredHabits = computed(() => {
  let result = [...habitStore.habits];
  
  // Filter by status
  if (filters.status !== 'all') {
    result = result.filter(habit => 
      filters.status === 'active' ? !habit.archived : habit.archived
    );
  }
  
  // Filter by frequency
  if (filters.frequency !== 'all') {
    result = result.filter(habit => habit.frequency === filters.frequency);
  }
  
  // Filter by category
  if (filters.category !== 'all') {
    result = result.filter(habit => habit.category === filters.category);
  }
  
  // Filter by search term
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    result = result.filter(habit => 
      habit.name.toLowerCase().includes(searchTerm) || 
      (habit.description && habit.description.toLowerCase().includes(searchTerm))
    );
  }
  
  return result;
});

// Methods
const formatFrequency = (frequency: string, value: number) => {
  switch (frequency) {
    case 'daily':
      return 'Setiap hari';
    case 'weekly':
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return `Setiap ${days[value - 1]}`;
    case 'monthly':
      return `Tanggal ${value} setiap bulan`;
    default:
      return 'Tidak diatur';
  }
};

const toggleHabitCompletion = (habit: Habit) => {
  if (habit.completedToday) {
    habitStore.markHabitAsCompleted(habit.id, 0);
  } else {
    habitStore.markHabitAsCompleted(habit.id);
  }
};

const editHabit = (habit: Habit) => {
  localStorage.setItem('editingHabit', JSON.stringify(habit));
  router.push(`/habits/edit/${habit.id}`);
};

// Functions
const calculateProgress = (current: number, target: number) => {
  return Math.min(Math.round((current / target) * 100), 100);
};

const confirmDelete = (habitId: string) => {
  habitToDelete.value = habitStore.habits.find(habit => habit.id === habitId) as Habit;
  showDeleteModal.value = true;
};

const deleteHabit = async () => {
  if (!habitToDelete.value) return;
  
  try {
    await habitStore.deleteHabit(habitToDelete.value.id);
    showDeleteModal.value = false;
    habitToDelete.value = null;
    
    // Show success toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Kebiasaan berhasil dihapus',
        type: 'success'
      }
    }));
  } catch (error) {
    console.error('Error deleting habit:', error);
    
    // Show error toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Gagal menghapus kebiasaan',
        type: 'error'
      }
    }));
  }
};

const trackProgress = async (habit: Habit, value: number) => {
  try {
    // Menggunakan fungsi updateHabit untuk memperbarui progress
    await habitStore.updateHabit(habit.id, { 
      targetCount: value 
    });
    
    // Show success notification
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Kemajuan berhasil diperbarui',
        type: 'success'
      }
    }));
  } catch (error) {
    // Show error notification
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Gagal memperbarui kemajuan',
        type: 'error'
      }
    }));
  }
};

// Initialize
onMounted(async () => {
  try {
    // Hanya fetch habits jika user sudah login
    if (authStore.isLoggedIn) {
      console.log('User is logged in, fetching habits...');
      await habitStore.fetchHabits();
      
      // Periksa apakah ada error setelah fetch
      if (habitStore.error) {
        console.error('Error after fetching habits:', habitStore.error);
        
        // Show error toast
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            message: `Gagal memuat data kebiasaan: ${habitStore.error}`,
            type: 'error'
          }
        }));
      } else {
        console.log('Habits fetched successfully, count:', habitStore.habits.length);
      }
    } else {
      console.log('User is not logged in, skipping habits fetch');
    }
    
    // Tambahkan listener untuk event open-new-habit-form
    window.addEventListener('open-new-habit-form', handleOpenNewHabit);
  } catch (error) {
    console.error('Error in HabitsView onMounted:', error);
    
    // Show error toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: 'Gagal memuat data kebiasaan',
        type: 'error'
      }
    }));
  } finally {
    loading.value = false;
  }
});

// Hapus event listener saat komponen dihapus
onUnmounted(() => {
  window.removeEventListener('open-new-habit-form', handleOpenNewHabit);
});

// Ekspos metode untuk diakses dari luar
defineExpose({
  handleOpenNewHabit
});
</script>

<template>
  <div class="habits-view">
    <div class="page-header">
      <div class="left-section">
        <h1>Kebiasaan</h1>
        <p class="subtitle">Kelola dan pantau kebiasaan harian Anda</p>
      </div>
      
      <div class="actions">
        <button 
          class="add-habit-btn" 
          @click="$emit('open-habit-form')"
        >
          Tambah Kebiasaan
        </button>
      </div>
    </div>

    <div class="habit-summary">
      <div class="summary-card">
        <div class="summary-icon habits-icon">📊</div>
        <div class="summary-info">
          <span class="summary-label">Total Kebiasaan</span>
          <span class="summary-value">{{ habitStore.habits.length }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon active-icon">✅</div>
        <div class="summary-info">
          <span class="summary-label">Aktif</span>
          <span class="summary-value">{{ habitStore.habits.filter(h => !h.archived).length }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon streak-icon">🔥</div>
        <div class="summary-info">
          <span class="summary-label">Streak Terpanjang</span>
          <span class="summary-value">{{ habitStore.longestStreak }} hari</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon completed-icon">🎯</div>
        <div class="summary-info">
          <span class="summary-label">Selesai Hari Ini</span>
          <span class="summary-value">{{ habitStore.habits.filter(h => h.completedToday).length }}</span>
        </div>
      </div>
    </div>

    <div class="habits-container">
      <div class="habits-filters">
        <div class="filter-group">
          <label for="filter-status">Status</label>
          <select id="filter-status" v-model="filters.status" class="filter-select">
            <option value="all">Semua</option>
            <option value="active">Aktif</option>
            <option value="archived">Diarsipkan</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="filter-frequency">Frekuensi</label>
          <select id="filter-frequency" v-model="filters.frequency" class="filter-select">
            <option value="all">Semua</option>
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="filter-category">Kategori</label>
          <select id="filter-category" v-model="filters.category" class="filter-select">
            <option value="all">Semua</option>
            <option v-for="category in habitStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="filter-group search-group">
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Cari kebiasaan..." 
            class="search-input"
          />
        </div>
      </div>
      
      <div class="habits-list">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat kebiasaan...</p>
        </div>
        
        <div v-else-if="habitStore.error" class="error-state">
          <p>{{ habitStore.error }}</p>
          <button @click="habitStore.fetchHabits()" class="retry-btn">Coba Lagi</button>
        </div>
        
        <div v-else-if="filteredHabits.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>Belum Ada Kebiasaan</h3>
          <p>Kebiasaan yang Anda buat akan muncul di sini.</p>
          <button @click="router.push('/habits/new')" class="add-habit-btn">
            Tambah Kebiasaan Baru
          </button>
        </div>
        
        <div v-else class="habits-grid">
          <div 
            v-for="habit in filteredHabits" 
            :key="habit.id" 
            class="habit-card"
            :class="{ 'completed-today': habit.completedToday }"
          >
            <div class="habit-header">
              <h3 class="habit-title">{{ habit.name }}</h3>
              <div class="habit-actions">
                <button @click="editHabit(habit)" class="action-btn edit-btn">
                  <span class="icon">✏️</span>
                </button>
                <button @click="confirmDelete(habit.id)" class="action-btn delete-btn">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </div>
            
            <div class="habit-details">
              <div class="habit-category" v-if="habit.category">
                {{ habit.category }}
              </div>
              
              <div class="habit-frequency">
                <span class="label">Frekuensi:</span>
                <span class="value">
                  {{ formatFrequency(habit.frequency, habit.frequencyValue) }}
                </span>
              </div>
              
              <div class="habit-streak">
                <span class="label">Streak:</span>
                <span class="value">{{ habit.currentStreak }} hari</span>
              </div>
              
              <div class="habit-progress">
                <div class="progress-label">
                  <span>Kemajuan</span>
                  <span>{{ habit.completedCount }}/{{ habit.targetCount }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(habit.completedCount / habit.targetCount) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
            
            <div class="habit-footer">
              <button 
                @click="toggleHabitCompletion(habit)"
                class="complete-btn"
                :class="{ 'completed': habit.completedToday }"
              >
                {{ habit.completedToday ? 'Selesai' : 'Tandai Selesai' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Konfirmasi Hapus -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Hapus Kebiasaan</h3>
          <button @click="showDeleteModal = false" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <p>Apakah Anda yakin ingin menghapus kebiasaan <strong>{{ habitToDelete?.name }}</strong>?</p>
          <p class="warning">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="cancel-btn">Batal</button>
          <button @click="deleteHabit" class="confirm-btn">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habits-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.add-habit-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-habit-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.habit-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: var(--surface-1);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.summary-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.summary-info {
  display: flex;
  flex-direction: column;
}

.summary-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Filters */
.habits-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: var(--surface-1);
  padding: 1rem;
  border-radius: 0.75rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-group label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
}

.filter-select, .search-input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--surface-2);
  color: var(--text-primary);
}

.search-group {
  flex-grow: 1;
}

/* Habits List */
.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.habit-card {
  background: var(--surface-1);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.habit-card:hover {
  transform: translateY(-3px);
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.habit-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.habit-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.2s ease;
}

.action-btn:hover {
  background: var(--surface-2);
}

.habit-details {
  margin-bottom: 1.5rem;
}

.habit-category {
  display: inline-block;
  background: var(--surface-2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.habit-frequency, .habit-streak {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.label {
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.habit-progress {
  margin-top: 1rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 0.5rem;
  background: var(--surface-2);
  border-radius: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 1rem;
}

.habit-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.complete-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--surface-2);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.complete-btn:hover {
  background: var(--primary-light);
}

.complete-btn.completed {
  background: var(--primary);
  color: white;
}

/* Empty, Loading, Error States */
.loading-state, .error-state, .empty-state {
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

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--surface-2);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-container {
  background: var(--surface-1);
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.warning {
  color: var(--error);
  font-size: 0.875rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
}

.cancel-btn, .confirm-btn {
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

.confirm-btn {
  background: var(--error);
  border: none;
  color: white;
}

.cancel-btn:hover {
  background: var(--surface-3);
}

.confirm-btn:hover {
  background: var(--error-dark);
}

@media (max-width: 768px) {
  .habit-summary {
    grid-template-columns: 1fr;
  }
  
  .habits-filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .habits-grid {
    grid-template-columns: 1fr;
  }
}
</style> 