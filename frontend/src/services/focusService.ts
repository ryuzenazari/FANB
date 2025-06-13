import api from './api';

export interface FocusSession {
  _id?: string;
  task?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  completed: boolean;
  notes: string;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  interruptionCount: number;
}

export interface FocusStats {
  totalSessions: number;
  totalMinutes: number;
  completedSessions: number;
}

export interface WeeklyStats {
  _id: number; // day of week (1-7, where 1 is Sunday)
  totalMinutes: number;
  sessions: number;
}

const focusService = {
  // Membuat sesi fokus baru
  createSession: async (sessionData: Partial<FocusSession>): Promise<FocusSession> => {
    try {
      const response = await api.post('/focus/sessions', sessionData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating focus session:', error);
      throw error;
    }
  },

  // Menyelesaikan sesi fokus
  completeSession: async (
    sessionId: string, 
    data: { notes?: string; interruptionCount?: number }
  ): Promise<FocusSession> => {
    try {
      const response = await api.put(`/focus/sessions/${sessionId}/complete`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error completing focus session:', error);
      throw error;
    }
  },

  // Mendapatkan daftar sesi fokus
  getSessions: async (params: {
    date?: string;
    startDate?: string;
    endDate?: string;
    mode?: string;
    limit?: number;
    page?: number;
  }) => {
    try {
      const response = await api.get('/focus/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
      throw error;
    }
  },

  // Mendapatkan statistik fokus
  getStats: async (params: {
    period: 'daily' | 'weekly';
    date?: string;
  }): Promise<FocusStats | WeeklyStats[]> => {
    try {
      const response = await api.get('/focus/stats', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching focus stats:', error);
      throw error;
    }
  }
};

export default focusService; 