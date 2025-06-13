<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="header-left">
        <h1>Kalender</h1>
        <div class="view-selector">
          <button class="view-btn active">Bulan</button>
          <button class="view-btn">Minggu</button>
          <button class="view-btn">Hari</button>
        </div>
      </div>
      <div class="calendar-controls">
        <button @click="goToToday" class="btn-today">Hari Ini</button>
        <div class="navigation-controls">
          <button @click="previousMonth" class="btn-nav">
            <span class="icon">&laquo;</span>
          </button>
          <button @click="nextMonth" class="btn-nav">
            <span class="icon">&raquo;</span>
          </button>
        </div>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      </div>
    </div>

    <div class="calendar-body">
      <div class="calendar-main">
        <!-- Days of Week Header -->
        <div class="day-names">
          <div v-for="day in daysOfWeek" :key="day" class="day-name">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="['calendar-day', {
              'other-month': day.isCurrentMonth === false,
              'today': isToday(day.date),
              'selected': isSelected(day.date),
              'has-events': hasEvents(day.date)
            }]"
            @click="selectDate(day.date)"
          >
            <div class="day-header">
              <span class="day-number">{{ day.day }}</span>
            </div>
            <div class="day-events">
              <div v-for="event in getEventsForDay(day.date)" :key="event._id" class="event-indicator"
                :style="{ backgroundColor: event.color || getColorForType(event.type) }">
                {{ truncateText(event.title) }}
              </div>
              <div v-if="getEventsForDay(day.date).length > 3" class="more-events">
                +{{ getEventsForDay(day.date).length - 3 }} lagi
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Date Events Panel - Selalu ditampilkan -->
      <div class="selected-date-panel">
        <div class="panel-header">
          <h3>{{ formatSelectedDate }}</h3>
          <button @click="addNewEvent" class="btn-add">
            <span class="icon">+</span> Tambah
          </button>
        </div>
        
        <div v-if="!selectedDate || selectedDateEvents.length === 0" class="no-events">
          <div class="empty-state">
            <span class="empty-icon">📅</span>
            <p>Tidak ada kegiatan pada tanggal ini</p>
          </div>
        </div>
        <div v-else class="events-list">
          <div v-for="event in selectedDateEvents" :key="event._id" class="event-item"
            :style="{ borderLeftColor: event.color || getColorForType(event.type) }">
            <div class="event-time">{{ formatEventTime(event) }}</div>
            <div class="event-title">{{ event.title }}</div>
            <div v-if="event.description" class="event-description">
              {{ truncateText(event.description, 100) }}
            </div>
            <div v-if="event.location" class="event-location">
              <span class="icon">📍</span> {{ event.location }}
            </div>
            <div class="event-actions">
              <button class="btn-icon" title="Edit" @click.stop="editEvent(event)">
                <span class="icon">✏️</span>
              </button>
              <button class="btn-icon" title="Hapus" @click.stop="deleteEvent(event)">
                <span class="icon">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event Modal -->
    <EventModal 
      :is-open="isEventModalOpen" 
      :event-date="selectedDate || undefined" 
      :event-to-edit="currentEditingEvent"
      @close="closeEventModal"
      @saved="onEventSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  getDay, addDays, isSameDay, parseISO, isToday as dateFnsIsToday, addWeeks } from 'date-fns';
import { id } from 'date-fns/locale';
import { useScheduleStore } from '../store/schedule';
import type { Schedule } from '../services/scheduleService';
import EventModal from '../components/calendar/EventModal.vue';

// Stores
const scheduleStore = useScheduleStore();

// State
const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(new Date());
const isLoading = ref(false);
const isEventModalOpen = ref(false);
const currentEditingEvent = ref<Schedule | null>(null);

// Computed properties
const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM', { locale: id });
});

const currentYear = computed(() => {
  return format(currentDate.value, 'yyyy');
});

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Menambahkan hari di awal untuk mengisi minggu pertama
  const firstDayOfMonth = getDay(monthStart);
  let prevDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevDay = addDays(monthStart, -1 * (firstDayOfMonth - i));
    prevDays.push({
      date: prevDay,
      day: format(prevDay, 'd'),
      isCurrentMonth: false
    });
  }

  // Menambahkan hari setelah akhir bulan untuk mengisi minggu terakhir
  const lastDayOfMonth = getDay(monthEnd);
  let nextDays = [];
  for (let i = 1; i < 7 - lastDayOfMonth; i++) {
    const nextDay = addDays(monthEnd, i);
    nextDays.push({
      date: nextDay,
      day: format(nextDay, 'd'),
      isCurrentMonth: false
    });
  }

  const currentMonthDays = days.map(date => ({
    date,
    day: format(date, 'd'),
    isCurrentMonth: true
  }));

  return [...prevDays, ...currentMonthDays, ...nextDays];
});

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  return format(selectedDate.value, 'EEEE, d MMMM yyyy', { locale: id });
});

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return [];
  return scheduleStore.schedules.filter(event => {
    const eventDate = new Date(event.startTime);
    return isSameDay(eventDate, selectedDate.value!);
  }).sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
});

