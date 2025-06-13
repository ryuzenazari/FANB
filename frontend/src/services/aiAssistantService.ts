import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
}

export interface AIAction {
  id: string;
  actionType: string;
  targetModel: string;
  parameters: Record<string, any>;
  status: 'requested' | 'approved' | 'rejected' | 'completed' | 'failed';
  result?: {
    success: boolean;
    message: string;
    data: any;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    conversationId: string;
    context: {
      tasksCount: number;
      habitsCount: number;
      schedulesCount: number;
    };
    action: AIAction | null;
  };
}

export interface Conversation {
  _id: string;
  title: string;
  lastMessageAt: string | Date;
}

export interface ConversationHistoryResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    history: ChatMessage[];
  };
}

export interface ConversationsResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface InsightsResponse {
  success: boolean;
  data: {
    productivity: string;
    habits: string;
    timeManagement: string;
  };
}

export interface ScheduleOptimizationResponse {
  success: boolean;
  date: string;
  data: {
    recommendedSchedule: any[];
    explanation: string;
    rawResponse?: boolean;
  };
}

export interface HabitRecommendation {
  name: string;
  description: string;
  frequency: string;
  reason: string;
  icon?: string;
  color?: string;
}

export interface HabitRecommendationsResponse {
  success: boolean;
  data: HabitRecommendation[];
}

export interface PendingActionsResponse {
  success: boolean;
  data: AIAction[];
}

export interface ActionExecutionResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    data?: any;
  };
}

const aiAssistantService = {
  /**
   * Mengirim pesan ke AI Assistant
   * @param message Pesan yang dikirim ke AI
   * @param conversationId ID percakapan yang sedang berlangsung (opsional)
   */
  async chatWithAssistant(message: string, conversationId?: string): Promise<ChatResponse> {
    const response = await api.post('/ai/chat', { message, conversationId });
    return response.data;
  },

  /**
   * Mendapatkan riwayat percakapan
   */
  async getConversationHistory(): Promise<ConversationHistoryResponse> {
    const response = await api.get('/ai/conversation-history');
    return response.data;
  },
  
  /**
   * Mendapatkan semua percakapan
   */
  async getAllConversations(page = 1, limit = 10): Promise<ConversationsResponse> {
    const response = await api.get(`/ai/conversations?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Mendapatkan percakapan berdasarkan ID
   */
  async getConversationById(id: string): Promise<ConversationHistoryResponse> {
    const response = await api.get(`/ai/conversations/${id}`);
    return response.data;
  },

  /**
   * Menghapus percakapan
   */
  async deleteConversation(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/ai/conversations/${id}`);
    return response.data;
  },

  /**
   * Mendapatkan aksi tertunda dari AI
   */
  async getPendingActions(): Promise<PendingActionsResponse> {
    const response = await api.get('/ai/pending-actions');
    return response.data;
  },

  /**
   * Menjalankan atau menolak aksi AI
   */
  async executeAction(actionId: string, approved: boolean): Promise<ActionExecutionResponse> {
    const response = await api.post(`/ai/actions/${actionId}/execute`, { approved });
    return response.data;
  },

  /**
   * Mendapatkan riwayat aksi untuk percakapan
   */
  async getConversationActions(conversationId: string): Promise<PendingActionsResponse> {
    const response = await api.get(`/ai/conversations/${conversationId}/actions`);
    return response.data;
  },

  /**
   * Mendapatkan insight personal dari AI
   */
  async getPersonalInsights(): Promise<InsightsResponse> {
    const response = await api.get('/ai/insights');
    return response.data;
  },

  /**
   * Mengoptimalkan jadwal dengan AI
   * @param date Tanggal yang ingin dioptimasi (opsional)
   */
  async optimizeSchedule(date?: string): Promise<ScheduleOptimizationResponse> {
    const data = date ? { date } : {};
    const response = await api.post('/ai/optimize-schedule', data);
    return response.data;
  },

  /**
   * Mendapatkan rekomendasi kebiasaan dari AI
   */
  async getHabitRecommendations(): Promise<HabitRecommendationsResponse> {
    const response = await api.get('/ai/habit-recommendations');
    return response.data;
  }
};

export default aiAssistantService; 