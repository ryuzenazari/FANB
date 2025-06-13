<template>
  <div class="focus-page">
    <div class="focus-header">
      <h1>Mode Fokus</h1>
      <p>Tingkatkan produktivitas dengan teknik pomodoro</p>
    </div>
    
    <div class="focus-content">
      <div class="timer-card">
        <div class="timer-display">{{ formattedTime }}</div>
        <div class="timer-controls">
          <button class="btn primary" @click="toggleTimer">
            {{ isActive ? 'Pause' : 'Start' }}
          </button>
          <button class="btn secondary" @click="resetTimer">Reset</button>
        </div>
      </div>
      
      <div class="timer-modes">
        <button 
          v-for="mode in modes" 
          :key="mode.id"
          class="mode-btn"
          :class="{ active: currentMode === mode.id }"
          @click="setMode(mode.id)"
        >
          {{ mode.label }}
        </button>
      </div>
      
      <div class="session-counter">
        Sesi: {{ completedSessions }} / {{ sessionsBeforeBreak }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Debug logs
console.log('FocusView component loaded');

// Timer state
const currentMode = ref('focus');
const timeLeft = ref(25 * 60); // 25 minutes in seconds
const isActive = ref(false);
const completedSessions = ref(0);
const sessionsBeforeBreak = ref(4);

// Timer modes
const modes = [
  { id: 'focus', label: 'Fokus', duration: 25 * 60 },
  { id: 'shortBreak', label: 'Istirahat Pendek', duration: 5 * 60 },
  { id: 'longBreak', label: 'Istirahat Panjang', duration: 15 * 60 }
];

// Timer interval reference
let timerInterval: number | null = null;

// Formatted time display
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Set timer mode
const setMode = (modeId: string) => {
  // Stop timer if running
  if (isActive.value) {
    clearInterval(timerInterval!);
    isActive.value = false;
  }
  
  // Set new mode
  currentMode.value = modeId;
  
  // Reset timer based on mode
  const mode = modes.find(m => m.id === modeId);
  if (mode) {
    timeLeft.value = mode.duration;
  }
};

// Toggle timer
const toggleTimer = () => {
  if (isActive.value) {
    // Pause timer
    clearInterval(timerInterval!);
    isActive.value = false;
  } else {
    // Start timer
    isActive.value = true;
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        // Timer complete
        handleTimerComplete();
      }
    }, 1000);
  }
};

// Reset timer
const resetTimer = () => {
  // Stop timer if running
  if (isActive.value) {
    clearInterval(timerInterval!);
    isActive.value = false;
  }
  
  // Reset time based on current mode
  const mode = modes.find(m => m.id === currentMode.value);
  if (mode) {
    timeLeft.value = mode.duration;
  }
};

// Handle timer completion
const handleTimerComplete = () => {
  // Stop timer
  clearInterval(timerInterval!);
  isActive.value = false;
  
  // Play notification sound
  const audio = new Audio('/audio/complete.mp3');
  audio.play().catch(err => console.error('Error playing audio:', err));
  
  // Show notification
  showNotification();
  
  // Handle mode switching
  if (currentMode.value === 'focus') {
    // Increment completed sessions
    completedSessions.value++;
    
    // Check if long break is due
    if (completedSessions.value % sessionsBeforeBreak.value === 0) {
      setMode('longBreak');
    } else {
      setMode('shortBreak');
    }
  } else {
    // After break, go back to focus mode
    setMode('focus');
  }
};

// Show notification
const showNotification = () => {
  let title, message;
  
  switch (currentMode.value) {
    case 'focus':
      title = 'Waktu fokus selesai!';
      message = 'Waktunya istirahat sejenak.';
      break;
    case 'shortBreak':
      title = 'Istirahat selesai!';
      message = 'Waktunya kembali fokus.';
      break;
    case 'longBreak':
      title = 'Istirahat panjang selesai!';
      message = 'Waktunya mulai sesi fokus baru.';
      break;
    default:
      title = 'Timer selesai!';
      message = '';
  }
  
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message });
  }
  
  // Or use a custom toast notification
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: {
      message: `${title} ${message}`,
      type: 'info'
    }
  }));
};

// Component lifecycle
onMounted(() => {
  console.log('FocusView mounted');
  
  // Request notification permission
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

onUnmounted(() => {
  // Clean up timer on component unmount
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.focus-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.focus-header {
  margin-bottom: 2rem;
  text-align: center;
}

.focus-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #5469d4, #7b61ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.focus-header p {
  color: #718096;
  font-size: 1.1rem;
}

.focus-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.timer-display {
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  font-variant-numeric: tabular-nums;
  color: #5469d4;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background: #5469d4;
  color: white;
  border: none;
}

.primary:hover {
  background: #4054b4;
}

.secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #718096;
}

.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.timer-modes {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mode-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.mode-btn.active {
  background: rgba(84, 105, 212, 0.1);
  color: #5469d4;
  border-color: #5469d4;
}

.session-counter {
  color: #718096;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .focus-page {
    padding: 1rem;
  }
  
  .timer-display {
    font-size: 4rem;
  }
}
</style> 