// Methods
const nextMonth = async () => {
  isLoading.value = true;
  currentDate.value = addMonths(currentDate.value, 1);
  await fetchCurrentMonthEvents();
  isLoading.value = false;
};

const previousMonth = async () => {
  isLoading.value = true;
  currentDate.value = subMonths(currentDate.value, 1);
  await fetchCurrentMonthEvents();
  isLoading.value = false;
};

const goToToday = async () => {
  isLoading.value = true;
  currentDate.value = new Date();
  selectedDate.value = new Date();
  await fetchCurrentMonthEvents();
  isLoading.value = false;
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
};

const isToday = (date: Date) => {
  return dateFnsIsToday(date);
};

const isSelected = (date: Date) => {
  return selectedDate.value && isSameDay(date, selectedDate.value);
};

const hasEvents = (date: Date) => {
  return scheduleStore.schedules.some(event => {
    const eventDate = new Date(event.startTime);
    return isSameDay(eventDate, date);
  });
};

const getEventsForDay = (date: Date) => {
  // Dapatkan semua event untuk ditampilkan di grid
  return scheduleStore.schedules
    .filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date);
    })
    .sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
};

const formatTime = (timeStr: string | Date): string => {
  if (typeof timeStr === 'string') {
    const date = parseISO(timeStr);
    return format(date, 'HH:mm');
  }
  return format(timeStr, 'HH:mm');
};

const formatEventTime = (event: Schedule): string => {
  if (event.isAllDay) {
    return 'Sepanjang hari';
  }
  return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
};

const truncateText = (text: string | undefined, maxLength = 10): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getColorForType = (type: string): string => {
  const colors: Record<string, string> = {
    'event': 'var(--color-event)',
    'meeting': 'var(--color-meeting)',
    'task': 'var(--color-task)',
    'focus-time': 'var(--color-focus-time)',
    'break': 'var(--color-break)',
    'routine': 'var(--color-routine)'
  };
  
  return colors[type] || 'var(--color-event)';
};

const addNewEvent = () => {
  currentEditingEvent.value = null;
  isEventModalOpen.value = true;
};

const editEvent = (event: Schedule) => {
  currentEditingEvent.value = event;
  isEventModalOpen.value = true;
};

const closeEventModal = () => {
  isEventModalOpen.value = false;
  currentEditingEvent.value = null;
};

const onEventSaved = async (event: Schedule) => {
  // Refresh data setelah menyimpan jadwal
  await fetchCurrentMonthEvents();
  
  // Jika event yang disimpan adalah untuk tanggal yang dipilih, perbarui tampilan
  if (selectedDate.value && event.startTime) {
    const eventDate = new Date(event.startTime);
    if (isSameDay(eventDate, selectedDate.value)) {
      // Tanggal sudah sama, tidak perlu melakukan apa-apa
    } else {
      // Pindah ke tanggal event jika berbeda
      selectDate(eventDate);
    }
  }
};

const deleteEvent = (event: Schedule) => {
  console.log('Delete event:', event);
  if (confirm(`Apakah Anda yakin ingin menghapus "${event.title}"?`)) {
    try {
      scheduleStore.deleteSchedule(event._id as string);
      alert('Jadwal berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Gagal menghapus jadwal. Silakan coba lagi.');
    }
  }
};

// Fetch events for current month
const fetchCurrentMonthEvents = async () => {
  try {
    const start = startOfMonth(currentDate.value);
    const end = endOfMonth(addMonths(currentDate.value, 1)); // Include next month for better UX
    
    await scheduleStore.fetchSchedules({ 
      startDate: format(start, 'yyyy-MM-dd'), 
      endDate: format(end, 'yyyy-MM-dd'),
      view: 'month'
    });
    
    console.log('Schedules loaded:', scheduleStore.schedules.length);
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  console.log('CalendarView mounted - Fetching schedules...');
  isLoading.value = true;
  await fetchCurrentMonthEvents();
  isLoading.value = false;
});

