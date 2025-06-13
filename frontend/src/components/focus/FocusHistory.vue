<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useFocusStore } from '../../store/focus';

// Props
const props = defineProps({
  limit: {
    type: Number,
    default: 5
  },
  showDate: {
    type: Boolean,
    default: true
  }
});

// Store
const focusStore = useFocusStore();

// State
const currentPage = ref(1);
const selectedDate = ref(new Date());

// Computed
const formattedDate = computed(() => {
  return format(selectedDate.value, 'yyyy-MM-dd');
});

// Watch
watch(selectedDate, () => {
  currentPage.value = 1;
  loadSessions();
});

// Methods
const loadSessions = async () => {
  await focusStore.fetchFocusSessions({
    date: formattedDate.value,
    limit: props.limit,
    page: currentPage.value
  });
};

const formatTime = (date: string) => {
  return format(parseISO(date), 'HH:mm');
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} menit`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} jam`;
  }
  
  return `${hours} jam ${remainingMinutes} menit`;
};

const getModeLabel = (mode: string) => {
  switch (mode) {
    case 'focus':
      return 'Fokus';
    case 'shortBreak':
      return 'Istirahat Pendek';
    case 'longBreak':
      return 'Istirahat Panjang';
    default:
      return mode;
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'focus':
      return '🎯';
    case 'shortBreak':
      return '☕';
    case 'longBreak':
      return '🌴';
    default:
      return '⏱️';
  }
};

const handlePrevDate = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() - 1);
  selectedDate.value = newDate;
};

const handleNextDate = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + 1);
  selectedDate.value = newDate;
};

// Lifecycle
onMounted(() => {
  loadSessions();
});

// Definisi interface untuk task yang terkait dengan sesi fokus
interface TaskInfo {
  _id: string;
  title: string;
  priority?: string;
}

// Type untuk session dengan task yang terstruktur
interface SessionWithTask extends Omit<import('../../services/focusService').FocusSession, 'task'> {
  task?: TaskInfo;
}
</script>

<template>
  <div class="focus-history">
    <div class="focus-history-header">
      <h3 class="text-lg font-semibold mb-4">Riwayat Sesi Fokus</h3>
      
      <!-- Date selector -->
      <div v-if="showDate" class="date-selector flex items-center mb-4">
        <button 
          @click="handlePrevDate" 
          class="btn-icon"
          aria-label="Hari sebelumnya"
        >
          <span>◀</span>
        </button>
        
        <span class="date-display mx-3">
          {{ format(selectedDate, 'dd MMMM yyyy', { locale: id }) }}
        </span>
        
        <button 
          @click="handleNextDate" 
          class="btn-icon"
          aria-label="Hari berikutnya"
          :disabled="selectedDate >= new Date()"
        >
          <span>▶</span>
        </button>
      </div>
    </div>
    
    <!-- Sessions list -->
    <div v-if="focusStore.isLoading" class="text-center py-4">
      <div class="spinner"></div>
      <p>Memuat riwayat...</p>
    </div>
    
    <div v-else-if="focusStore.focusSessions.length === 0" class="empty-state">
      <p class="text-gray-500">Belum ada sesi fokus untuk ditampilkan</p>
    </div>
    
    <ul v-else class="sessions-list">
      <li 
        v-for="session in focusStore.focusSessions as SessionWithTask[]" 
        :key="session._id" 
        class="session-item"
      >
        <div class="session-icon" :class="`session-${session.mode}`">
          {{ getModeIcon(session.mode) }}
        </div>
        
        <div class="session-content">
          <div class="session-header">
            <span class="session-type">{{ getModeLabel(session.mode) }}</span>
            <span class="session-time">{{ formatTime(session.startTime.toString()) }}</span>
          </div>
          
          <div class="session-info">
            <span class="session-duration">
              {{ formatDuration(session.duration) }}
            </span>
            
            <span v-if="session.task" class="session-task">
              {{ session.task.title }}
            </span>
          </div>
          
          <div v-if="session.notes" class="session-notes">
            {{ session.notes }}
          </div>
        </div>
        
        <div class="session-status">
          <span 
            v-if="session.completed" 
            class="status-badge completed"
          >
            Selesai
          </span>
          <span 
            v-else 
            class="status-badge incomplete"
          >
            Tidak Selesai
          </span>
        </div>
      </li>
    </ul>
    
    <!-- Pagination -->
    <div 
      v-if="focusStore.focusSessions.length > 0" 
      class="pagination-controls mt-4 flex justify-center"
    >
      <button 
        @click="currentPage--; loadSessions()"
        :disabled="currentPage === 1"
        class="btn-pagination"
      >
        Sebelumnya
      </button>
      
      <span class="pagination-info mx-3">
        Halaman {{ currentPage }}
      </span>
      
      <button 
        @click="currentPage++; loadSessions()"
        :disabled="focusStore.focusSessions.length < props.limit"
        class="btn-pagination"
      >
        Berikutnya
      </button>
    </div>
  </div>
</template>

<style scoped>
.focus-history {
  @apply bg-white rounded-lg shadow p-4;
}

.session-item {
  @apply flex items-start p-3 mb-2 border-b border-gray-100;
}

.session-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg;
}

.session-focus {
  @apply bg-blue-100 text-blue-700;
}

.session-shortBreak {
  @apply bg-green-100 text-green-700;
}

.session-longBreak {
  @apply bg-purple-100 text-purple-700;
}

.session-content {
  @apply flex-grow;
}

.session-header {
  @apply flex justify-between items-center mb-1;
}

.session-type {
  @apply font-medium;
}

.session-time {
  @apply text-sm text-gray-500;
}

.session-info {
  @apply flex items-center text-sm;
}

.session-duration {
  @apply text-gray-600 mr-2;
}

.session-task {
  @apply text-blue-600 ml-2;
}

.session-notes {
  @apply text-sm text-gray-600 mt-1 italic;
}

.status-badge {
  @apply text-xs px-2 py-1 rounded-full text-white;
}

.status-badge.completed {
  @apply bg-green-500;
}

.status-badge.incomplete {
  @apply bg-red-500;
}

.btn-icon {
  @apply w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center;
}

.btn-icon:hover {
  @apply bg-gray-200;
}

.btn-icon:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-pagination {
  @apply px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100;
}

.btn-pagination:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.spinner {
  @apply w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  @apply py-8 text-center;
}
</style> 