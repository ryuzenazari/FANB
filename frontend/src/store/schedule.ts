import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToastStore } from './toast';
import type { Schedule } from '../services/scheduleService';
import scheduleService from '../services/scheduleService';

export const useScheduleStore = defineStore('schedule', () => {
  const schedules = ref<Schedule[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const toastStore = useToastStore();

  const fetchSchedules = async (params?: { 
    startDate?: string; 
    endDate?: string;
    view?: 'day' | 'week' | 'month';
  }) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await scheduleService.getSchedules(params);
      schedules.value = response.data;
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal mengambil data jadwal';
      error.value = errorMessage;
      toastStore.showToast(errorMessage, 'error', 3000);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getScheduleById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await scheduleService.getSchedule(id);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || `Gagal mengambil jadwal dengan ID: ${id}`;
      error.value = errorMessage;
      toastStore.showToast(errorMessage, 'error', 3000);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createSchedule = async (schedule: Omit<Schedule, '_id'>) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await scheduleService.createSchedule(schedule);
      schedules.value.push(response.data);
      toastStore.showToast('Jadwal berhasil dibuat', 'success', 3000);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal membuat jadwal baru';
      error.value = errorMessage;
      toastStore.showToast(errorMessage, 'error', 3000);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSchedule = async (id: string, schedule: Partial<Schedule>) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await scheduleService.updateSchedule(id, schedule);
      
      // Update the schedule in the local array
      const index = schedules.value.findIndex(s => s._id === id);
      if (index !== -1) {
        schedules.value[index] = { ...schedules.value[index], ...response.data };
      }
      
      toastStore.showToast('Jadwal berhasil diperbarui', 'success', 3000);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || `Gagal memperbarui jadwal dengan ID: ${id}`;
      error.value = errorMessage;
      toastStore.showToast(errorMessage, 'error', 3000);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSchedule = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await scheduleService.deleteSchedule(id);
      
      // Remove the schedule from the local array
      schedules.value = schedules.value.filter(s => s._id !== id);
      
      toastStore.showToast('Jadwal berhasil dihapus', 'success', 3000);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || `Gagal menghapus jadwal dengan ID: ${id}`;
      error.value = errorMessage;
      toastStore.showToast(errorMessage, 'error', 3000);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    schedules,
    isLoading,
    error,
    fetchSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
  };
}); 