// Watch for month changes to fetch new schedule data
watch(currentDate, async () => {
  console.log('Month changed, fetching new schedules...');
  await fetchCurrentMonthEvents();
});
</script>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem);
  background-color: var(--background, #0B101E);
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  max-width: 100vw;
  box-sizing: border-box;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: var(--surface-1, rgba(30, 41, 59, 0.4));
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-left h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #F9FAFB);
}

.view-selector {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.view-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  color: var(--text-secondary, #CED3DB);
}

.view-btn.active {
  background-color: var(--primary, #5469FF);
  color: white;
}

.view-btn:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-today {
  background-color: rgba(84, 105, 255, 0.2);
  color: var(--primary, #5469FF);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-today:hover {
  background-color: rgba(84, 105, 255, 0.3);
}

.navigation-controls {
  display: flex;
  gap: 0.25rem;
}

.btn-nav {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--text-primary, #F9FAFB);
}

.btn-nav:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.calendar-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.calendar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* Fix flexbox overflow issues */
  width: 100%;
}

.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary, #CED3DB);
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: var(--surface-1, rgba(30, 41, 59, 0.4));
  width: 100%;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, 1fr);
  flex: 1;
  overflow-y: auto;
  background-color: var(--surface-1, rgba(30, 41, 59, 0.4));
  width: 100%;
}

.calendar-day {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  transition: all 0.1s;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-height: 120px;
  box-sizing: border-box;
}

.calendar-day:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.day-header {
  display: flex;
  justify-content: center;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
}

.day-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.875rem;
  color: var(--text-primary, #F9FAFB);
}

.other-month {
  background-color: rgba(20, 30, 45, 0.4);
}

.other-month .day-number {
  color: rgba(255, 255, 255, 0.3);
}

.today .day-number {
  background-color: var(--primary, #5469FF);
  color: white;
  font-weight: bold;
}

.selected .day-header {
  background-color: rgba(84, 105, 255, 0.2);
  border-radius: 4px;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  width: 100%;
}

.event-indicator {
  font-size: 0.7rem;
  padding: 0.15rem 0.25rem;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  margin-bottom: 1px;
  width: 100%;
}

.more-events {
  font-size: 0.7rem;
  color: var(--text-secondary, #CED3DB);
  text-align: center;
  margin-top: 0.25rem;
}

.selected-date-panel {
  width: 280px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  background-color: var(--surface-2, rgba(30, 41, 59, 0.7));
  overflow-y: auto;
  flex-shrink: 0;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
  color: var(--text-primary, #F9FAFB);
}

.btn-add {
  background-color: var(--primary, #5469FF);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-add:hover {
  background-color: var(--primary-dark, #3E51DB);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-secondary, #CED3DB);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.event-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary, #5469FF);
  background-color: rgba(255, 255, 255, 0.05);
  position: relative;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.event-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.event-time {
  font-size: 0.75rem;
  color: var(--text-secondary, #CED3DB);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.event-title {
  font-weight: 600;
  color: var(--text-primary, #F9FAFB);
  margin-bottom: 0.25rem;
}

.event-description {
  font-size: 0.875rem;
  color: var(--text-secondary, #CED3DB);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.event-location {
  font-size: 0.75rem;
  color: var(--text-secondary, #CED3DB);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.event-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.event-item:hover .event-actions {
  opacity: 1;
}

.btn-icon {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  color: var(--text-secondary, #CED3DB);
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Tambahkan variabel CSS untuk tema gelap FANB */
:root {
  --primary: #5469FF;
  --primary-dark: #3E51DB;
  --primary-light: rgba(84, 105, 255, 0.2);
  --secondary: #BD34FE;
  --accent: #FF6B6B;
  --background: #0B101E;
  --surface-1: rgba(30, 41, 59, 0.4);
  --surface-2: rgba(30, 41, 59, 0.7);
  --text-primary: #F9FAFB;
  --text-secondary: #CED3DB;
}

/* Fix untuk browser yang tidak mendukung calc dengan vh */
@supports not (height: calc(100vh - 4rem)) {
  .calendar-container {
    height: 100vh;
    padding-top: 4rem;
    box-sizing: border-box;
  }
}

/* Responsivitas untuk layar kecil */
@media (max-width: 768px) {
  .calendar-body {
    flex-direction: column;
  }
  
  .selected-date-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .calendar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .calendar-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 