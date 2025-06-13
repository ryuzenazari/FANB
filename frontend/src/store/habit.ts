import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '../plugins/axios'
import { useToastStore } from './toast'

// Types
export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  category?: string
  categoryName?: string
  icon: string
  frequency: 'daily' | 'weekly' | 'monthly'
  frequencyValue: number
  targetCount: number
  completedCount: number
  unit: string
  currentStreak: number
  bestStreak: number
  startDate: string
  color?: string
  reminderEnabled: boolean
  reminderTime?: string
  notes?: string
  archived: boolean
  completedToday: boolean
  completedDates: string[]
  createdAt: string
  updatedAt: string
}

export interface HabitHistory {
  date: string
  completed: boolean
  count: number
}

interface HabitState {
  habits: Habit[]
  currentHabit: Habit | null
  editingHabit: Habit | null
  loading: boolean
  error: string | null
  categories: string[]
  longestStreak: number
}

// Input type for creating/updating habits
export interface HabitInput {
  name: string
  description?: string
  category?: string
  categoryName?: string
  icon: string
  frequency: 'daily' | 'weekly' | 'monthly'
  frequencyValue: number
  targetCount: number
  unit: string
  color?: string
  reminderEnabled: boolean
  reminderTime?: string
  notes?: string
  startDate: string
  archived?: boolean
}

