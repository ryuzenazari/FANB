<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useAuthStore } from '../store/auth';
import { useLoadingStore } from '../store/loading';
import dashboardService, { type DashboardSummary } from '../services/dashboardService';
import ProductivityChart from '../components/dashboard/ProductivityChart.vue';
import AIInsightPanel from '../components/dashboard/AIInsightPanel.vue';
import MoodTracker from '../components/dashboard/MoodTracker.vue';
import StatCard from '../components/ui/StatCard.vue';
import { type Insight } from '../components/dashboard/types';

// Define emits
const emit = defineEmits(['open-task-form', 'open-habit-form']);

// Router & Stores
const router = useRouter();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

// Data
const error = ref<string | null>(null);
const dashboardData = ref<DashboardSummary | null>(null);
const insights = ref<Insight[]>([]);
const chartData = ref<any>(null);

// User info
const user = computed(() => authStore.user);

// Loading states
const isDashboardLoading = computed(() => loadingStore.isComponentLoading('dashboard-summary'));

// Format today's date
const formattedDate = computed(() => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const now = new Date();
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  return `${day}, ${date} ${month} ${year}`;
});

// Stats
const stats = computed(() => dashboardData.value?.overviewStats || {
  taskCount: {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  },
  habitCount: {
    active: 0,
    completedThisWeek: 0
  },
  notificationsUnread: 0,
  productivityScore: 0
});

// Recent tasks
const recentTasks = computed(() => dashboardData.value?.upcomingTasks || []);

// Methods
const fetchDashboardData = async () => {
  try {
    error.value = null;
    loadingStore.setLoading('dashboard-data', true);

    // Fungsi untuk mengambil data langsung dari API
    const fetchData = async (fetchFn: () => Promise<any>) => {
      try {
        const result = await fetchFn();
        return result;
      } catch (err: unknown) {
        console.error(`Error fetching data: ${(err as Error).message}`);
        throw err;
      }
    };
    
    // Ambil data langsung dari API tanpa fallback
    try {
      const summaryData = await fetchData(() => dashboardService.getDashboardSummary());
      if (summaryData && summaryData.data) {
        dashboardData.value = summaryData.data;
      }
    } catch (summaryErr) {
      console.error('Error fetching summary data:', summaryErr);
    }

    try {
      const analyticsData = await fetchData(() => dashboardService.getDashboardAnalytics());
      if (analyticsData && analyticsData.data) {
        chartData.value = analyticsData.data;
      }
    } catch (analyticsErr) {
      console.error('Error fetching analytics data:', analyticsErr);
    }

    try {
      const aiInsightsData = await fetchData(() => dashboardService.getAIInsights());
      if (aiInsightsData && aiInsightsData.data) {
        insights.value = aiInsightsData.data;
      }
    } catch (insightsErr) {
      console.error('Error fetching insights data:', insightsErr);
    }
    
    loadingStore.setLoading('dashboard-data', false);
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Gagal memuat data dashboard';
    console.error('Error fetching dashboard data:', err);
    loadingStore.setLoading('dashboard-data', false);
  }
};

const formatDate = (dateString: string | Date) => {
  try {
    if (typeof dateString === 'string') {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: localeId });
    } else {
      return format(dateString, 'dd MMM yyyy', { locale: localeId });
    }
  } catch (_) {
    return String(dateString);
  }
};

const priorityLabel = (priority: string) => {
  switch (priority) {
    case 'high': return 'Tinggi';
    case 'medium': return 'Sedang';
    case 'low': return 'Rendah';
    default: return priority;
  }
};

// Handler untuk tombol task dan habit
const handleTaskButtonClick = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  emit('open-task-form');
};

const handleHabitButtonClick = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  emit('open-habit-form');
};

