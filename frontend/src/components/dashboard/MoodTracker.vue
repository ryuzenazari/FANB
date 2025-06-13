<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// Moods
const moods = [
  { value: 'excellent', emoji: '😄', label: 'Sangat Baik' },
  { value: 'good', emoji: '🙂', label: 'Baik' },
  { value: 'neutral', emoji: '😐', label: 'Biasa' },
  { value: 'bad', emoji: '😔', label: 'Buruk' },
  { value: 'terrible', emoji: '😭', label: 'Sangat Buruk' }
];

// State
const loading = ref(false);
const error = ref<string | null>(null);
const selectedMood = ref<string | null>(null);
const moodNote = ref('');

// Formatted today's date
const today = computed(() => {
  return format(new Date(), 'EEEE, d MMMM yyyy', { locale: localeId });
});

// Dummy data untuk mood 7 hari terakhir
const recentMoods = ref([
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), value: 'good' },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), value: 'excellent' },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), value: 'neutral' },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), value: 'good' },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), value: 'excellent' },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), value: 'good' }
]);

// Methods
function selectMood(mood: string) {
  selectedMood.value = mood;
}

function saveMood() {
  if (!selectedMood.value) return;
  
  // Format data untuk dikirim ke API
  const moodData = {
    date: new Date().toISOString(),
    mood: selectedMood.value,
    note: moodNote.value
  };
  
  // TODO: Kirim data ke API
  console.log('Saving mood:', moodData);
  
  // Reset form
  selectedMood.value = null;
  moodNote.value = '';
  
  // Show success feedback
  alert('Mood Anda telah disimpan!');
}

function getMoodEmoji(value: string): string {
  const mood = moods.find(m => m.value === value);
  return mood ? mood.emoji : '😐';
}

function formatDay(date: Date): string {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return days[date.getDay()];
}

// Lifecycle
onMounted(() => {
  // Cek jika pengguna sudah merekam mood hari ini
  // dan isi form jika ada
});
</script>

<template>
  <div class="mood-tracker">
    <div class="mood-header">
      <h2>Mood Tracker</h2>
      <span class="mood-date">{{ today }}</span>
    </div>
    
    <div class="mood-content">
      <p class="mood-label">Bagaimana perasaan Anda hari ini?</p>
      
      <div class="mood-options">
        <button 
          v-for="mood in moods" 
          :key="mood.value"
          @click="selectMood(mood.value)"
          class="mood-button"
          :class="{ active: selectedMood === mood.value }"
        >
          <span class="mood-emoji">{{ mood.emoji }}</span>
          <span class="mood-text">{{ mood.label }}</span>
        </button>
      </div>
      
      <div v-if="selectedMood" class="mood-input-container">
        <textarea 
          v-model="moodNote"
          class="mood-note"
          placeholder="Tulis catatan tentang perasaan Anda (opsional)..."
          rows="3"
        ></textarea>
        
        <button @click="saveMood" class="save-button">
          Simpan
        </button>
      </div>
      
      <!-- Mood 7 Hari Terakhir -->
      <div class="mood-history">
        <h3 class="mood-history-title">Mood 7 Hari Terakhir</h3>
        <div class="mood-days">
          <div 
            v-for="(mood, index) in recentMoods" 
            :key="index"
            class="mood-day"
          >
            <span class="mood-day-emoji">{{ getMoodEmoji(mood.value) }}</span>
            <span class="mood-day-name">{{ formatDay(mood.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mood-tracker {
  background-color: #1e293b;
  border-radius: 0.75rem;
  border: 1px solid #334155;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-top: 1.5rem;
  height: calc(100% - 1.5rem);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.mood-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #334155;
  background: linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0));
}

.mood-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.mood-date {
  font-size: 0.875rem;
  color: #94a3b8;
}

.mood-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mood-label {
  font-size: 0.875rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
  text-align: center;
}

.mood-options {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.mood-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.75rem;
  background-color: rgba(30, 41, 59, 0.7);
  border: 1px solid #334155;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.mood-button:hover {
  background-color: rgba(30, 41, 59, 0.9);
  transform: translateY(-2px);
  border-color: #ec4899;
}

.mood-button.active {
  background-color: rgba(236, 72, 153, 0.2);
  border-color: #ec4899;
}

.mood-emoji {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.mood-text {
  font-size: 0.875rem;
  color: #cbd5e1;
}

.mood-button.active .mood-text {
  color: #f8fafc;
}

.mood-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mood-note {
  width: 100%;
  background-color: rgba(15, 23, 42, 0.3);
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #f8fafc;
  margin-bottom: 1.25rem;
  resize: none;
  flex: 1;
  min-height: 100px;
}

.mood-note::placeholder {
  color: #64748b;
}

.mood-note:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.1);
}

.save-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #ec4899;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-button:hover {
  background-color: #db2777;
}

.save-button:disabled {
  background-color: #ec4899;
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mood History */
.mood-history {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #334155;
}

.mood-history-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0 0 1rem 0;
  text-align: center;
}

.mood-days {
  display: flex;
  justify-content: space-between;
  background-color: rgba(15, 23, 42, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

.mood-day {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mood-day-emoji {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.mood-day-name {
  font-size: 0.875rem;
  color: #94a3b8;
}

@media (min-width: 1280px) {
  .mood-tracker {
    margin-top: 2rem;
    height: calc(100% - 2rem);
  }
}
</style> 