export const useHabitStore = defineStore('habit', {
  state: (): HabitState => ({
    habits: [],
    currentHabit: null,
    editingHabit: null,
    loading: false,
    error: null,
    categories: [],
    longestStreak: 0
  }),
  
  getters: {
    // Kebiasaan harian
    dailyHabits: (state) => state.habits.filter(habit => habit.frequency === 'daily'),
    
    // Kebiasaan mingguan
    weeklyHabits: (state) => state.habits.filter(habit => habit.frequency === 'weekly'),
    
    // Kebiasaan bulanan
    monthlyHabits: (state) => state.habits.filter(habit => habit.frequency === 'monthly'),
    
    // Kebiasaan berdasarkan kategori
    habitsByCategory: (state) => {
      const habitsByCategory: Record<string, Habit[]> = {}
      
      state.habits.forEach(habit => {
        const category = habit.category || 'Uncategorized'
        if (!habitsByCategory[category]) {
          habitsByCategory[category] = []
        }
        habitsByCategory[category].push(habit)
      })
      
      return habitsByCategory
    },
    
    // Kebiasaan yang sudah selesai hari ini
    completedTodayHabits: (state) => state.habits.filter(habit => habit.completedToday),
    
    // Kebiasaan yang belum selesai hari ini
    incompleteTodayHabits: (state) => state.habits.filter(habit => !habit.completedToday),
    
    // Total kebiasaan yang aktif
    totalActiveHabits: (state) => state.habits.length,
    
    // Progress kebiasaan hari ini (persentase)
    todayProgress: (state) => {
      const total = state.habits.length
      if (total === 0) return 0
      
      const completed = state.habits.filter(habit => habit.completedToday).length
      return Math.round((completed / total) * 100)
    }
  },
  
  actions: {
    // Ambil semua kebiasaan
    async fetchHabits(): Promise<void> {
      try {
        this.loading = true
        this.error = null
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, skipping habits fetch');
          this.habits = [];
          this.updateLongestStreak();
          this.extractCategories();
          return;
        }
        
        console.log('Fetching habits with token...');
        const response = await axios.get('/habits/frontend')
        
        if (response.data && response.data.success) {
          console.log('Habits fetched successfully:', response.data.data.length);
          this.habits = response.data.data
          this.updateLongestStreak()
          this.extractCategories()
        } else {
          console.error('Invalid response format from habits API:', response.data);
          this.error = response.data?.message || 'Gagal mengambil data kebiasaan'
          this.habits = []
          this.updateLongestStreak()
          this.extractCategories()
        }
      } catch (error: any) {
        // Log error details for debugging
        console.error('Error fetching habits:', error);
        console.error('Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status
        });
        
        this.error = error?.response?.data?.message || error?.message || 'Terjadi kesalahan saat mengambil data kebiasaan'
        
        // Tampilkan toast error
        const toastStore = useToastStore()
        toastStore.showToast('Gagal memuat kebiasaan: ' + this.error, 'error')
        
        // Reset state
        this.habits = []
        this.updateLongestStreak()
        this.extractCategories()
      } finally {
        this.loading = false
      }
    },
    
    // Ambil kebiasaan berdasarkan ID
    async fetchHabitById(id: string): Promise<void> {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get(`/habits/${id}`)
        
        if (response.data.success) {
          this.currentHabit = response.data.data
        } else {
          this.error = 'Gagal mengambil detail kebiasaan'
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat mengambil detail kebiasaan'
        console.error('Error fetching habit by ID:', error)
      } finally {
        this.loading = false
      }
    },
    
    // Buat kebiasaan baru
    async createHabit(habitData: Partial<Habit>): Promise<{ success: boolean; message: string; habitId?: string }> {
      try {
        this.loading = true
        this.error = null
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, cannot create habit');
          const toastStore = useToastStore()
          toastStore.showToast('Tidak ada token autentikasi', 'error')
          return {
            success: false,
            message: 'Tidak ada token autentikasi'
          };
        }
        
        // Jika kategori berupa string (bukan ObjectId), gunakan sebagai categoryName
        const dataToSend = { ...habitData };
        if (typeof dataToSend.category === 'string' && !dataToSend.category.match(/^[0-9a-fA-F]{24}$/)) {
          dataToSend.categoryName = dataToSend.category;
          delete dataToSend.category;
        }
        
        console.log('Creating habit with data:', dataToSend);
        const response = await axios.post('/habits', dataToSend)
        
        if (response.data.success) {
          // Tambahkan kebiasaan baru ke state
          this.habits.push(response.data.data)
          
          // Update longest streak
          this.updateLongestStreak()
          
          // Update categories
          this.extractCategories()
          
          // Tampilkan toast sukses
          const toastStore = useToastStore()
          toastStore.showToast('Kebiasaan berhasil dibuat', 'success')
          
          return {
            success: true,
            message: 'Kebiasaan berhasil dibuat',
            habitId: response.data.data.id
          }
        } else {
          this.error = response.data.message || 'Gagal membuat kebiasaan'
          return {
            success: false,
            message: this.error as string
          }
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat membuat kebiasaan'
        console.error('Error creating habit:', error)
        
        // Tampilkan toast error
        const toastStore = useToastStore()
        toastStore.showToast('Gagal membuat kebiasaan: ' + this.error, 'error')
        
        return {
          success: false,
          message: this.error as string
        }
      } finally {
        this.loading = false
      }
    },
    
    // Update kebiasaan
    async updateHabit(id: string, habitData: Partial<Habit>): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true
        this.error = null
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, cannot update habit');
          const toastStore = useToastStore()
          toastStore.showToast('Tidak ada token autentikasi', 'error')
          return {
            success: false,
            message: 'Tidak ada token autentikasi'
          };
        }
        
        // Jika kategori berupa string (bukan ObjectId), gunakan sebagai categoryName
        const dataToSend = { ...habitData };
        if (typeof dataToSend.category === 'string' && !dataToSend.category.match(/^[0-9a-fA-F]{24}$/)) {
          dataToSend.categoryName = dataToSend.category;
          delete dataToSend.category;
        }
        
        console.log('Updating habit with data:', dataToSend);
        const response = await axios.put(`/habits/${id}`, dataToSend)
        
        if (response.data.success) {
          // Update kebiasaan di state
          const index = this.habits.findIndex(habit => habit.id === id)
          if (index !== -1) {
            this.habits[index] = { ...this.habits[index], ...response.data.data }
          }
          
          // Update longest streak
          this.updateLongestStreak()
          
          // Update categories
          this.extractCategories()
          
          // Tampilkan toast sukses
          const toastStore = useToastStore()
          toastStore.showToast('Kebiasaan berhasil diperbarui', 'success')
          
          return {
            success: true,
            message: 'Kebiasaan berhasil diperbarui'
          }
        } else {
          this.error = response.data.message || 'Gagal memperbarui kebiasaan'
          return {
            success: false,
            message: this.error as string
          }
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat memperbarui kebiasaan'
        console.error('Error updating habit:', error)
        
        // Tampilkan toast error
        const toastStore = useToastStore()
        toastStore.showToast('Gagal memperbarui kebiasaan: ' + this.error, 'error')
        
        return {
          success: false,
          message: this.error as string
        }
      } finally {
        this.loading = false
      }
    },
    
    // Hapus kebiasaan
    async deleteHabit(id: string): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.delete(`/habits/${id}`)
        
        if (response.data.success) {
          // Hapus kebiasaan dari state
          this.habits = this.habits.filter(habit => habit.id !== id)
          
          // Update longest streak
          this.updateLongestStreak()
          
          // Update categories
          this.extractCategories()
          
          // Tampilkan toast sukses
          const toastStore = useToastStore()
          toastStore.showToast('Kebiasaan berhasil dihapus', 'success')
          
          return {
            success: true,
            message: 'Kebiasaan berhasil dihapus'
          }
        } else {
          this.error = response.data.message || 'Gagal menghapus kebiasaan'
          return {
            success: false,
            message: this.error as string
          }
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat menghapus kebiasaan'
        console.error('Error deleting habit:', error)
        
        // Tampilkan toast error
        const toastStore = useToastStore()
        toastStore.showToast('Gagal menghapus kebiasaan: ' + this.error, 'error')
        
        return {
          success: false,
          message: this.error as string
        }
      } finally {
        this.loading = false
      }
    },
    
    // Tandai kebiasaan sebagai selesai hari ini
    async markHabitAsCompleted(id: string, count: number = 1): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.post(`/habits/${id}/complete`, { count })
        
        if (response.data.success) {
          // Update kebiasaan di state
          const index = this.habits.findIndex(habit => habit.id === id)
          if (index !== -1) {
            this.habits[index] = { ...this.habits[index], ...response.data.data }
          }
          
          // Update longest streak
          this.updateLongestStreak()
          
          return {
            success: true,
            message: 'Kebiasaan berhasil ditandai selesai'
          }
        } else {
          this.error = response.data.message || 'Gagal menandai kebiasaan sebagai selesai'
          return {
            success: false,
            message: this.error as string
          }
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat menandai kebiasaan sebagai selesai'
        console.error('Error marking habit as completed:', error)
        
        return {
          success: false,
          message: this.error as string
        }
      } finally {
        this.loading = false
      }
    },
    
    // Reset state
    resetHabitState(): void {
      this.habits = []
      this.currentHabit = null
      this.editingHabit = null
      this.loading = false
      this.error = null
      this.categories = []
      this.longestStreak = 0
    },
    
    // Update longest streak
    updateLongestStreak(): void {
      this.longestStreak = Math.max(0, ...this.habits.map(habit => habit.bestStreak))
    },
    
    // Extract unique categories
    extractCategories(): void {
      const uniqueCategories = new Set<string>()
      
      this.habits.forEach(habit => {
        if (habit.category) {
          uniqueCategories.add(habit.category)
        }
      })
      
      this.categories = Array.from(uniqueCategories)
    },
    
    // Arsip kebiasaan
    async archiveHabit(id: string): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.put(`/habits/${id}/archive`, { archived: true });
        
        if (response.data.success) {
          // Update kebiasaan di state
          const index = this.habits.findIndex(habit => habit.id === id);
          if (index !== -1) {
            this.habits[index] = { ...this.habits[index], archived: true };
          }
          
          return {
            success: true,
            message: 'Kebiasaan berhasil diarsipkan'
          };
        } else {
          this.error = response.data.message || 'Gagal mengarsipkan kebiasaan';
          return {
            success: false,
            message: this.error as string
          };
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat mengarsipkan kebiasaan';
        return {
          success: false,
          message: this.error as string
        };
      } finally {
        this.loading = false;
      }
    },
    
    // Batalkan arsip kebiasaan
    async unarchiveHabit(id: string): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.put(`/habits/${id}/archive`, { archived: false });
        
        if (response.data.success) {
          // Update kebiasaan di state
          const index = this.habits.findIndex(habit => habit.id === id);
          if (index !== -1) {
            this.habits[index] = { ...this.habits[index], archived: false };
          }
          
          return {
            success: true,
            message: 'Kebiasaan berhasil dibatalkan dari arsip'
          };
        } else {
          this.error = response.data.message || 'Gagal membatalkan arsip kebiasaan';
          return {
            success: false,
            message: this.error as string
          };
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat membatalkan arsip kebiasaan';
        return {
          success: false,
          message: this.error as string
        };
      } finally {
        this.loading = false;
      }
    }
  }
}) 