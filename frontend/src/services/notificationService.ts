import api from './api';

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  type: 'task' | 'habit' | 'system' | 'ai-insight' | 'reminder';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'dismissed';
  scheduledFor?: Date | string;
  icon: string;
  color: string;
  relatedItemId?: string;
  relatedItemModel?: 'Task' | 'Habit' | 'Note' | 'User';
  actionUrl?: string;
  repeat: boolean;
  repeatPattern?: 'daily' | 'weekly' | 'monthly' | 'custom';
  deliveryMethod: 'app' | 'email' | 'both';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
}

export interface NotificationsResponse {
  success: boolean;
  count: number;
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: Notification[];
}

export interface NotificationQueryParams {
  status?: string;
  type?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

const notificationService = {
  /**
   * Mendapatkan daftar notifikasi
   */
  async getNotifications(params: NotificationQueryParams = {}): Promise<NotificationsResponse> {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  /**
   * Mendapatkan detail notifikasi berdasarkan ID
   */
  async getNotification(id: string): Promise<NotificationResponse> {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Membuat notifikasi baru
   */
  async createNotification(notificationData: Partial<Notification>): Promise<NotificationResponse> {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  /**
   * Memperbarui notifikasi yang sudah ada
   */
  async updateNotification(
    id: string,
    notificationData: Partial<Notification>
  ): Promise<NotificationResponse> {
    const response = await api.put(`/notifications/${id}`, notificationData);
    return response.data;
  },

  /**
   * Menghapus notifikasi
   */
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Menandai notifikasi sebagai telah dibaca
   */
  async markAsRead(id: string): Promise<NotificationResponse> {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Menandai semua notifikasi sebagai telah dibaca
   */
  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default notificationService; 