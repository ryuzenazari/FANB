import api from './api';
import { useLoadingStore } from '@/store/loading';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date | string;
  category?: string;
  labels?: string[];
  completedAt?: Date | string;
  reminderDate?: Date | string;
  attachments?: {
    name: string;
    path: string;
    type: string;
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TaskResponse {
  success: boolean;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: Task[];
}

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

const taskService = {
  /**
   * Mendapatkan daftar tugas
   */
  async getTasks(params: TaskQueryParams = {}): Promise<TasksResponse> {
    const loadingStore = useLoadingStore();
    return loadingStore.withLoading('tasks-list', async () => {
      const response = await api.get('/tasks', { params });
      return response.data;
    });
  },

  /**
   * Mendapatkan detail tugas berdasarkan ID
   */
  async getTask(id: string): Promise<TaskResponse> {
    const loadingStore = useLoadingStore();
    return loadingStore.withLoading(`task-${id}`, async () => {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    });
  },

  /**
   * Membuat tugas baru
   */
  async createTask(taskData: Partial<Task>): Promise<TaskResponse> {
    const loadingStore = useLoadingStore();
    return loadingStore.withLoading('task-create', async () => {
      const response = await api.post('/tasks', taskData);
      return response.data;
    });
  },

  /**
   * Memperbarui tugas yang sudah ada
   */
  async updateTask(id: string, taskData: Partial<Task>): Promise<TaskResponse> {
    const loadingStore = useLoadingStore();
    return loadingStore.withLoading(`task-update-${id}`, async () => {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    });
  },

  /**
   * Menghapus tugas
   */
  async deleteTask(id: string): Promise<{ success: boolean }> {
    const loadingStore = useLoadingStore();
    return loadingStore.withLoading(`task-delete-${id}`, async () => {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    });
  }
};

export default taskService; 