// Lifecycle hooks
onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <main class="dashboard-container">
    <LoadingSpinner 
      fullscreen
      message="Memuat dashboard..." 
      loadingKey="dashboard-summary"
      v-if="isDashboardLoading && !dashboardData"
    />

    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <h2>Terjadi Kesalahan</h2>
        <p>{{ error }}</p>
        <button @click="fetchDashboardData" class="btn-primary">Coba Lagi</button>
      </div>
    </div>
    
    <template v-else>
      <div class="dashboard-welcome">
        <div class="welcome-content">
          <h1>
            Selamat datang, <span>{{ user?.profile?.firstName || 'Pengguna' }}</span>
          </h1>
          <p>
            {{ formattedDate }}
          </p>
        </div>
        <div class="welcome-actions">
          <button
            @click="handleTaskButtonClick"
            class="btn-snap"
          >
            <span class="mr-2">+</span> Tugas Baru
          </button>
          <button
            @click="handleHabitButtonClick"
            class="btn-snap"
          >
            <span class="mr-2">+</span> Kebiasaan Baru
          </button>
        </div>
      </div>

      <!-- Stats Cards Row -->
      <div class="stats-grid">
        <StatCard
          title="Tugas Selesai"
          :value="stats.taskCount.completed"
          icon="check-circle"
          color="emerald"
          trend="+2 minggu ini"
        />
        <StatCard
          title="Tugas Pending"
          :value="stats.taskCount.inProgress + stats.taskCount.todo"
          icon="clock"
          color="amber"
        />
        <StatCard
          title="Hari Streak"
          :value="stats.habitCount.completedThisWeek"
          icon="fire"
          color="rose"
          trend="+1 dari minggu lalu"
        />
        <StatCard
          title="Skor Produktivitas"
          :value="stats.productivityScore"
          icon="brain"
          color="indigo"
          trend="+5% hari ini"
        />
      </div>

      <!-- Main Dashboard Content -->
      <div class="dashboard-content">
        <!-- Left Column -->
        <div class="dashboard-left">
          <!-- Productivity Chart -->
          <div class="dashboard-card chart-card">
            <div class="card-header">
              <h2>Produktivitas 7 Hari Terakhir</h2>
              <LoadingSpinner loadingKey="dashboard-analytics" size="small" :overlay="false" />
            </div>
            <ProductivityChart :chart-data="chartData" />
          </div>
          
          <!-- Recent Tasks -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2>Tugas Terbaru</h2>
              <div class="header-actions">
                <LoadingSpinner loadingKey="upcoming-tasks" size="small" :overlay="false" />
                <RouterLink to="/tasks" class="view-all">Lihat Semua</RouterLink>
              </div>
            </div>
            
            <div class="task-list" v-if="recentTasks.length > 0">
              <div
                v-for="task in recentTasks"
                :key="task.id"
                class="task-item"
              >
                <div class="task-content">
                  <div class="task-checkbox">
                    <input
                      type="checkbox"
                      :checked="task.completed"
                    />
                  </div>
                  <div class="task-details">
                    <div class="task-header">
                      <h3 class="task-title" :class="{ completed: task.completed }">
                        {{ task.title }}
                      </h3>
                      <span 
                        class="task-priority"
                        :class="{
                          'priority-high': task.priority === 'high',
                          'priority-medium': task.priority === 'medium',
                          'priority-low': task.priority === 'low'
                        }"
                      >
                        {{ priorityLabel(task.priority) }}
                      </span>
                    </div>
                    <p v-if="task.description" class="task-description">
                      {{ task.description }}
                    </p>
                    <div v-if="task.dueDate" class="task-date">
                      <span>🗓️</span>
                      {{ formatDate(task.dueDate) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <p>Belum ada tugas. Mulai dengan menambahkan tugas baru.</p>
              <button @click="handleTaskButtonClick" class="btn-outline">
                <span class="mr-2">+</span> Tambahkan Tugas
              </button>
            </div>
          </div>
          
          <!-- Recent Habits -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2>Kebiasaan Terbaru</h2>
              <div class="header-actions">
                <LoadingSpinner loadingKey="recent-habits" size="small" :overlay="false" />
                <RouterLink to="/habits" class="view-all">Lihat Semua</RouterLink>
              </div>
            </div>
            
            <div class="habits-list" v-if="dashboardData?.recentHabits && dashboardData.recentHabits.length > 0">
              <div
                v-for="habit in dashboardData.recentHabits"
                :key="habit.id"
                class="habit-item"
                :class="{ 'completed-today': habit.completedToday }"
              >
                <div class="habit-content">
                  <div class="habit-icon">
                    {{ habit.icon || '📝' }}
                  </div>
                  <div class="habit-details">
                    <div class="habit-header">
                      <h3 class="habit-title">
                        {{ habit.name }}
                      </h3>
                      <span class="habit-streak" v-if="habit.currentStreak > 0">
                        🔥 {{ habit.currentStreak }}
                      </span>
                    </div>
                    <div class="habit-progress">
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          :style="{ width: `${(habit.completedCount / habit.targetCount) * 100}%` }"
                        ></div>
                      </div>
                      <span class="progress-text">{{ habit.completedCount }}/{{ habit.targetCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <p>Belum ada kebiasaan. Mulai dengan menambahkan kebiasaan baru.</p>
              <button @click="handleHabitButtonClick" class="btn-outline">
                <span class="mr-2">+</span> Tambahkan Kebiasaan
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="dashboard-right">
          <!-- AI Insights -->
          <AIInsightPanel :insights="insights" />
          
          <!-- Mood Tracker -->
          <MoodTracker />
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  background-color: #0f172a; /* Warna background dark */
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
  overflow-x: hidden;
}

.dashboard-welcome {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem;
  background: linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.05));
  border-radius: 0;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-welcome {
    flex-direction: row;
    align-items: center;
  }
}

.welcome-content h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc; /* Text color light for dark background */
  margin-bottom: 0.5rem;
}

.welcome-content h1 span {
  color: #818cf8; /* Primary color light */
}

.welcome-content p {
  color: #cbd5e1; /* Lighter text for dark background */
}

.welcome-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .welcome-actions {
    margin-top: 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0 2rem;
}

@media (min-width: 640px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 3fr 2fr;
  }
}

@media (min-width: 1280px) {
  .dashboard-container {
    padding: 0;
}

  .dashboard-content {
    grid-template-columns: 3fr 2fr;
    gap: 2rem;
  }
}

.dashboard-left, 
.dashboard-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.dashboard-right {
  height: 100%;
  min-height: 650px;
}

.dashboard-card {
  background-color: #1e293b; /* Card background dark */
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #334155;
  padding: 1.25rem;
  width: 100%;
  box-sizing: border-box;
}

.chart-card {
  min-height: 350px;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  width: 100%;
}

.error-message {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  max-width: 450px;
}

.error-message h2 {
  color: #e11d48;
  margin-bottom: 1rem;
}

.error-message p {
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-all {
  color: #818cf8;
  font-size: 0.875rem;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}

.empty-state button {
  margin-top: 1rem;
}

.btn-snap {
  background-color: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

.btn-snap:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.4);
}

.btn-snap:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(99, 102, 241, 0.2);
}

/* Habit styles */
.habits-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.habit-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.habit-item:hover {
  background-color: rgba(30, 41, 59, 0.8);
  transform: translateY(-2px);
}

.habit-item.completed-today {
  border-left: 3px solid #10B981;
}

.habit-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.habit-icon {
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.habit-details {
  flex: 1;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.habit-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.habit-streak {
  font-size: 0.75rem;
  background-color: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
}

.habit-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 0.375rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #5469FF;
  border-radius: 1rem;
}

.progress-text {
  font-size: 0.75rem;
  color: #94a3b8;
}
</style> 