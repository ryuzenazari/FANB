import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import focusService, { FocusSession, FocusStats, WeeklyStats } from '../services/focusService';
import { useToast } from '../composables/useToast';

export const useFocusStore = defineStore('focus', () => {
  const { showToast } = useToast();

  // State
  const activeFocusSession = ref<FocusSession | null>(null);
  const focusSessions = ref<FocusSession[]>([]);
  const dailyStats = ref<FocusStats | null>(null);
  const weeklyStats = ref<WeeklyStats[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalFocusToday = computed(() => {
    return dailyStats.value?.totalMinutes || 0;
  });

  const completedSessionsToday = computed(() => {
    return dailyStats.value?.completedSessions || 0;
  });

  const totalSessionsToday = computed(() => {
    return dailyStats.value?.totalSessions || 0;
  });

  // Actions
  const startFocusSession = async (sessionData: {
    task?: string;
    duration: number;
    mode: 'focus' | 'shortBreak' | 'longBreak';
    notes?: string;
  }) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await focusService.createSession(sessionData);
      activeFocusSession.value = response;
      
      showToast('Sesi fokus dimulai', 'success');
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memulai sesi fokus';
      showToast(error.value, 'error');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const completeFocusSession = async (
    sessionId: string,
    data: { notes?: string; interruptionCount?: number }
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await focusService.completeSession(sessionId, data);
      
      // Update active session jika ID sama
      if (activeFocusSession.value && activeFocusSession.value._id === sessionId) {
        activeFocusSession.value = response;
      }
      
      // Refresh data sesi dan statistik
      await fetchDailyStats();
      
      showToast('Sesi fokus selesai', 'success');
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal menyelesaikan sesi fokus';
      showToast(error.value, 'error');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchFocusSessions = async (params: {
    date?: string;
    startDate?: string;
    endDate?: string;
    mode?: string;
    limit?: number;
    page?: number;
  } = {}) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await focusService.getSessions(params);
      focusSessions.value = response.data;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil sesi fokus';
      showToast(error.value, 'error');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchDailyStats = async (date?: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await focusService.getStats({
        period: 'daily',
        date
      }) as FocusStats;
      
      dailyStats.value = response;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil statistik harian';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchWeeklyStats = async (date?: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await focusService.getStats({
        period: 'weekly',
        date
      }) as WeeklyStats[];
      
      weeklyStats.value = response;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil statistik mingguan';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    activeFocusSession,
    focusSessions,
    dailyStats,
    weeklyStats,
    isLoading,
    error,
    
    // Getters
    totalFocusToday,
    completedSessionsToday,
    totalSessionsToday,
    
    // Actions
    startFocusSession,
    completeFocusSession,
    fetchFocusSessions,
    fetchDailyStats,
    fetchWeeklyStats
  };
}); 