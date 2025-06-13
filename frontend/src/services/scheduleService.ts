import api from './api';

export interface Schedule {
  _id?: string;
  title: string;
  description?: string;
  startTime: Date | string;
  endTime: Date | string;
  isAllDay: boolean;
  type: 'event' | 'meeting' | 'task' | 'focus-time' | 'break' | 'routine';
  location?: string;
  color: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  recurrenceRule?: string;
  recurrenceEnd?: Date | string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'canceled';
  reminders?: {
    time: Date | string;
    type: 'notification' | 'email' | 'both';
  }[];
  relatedItemId?: string;
  relatedItemModel?: 'Task' | 'Habit';
  category?: string;
  participants?: {
    email: string;
    name: string;
    status: 'pending' | 'accepted' | 'declined';
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TimeSlot {
  start: Date | string;
  end: Date | string;
  duration: number; // minutes
}

export interface ScheduleResponse {
  success: boolean;
  data: Schedule;
}

export interface SchedulesResponse {
  success: boolean;
  count: number;
  data: Schedule[];
}

export interface FocusSlotsResponse {
  success: boolean;
  count: number;
  data: TimeSlot[];
}

export interface ScheduleQueryParams {
  startDate?: string;
  endDate?: string;
  view?: 'day' | 'week' | 'month';
  type?: string;
  category?: string;
  status?: string;
  search?: string;
}

const scheduleService = {
  /**
   * Mendapatkan daftar jadwal
   */
  async getSchedules(params: ScheduleQueryParams = {}): Promise<SchedulesResponse> {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  /**
   * Mendapatkan detail jadwal berdasarkan ID
   */
  async getSchedule(id: string): Promise<ScheduleResponse> {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  /**
   * Mendapatkan jadwal berdasarkan tanggal
   */
  async getSchedulesByDate(date: string): Promise<SchedulesResponse> {
    const response = await api.get('/schedules/by-date', { params: { date } });
    return response.data;
  },

  /**
   * Membuat jadwal baru
   */
  async createSchedule(scheduleData: Partial<Schedule>): Promise<ScheduleResponse> {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  /**
   * Memperbarui jadwal yang sudah ada
   */
  async updateSchedule(id: string, scheduleData: Partial<Schedule>): Promise<ScheduleResponse> {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },

  /**
   * Menghapus jadwal
   */
  async deleteSchedule(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },

  /**
   * Mendapatkan slot waktu yang tersedia untuk focus time
   */
  async getFocusTimeSlots(date: string): Promise<FocusSlotsResponse> {
    const response = await api.get('/schedules/focus-slots', { params: { date } });
    return response.data;
  },

  /**
   * Mendapatkan jadwal berdasarkan rentang tanggal
   */
  async getSchedulesByDateRange(startDate: string, endDate: string): Promise<SchedulesResponse> {
    const response = await api.get('/schedules', { 
      params: { 
        startDate, 
        endDate 
      } 
    });
    return response.data;
  }
};

export default scheduleService; 