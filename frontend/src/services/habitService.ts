import api from './api';

export interface Habit {
  _id?: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customDays?: number[]; // 0 = minggu, 1 = senin, dst.
  target: number;
  unit: string;
  startDate: Date | string;
  endDate?: Date | string;
  reminderTime?: Date | string;
  streak: number;
  longestStreak: number;
  category?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface HabitLog {
  _id?: string;
  habitId: string;
  date: Date | string;
  value: number;
  notes?: string;
  skipped: boolean;
  mood?: 'bad' | 'neutral' | 'good' | 'great';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface HabitResponse {
  success: boolean;
  data: Habit;
}

export interface HabitsResponse {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: Habit[];
}

export interface HabitLogsResponse {
  success: boolean;
  count: number;
  data: HabitLog[];
}

export interface HabitQueryParams {
  frequency?: string;
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface HabitLogParams {
  startDate?: string;
  endDate?: string;
}

const habitService = {
  /**
   * Mendapatkan daftar kebiasaan
   */
  async getHabits(params: HabitQueryParams = {}): Promise<HabitsResponse> {
    const response = await api.get('/habits', { params });
    return response.data;
  },

  /**
   * Mendapatkan detail kebiasaan berdasarkan ID
   */
  async getHabit(id: string): Promise<HabitResponse> {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  /**
   * Membuat kebiasaan baru
   */
  async createHabit(habitData: Partial<Habit>): Promise<HabitResponse> {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  /**
   * Memperbarui kebiasaan yang sudah ada
   */
  async updateHabit(id: string, habitData: Partial<Habit>): Promise<HabitResponse> {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  /**
   * Menghapus kebiasaan
   */
  async deleteHabit(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  /**
   * Mencatat kebiasaan (log)
   */
  async logHabit(
    id: string,
    logData: {
      value?: number;
      notes?: string;
      mood?: 'bad' | 'neutral' | 'good' | 'great';
      skipped?: boolean;
      date?: Date | string;
    }
  ): Promise<{ success: boolean; data: HabitLog }> {
    const response = await api.post(`/habits/${id}/log`, logData);
    return response.data;
  },

  /**
   * Mendapatkan log kebiasaan
   */
  async getHabitLogs(id: string, params: HabitLogParams = {}): Promise<HabitLogsResponse> {
    const response = await api.get(`/habits/${id}/logs`, { params });
    return response.data;
  }
};

export default habitService; 