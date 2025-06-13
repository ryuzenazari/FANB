import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { useToastStore } from './toast';

// Interface untuk tugas
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  labels?: string[];
  category?: string;
  categoryName?: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  categories: string[];
  tags: string[];
  filters: any;
  sortBy: string;
}

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    categories: ['Personal', 'Work', 'Study', 'Health', 'Finance', 'Other'],
    tags: ['Important', 'Urgent', 'Meeting', 'Review', 'Follow-up'],
    filters: {
      status: '',
      priority: '',
      category: '',
      tag: '',
      dateRange: null
    },
    sortBy: 'dueDate'
  }),
  
  getters: {
    // Tugas yang belum selesai
    pendingTasks: (state) => state.tasks.filter(task => task.status !== 'completed'),
    
    // Tugas yang sudah selesai
    completedTasks: (state) => state.tasks.filter(task => task.status === 'completed'),
    
    // Jumlah total tugas
    totalTasks: (state) => state.tasks.length,
    
    // Tugas berdasarkan prioritas
    tasksByPriority: (state) => {
      return {
        urgent: state.tasks.filter(task => task.priority === 'urgent'),
        high: state.tasks.filter(task => task.priority === 'high'),
        medium: state.tasks.filter(task => task.priority === 'medium'),
        low: state.tasks.filter(task => task.priority === 'low')
      };
    },
    
    // Tugas yang akan datang (tenggat dalam 7 hari ke depan)
    upcomingTasks: (state) => {
    const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      return state.tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek && task.status !== 'completed';
      });
    },
    
    // Tugas yang sudah melewati tenggat
    overdueTasks: (state) => {
      const today = new Date();
      
      return state.tasks.filter(task => {
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        return dueDate < today && task.status !== 'completed';
      });
    },
    
    // Jumlah tugas yang sudah melewati tenggat
    overdueTasksCount: (state) => {
      const today = new Date();
      
      return state.tasks.filter(task => {
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        return dueDate < today && task.status !== 'completed';
      }).length;
    },
    
    // Jumlah tugas hari ini
    todayTasksCount: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      return state.tasks.filter(task => {
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }).length;
    },
    
    // Loading alias untuk isLoading
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Ambil semua tugas
    async fetchTasks(page: number = 1): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        this.currentPage = page;
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, skipping tasks fetch');
          this.tasks = [];
          return;
        }
        
        // Using axios with baseURL configuration
        console.log('Attempting to fetch tasks for page:', page);
        const response = await axios.get('/tasks', {
          params: {
            page: page,
            limit: 10,
            ...this.filters
          }
        });
        
        console.log('Task API response:', response);
        
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          // Format yang diharapkan: {success: true, data: Task[], pagination: {total, totalPages}}
          this.tasks = response.data.data;
          
          // Update pagination info if available
          if (response.data.pagination) {
            this.totalPages = response.data.pagination.totalPages || 1;
          }
          
          console.log('Successfully parsed tasks:', this.tasks.length);
        } else {
          console.error('Format respons tidak sesuai yang diharapkan:', response.data);
          this.error = 'Format data tugas tidak valid';
          this.tasks = [];
        }
      } catch (error: any) {
        this.error = error?.response?.data?.message || error?.message || 'Terjadi kesalahan saat mengambil data tugas';
        console.error('Error fetching tasks:', error);
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },
    
    // Ambil tugas berdasarkan ID
    async fetchTaskById(id: string): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.get(`/tasks/${id}`);
        
        if (response.data.success) {
          this.currentTask = response.data.data;
      } else {
          this.error = 'Gagal mengambil detail tugas';
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat mengambil detail tugas';
        console.error('Error fetching task by ID:', error);
    } finally {
        this.loading = false;
      }
    },
    
    // Update filters
    updateFilters(filters: any): void {
      this.filters = { ...this.filters, ...filters };
      this.fetchTasks(1); // Reset to first page when filters change
    },
    
    // Update sort
    updateSort(sortBy: string): void {
      this.sortBy = sortBy;
      this.fetchTasks(this.currentPage);
    },
    
    // Buat tugas baru
    async createTask(taskData: Partial<Task>): Promise<{ success: boolean; message: string; taskId?: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, cannot create task');
          return {
            success: false,
            message: 'Tidak ada token autentikasi'
          };
        }
        
        // Jika kategori berupa string (bukan ObjectId), gunakan sebagai categoryName
        const dataToSend = { ...taskData };
        if (typeof dataToSend.category === 'string' && !dataToSend.category.match(/^[0-9a-fA-F]{24}$/)) {
          dataToSend.categoryName = dataToSend.category;
          delete dataToSend.category;
        }
        
        console.log('Creating task with data:', dataToSend);
        const response = await axios.post('/tasks', dataToSend);
        
        if (response.data.success) {
          // Tambahkan tugas baru ke state
          this.tasks.push(response.data.data);
          
          // Tampilkan toast sukses
          const toastStore = useToastStore();
          toastStore.showToast('Tugas berhasil dibuat', 'success');
          
          return {
            success: true,
            message: 'Tugas berhasil dibuat',
            taskId: response.data.data.id
          };
        } else {
          this.error = response.data.message || 'Gagal membuat tugas';
          return {
            success: false,
            message: this.error || 'Gagal membuat tugas'
          };
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat membuat tugas';
        console.error('Error creating task:', error);
        
        // Tampilkan toast error
        const toastStore = useToastStore();
        toastStore.showToast(this.error || 'Error tidak diketahui', 'error');
        
        return {
          success: false,
          message: this.error || 'Terjadi kesalahan saat membuat tugas'
        };
      } finally {
        this.loading = false;
      }
    },
    
    // Update tugas
    async updateTask(id: string, taskData: Partial<Task>): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, cannot update task');
          return {
            success: false,
            message: 'Tidak ada token autentikasi'
          };
        }
        
        // Jika kategori berupa string (bukan ObjectId), gunakan sebagai categoryName
        const dataToSend = { ...taskData };
        if (typeof dataToSend.category === 'string' && !dataToSend.category.match(/^[0-9a-fA-F]{24}$/)) {
          dataToSend.categoryName = dataToSend.category;
          delete dataToSend.category;
        }
        
        console.log('Updating task with data:', dataToSend);
        const response = await axios.put(`/tasks/${id}`, dataToSend);
        
        if (response.data.success) {
          // Update tugas di state
          const index = this.tasks.findIndex(task => task.id === id);
          if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...taskData };
          }
          
          // Tampilkan toast sukses
          const toastStore = useToastStore();
          toastStore.showToast('Tugas berhasil diperbarui', 'success');
          
          return {
            success: true,
            message: 'Tugas berhasil diperbarui'
          };
        } else {
          this.error = response.data.message || 'Gagal memperbarui tugas';
          return {
            success: false,
            message: this.error || 'Gagal memperbarui tugas'
          };
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat memperbarui tugas';
        console.error('Error updating task:', error);
        
        // Tampilkan toast error
        const toastStore = useToastStore();
        toastStore.showToast(this.error || 'Error tidak diketahui', 'error');
        
        return {
          success: false,
          message: this.error || 'Terjadi kesalahan saat memperbarui tugas'
        };
      } finally {
        this.loading = false;
      }
    },
    
    // Hapus tugas
    async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        console.log('Deleting task with ID:', id);
        
        // Check if token exists
        const token = localStorage.getItem('user-token');
        if (!token) {
          console.log('No token available, cannot delete task');
          return {
            success: false,
            message: 'Tidak ada token autentikasi'
          };
        }
        
        // Log request details
        console.log('Sending DELETE request to:', `/tasks/${id}`);
        console.log('Authorization header exists:', !!axios.defaults.headers.common['Authorization']);
        
        const response = await axios.delete(`/tasks/${id}`);
        console.log('Delete task response:', response.data);
        
        if (response.data.success) {
          // Hapus tugas dari state
          const beforeCount = this.tasks.length;
          
          // Perhatikan perbedaan antara id dan task.id atau task._id
          this.tasks = this.tasks.filter(task => {
            // Handle berbagai kemungkinan format ID
            const taskId = task.id;
            
            // Jika tipe data berbeda, konversi keduanya ke string
            const taskIdStr = String(taskId);
            const idStr = String(id);
            
            // Log perbandingan untuk debugging
            const shouldKeep = taskIdStr !== idStr;
            console.log(`Comparing taskId: ${taskId} (${typeof taskId}) with id: ${id} (${typeof id}) => ${shouldKeep ? 'keep' : 'remove'}`);
            
            // Filter: kembalikan true untuk task yang ingin DISIMPAN (bukan dihapus)
            return taskIdStr !== idStr; 
          });
          
          const afterCount = this.tasks.length;
          
          console.log(`Task removed from state: ${beforeCount} -> ${afterCount} tasks`);
          
          if (beforeCount === afterCount) {
            console.warn('Warning: No task was removed from state, IDs might not match');
          }
          
          // Tampilkan toast sukses
          const toastStore = useToastStore();
          toastStore.showToast('Tugas berhasil dihapus', 'success');
          
          return {
            success: true,
            message: 'Tugas berhasil dihapus'
          };
        } else {
          this.error = response.data.message || 'Gagal menghapus tugas';
          console.error('Server returned error:', this.error);
          return {
            success: false,
            message: this.error || 'Gagal menghapus tugas'
          };
        }
      } catch (error: any) {
        this.error = error?.message || 'Terjadi kesalahan saat menghapus tugas';
        console.error('Error deleting task:', error);
        console.error('Error details:', error?.response?.data || 'No response data');
        
        // Tampilkan toast error
        const toastStore = useToastStore();
        toastStore.showToast(this.error || 'Error tidak diketahui', 'error');
        
        return {
          success: false,
          message: this.error || 'Terjadi kesalahan saat menghapus tugas'
        };
      } finally {
        this.loading = false;
      }
    },
    
    // Ubah status tugas
    async changeTaskStatus(id: string, status: 'todo' | 'in-progress' | 'completed'): Promise<{ success: boolean; message: string }> {
      return this.updateTask(id, { status });
    },
    
    // Reset state
    resetTaskState(): void {
      this.tasks = [];
      this.currentTask = null;
      this.loading = false;
      this.error = null;
    }
  }
}); 