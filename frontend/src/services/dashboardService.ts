import api from './api';
import { useLoadingStore } from '../store/loading';
import { useCache } from '../composables/useCache';
import type { Insight } from '../components/dashboard/types';

export interface DashboardSummary {
  overviewStats: {
    taskCount: {
      total: number;
      completed: number;
      inProgress: number;
      todo: number;
    };
    habitCount: {
      active: number;
      completedThisWeek: number;
    };
    notificationsUnread: number;
    productivityScore: number;
  };
  todaySchedule: any[];
  upcomingTasks: any[];
  recentNotes: any[];
  recentHabits: any[];
}

export interface HabitOverview {
  id: string;
  name: string;
  streak: number;
  longestStreak: number;
  frequency: string;
  target: number;
  unit: string;
  color: string;
  icon: string;
  completionRate: number;
  dailyData: {
    date: string;
    completed: boolean;
    value: number;
  }[];
}

export interface HabitsOverviewResponse {
  success: boolean;
  date: {
    startDate: string;
    endDate: string;
    labels: string[];
  };
  count: number;
  data: HabitOverview[];
}

export interface UpcomingTasksResponse {
  success: boolean;
  data: {
    overdue: any[];
    today: any[];
    upcoming: any[];
  };
}

export interface DailyScheduleResponse {
  success: boolean;
  date: string;
  data: {
    schedules: any[];
    tasks: any[];
    habits: any[];
  };
}

export interface ProductivityInsightsResponse {
  success: boolean;
  data: {
    taskCompletionByDay: {
      _id: string;
      count: number;
    }[];
    habitCompletionByDay: {
      _id: string;
      count: number;
    }[];
    taskByCategory: {
      categoryId: string;
      name: string;
      color: string;
      count: number;
    }[];
  };
}

/**
 * Service untuk mengakses API dashboard
 */
const dashboardService = {
  /**
   * Mendapatkan ringkasan untuk dashboard
   */
  async getDashboardSummary(): Promise<{ success: boolean; data: DashboardSummary }> {
    const loadingStore = useLoadingStore();
    const cache = useCache();
    
    return loadingStore.withLoading('dashboard-summary', async () => {
      // Gunakan cache dengan TTL 2 menit dan auto refresh
      return cache.getItem(
        'dashboard-summary', 
        async () => {
          const response = await api.get('/dashboard/summary');
          return response.data;
        },
        { ttl: 2 * 60 * 1000, autoRefresh: true }
      );
    });
  },
  
  /**
   * Mendapatkan overview kebiasaan
   */
  async getHabitsOverview(): Promise<HabitsOverviewResponse> {
    const response = await api.get('/dashboard/habits-overview');
    return response.data;
  },
  
  /**
   * Mendapatkan daftar tugas yang akan datang
   */
  async getUpcomingTasks(): Promise<UpcomingTasksResponse> {
    const loadingStore = useLoadingStore();
    const cache = useCache();
    
    return loadingStore.withLoading('upcoming-tasks', async () => {
      // Untuk data yang sering berubah, gunakan TTL yang lebih singkat
      return cache.getItem(
        'upcoming-tasks', 
        async () => {
          const response = await api.get('/dashboard/upcoming-tasks');
          return response.data;
        },
        { ttl: 60 * 1000, autoRefresh: true }
      );
    });
  },
  
  /**
   * Mendapatkan jadwal harian
   */
  async getDailySchedule(date?: string): Promise<DailyScheduleResponse> {
    const params = date ? { date } : {};
    const response = await api.get('/dashboard/daily-schedule', { params });
    return response.data;
  },
  
  /**
   * Mendapatkan insight produktivitas
   */
  async getProductivityInsights(): Promise<ProductivityInsightsResponse> {
    const response = await api.get('/dashboard/productivity-insights');
    return response.data;
  },

  /**
   * Mendapatkan analitik data untuk dashboard
   */
  async getDashboardAnalytics(): Promise<{ success: boolean; data: any }> {
    const loadingStore = useLoadingStore();
    const cache = useCache();
    
    return loadingStore.withLoading('dashboard-analytics', async () => {
      // Gunakan cache dengan TTL 30 menit karena data analitik tidak sering berubah
      return cache.getItem(
        'dashboard-analytics', 
        async () => {
          const response = await api.get('/dashboard/analytics');
          return response.data;
        },
        { ttl: 30 * 60 * 1000, autoRefresh: true }
      );
    });
  },

  /**
   * Mendapatkan statistik produktivitas pengguna
   */
  async getProductivityStats(timeframe: string = 'week'): Promise<{ success: boolean; data: any }> {
    const loadingStore = useLoadingStore();
    const cache = useCache();
    const cacheKey = `productivity-stats-${timeframe}`;
    
    return loadingStore.withLoading(`productivity-stats-${timeframe}`, async () => {
      return cache.getItem(
        cacheKey, 
        async () => {
          const response = await api.get('/dashboard/productivity-stats', {
            params: { timeframe }
          });
          return response.data;
        },
        { ttl: 15 * 60 * 1000, autoRefresh: true }
      );
    });
  },

  /**
   * Mendapatkan wawasan AI berdasarkan data pengguna
   */
  async getAIInsights(): Promise<{ success: boolean; data: Insight[] }> {
    const loadingStore = useLoadingStore();
    const cache = useCache();
    
    return loadingStore.withLoading('ai-insights', async () => {
      return cache.getItem(
        'ai-insights', 
        async () => {
          const response = await api.get('/dashboard/ai-insights');
          return response.data;
        },
        { ttl: 5 * 60 * 1000, autoRefresh: true }
      );
    });
  }
};

export default dashboardService; 