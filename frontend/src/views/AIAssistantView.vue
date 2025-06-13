<template>
  <div class="ai-assistant-view">
    <div class="container">
      <header class="page-header">
        <h1>Asisten AI</h1>
        <p class="subtitle">Asisten pribadi yang membantu meningkatkan produktivitas Anda</p>
        
        <div class="conversation-actions">
          <button @click="newConversation" class="new-conversation-btn">
            <span class="icon">✚</span> Percakapan Baru
          </button>
          <button @click="showConversations = !showConversations" class="history-btn">
            <span class="icon">📜</span> Riwayat Percakapan
          </button>
        </div>
      </header>
      
      <!-- Conversation Management -->
      <div class="conversation-management" v-if="showConversations">
        <div class="conversations-header">
          <h2>Riwayat Percakapan</h2>
          <button @click="showConversations = false" class="close-btn">&times;</button>
        </div>
        
        <div v-if="conversations.length === 0" class="no-conversations">
          Belum ada riwayat percakapan
        </div>
        
        <div v-else class="conversations-list">
          <div 
            v-for="conv in conversations" 
            :key="conv._id" 
            class="conversation-item"
            :class="{ active: conversationId === conv._id }"
            @click="loadConversation(conv._id)"
          >
            <div class="conversation-title">{{ conv.title }}</div>
            <div class="conversation-date">{{ formatDate(conv.lastMessageAt) }}</div>
            <button @click.stop="deleteConversation(conv._id)" class="delete-conversation">
              🗑️
            </button>
          </div>
          
          <div class="conversations-pagination" v-if="totalPages > 1">
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="loadConversations(page)"
              :class="{ active: currentPage === page }"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <div class="chat-container">
        <div class="chat-messages" ref="chatContainer">
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message', message.sender === 'ai' ? 'ai-message' : 'user-message']">
            <div class="message-avatar">
              <div v-if="message.sender === 'ai'" class="ai-avatar">AI</div>
              <div v-else class="user-avatar">
                {{ userInitials }}
              </div>
            </div>
            <div class="message-bubble">
              <div class="message-content" v-html="parseMarkdown(message.content)">
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              
              <!-- AI Action interface if available -->
              <div v-if="message.action" class="action-container">
                <div class="action-header">
                  <span class="action-icon">🤖</span>
                  <span class="action-title">
                    {{ getActionTitle(message.action) }}
                  </span>
                </div>
                
                <div class="action-details">
                  {{ getActionDetails(message.action) }}
                </div>
                
                <div v-if="message.action.status === 'requested'" class="action-buttons">
                  <button @click="executeAction(message.action.id, true)" class="action-approve">
                    Setuju
                  </button>
                  <button @click="executeAction(message.action.id, false)" class="action-reject">
                    Tolak
                  </button>
                </div>
                
                <div v-else class="action-status" :class="getActionStatusClass(message.action)">
                  {{ getActionStatus(message.action) }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="loading" class="message ai-message">
            <div class="message-avatar">
              <div class="ai-avatar">AI</div>
            </div>
            <div class="message-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <form @submit.prevent="sendMessage">
            <div class="input-container">
              <input 
                type="text" 
                v-model="userInput" 
                placeholder="Tanyakan sesuatu pada asisten AI..." 
                :disabled="loading"
              />
              <button type="submit" :disabled="loading || !userInput.trim()">
                <span class="send-icon">↑</span>
              </button>
            </div>
          </form>
          <div class="suggestions">
            <button 
              v-for="(suggestion, index) in suggestions" 
              :key="index"
              @click="applySuggestion(suggestion)"
              class="suggestion-chip"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
      

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useAuthStore } from '../store/auth';
import { useToastStore } from '../store/toast';
import aiAssistantService from '../services/aiAssistantService';
import type { AIAction } from '../services/aiAssistantService';
import { marked } from 'marked';

interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  action?: AIAction;
}

interface Conversation {
  _id: string;
  title: string;
  lastMessageAt: Date | string;
}

// Store
const authStore = useAuthStore();
const toastStore = useToastStore();

// Refs
const chatContainer = ref<HTMLElement | null>(null);
const userInput = ref('');
const messages = ref<Message[]>([
  {
    content: 'Apa yang bisa saya bantu hari ini?',
    sender: 'ai',
    timestamp: new Date()
  }
]);
const loading = ref(false);
const conversationId = ref('');
const suggestions = ref([
  'Buatkan jadwal meeting besok jam 10',
  'Tambahkan tugas untuk presentasi minggu depan',
  'Buat kebiasaan baru untuk olahraga pagi',
  'Jadwalkan waktu fokus untuk menulis laporan',
  'Tolong catat poin penting dari rapat hari ini'
]);

// Conversation management
const showConversations = ref(false);
const conversations = ref<Conversation[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);

// Parse markdown to HTML
const parseMarkdown = (text: string): string => {
  // Use simpler marked call with minimal options
  return marked(text, {
    breaks: true,           // Add line breaks
    gfm: true,              // GitHub Flavored Markdown
  }) as string;
};

// Mendapatkan inisial pengguna dari store
const userInitials = computed(() => {
  const user = authStore.user;
  if (!user || !user.profile) return 'U';
  
  const firstName = user.profile.firstName || '';
  const lastName = user.profile.lastName || '';
  
  return (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();
});

// Format waktu pesan
const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date for conversation history
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get readable title for action
const getActionTitle = (action: AIAction): string => {
  const actionTypes: Record<string, string> = {
    'create_task': 'Tambah Tugas Baru',
    'update_task': 'Perbarui Tugas',
    'delete_task': 'Hapus Tugas',
    'create_schedule': 'Buat Jadwal Baru',
    'update_schedule': 'Perbarui Jadwal',
    'delete_schedule': 'Hapus Jadwal',
    'create_habit': 'Tambah Kebiasaan Baru',
    'update_habit': 'Perbarui Kebiasaan',
    'delete_habit': 'Hapus Kebiasaan',
    'create_note': 'Buat Catatan Baru',
    'update_note': 'Perbarui Catatan',
    'delete_note': 'Hapus Catatan'
  };
  
  return actionTypes[action.actionType] || 'Tindakan AI';
};

// Get details for action
const getActionDetails = (action: AIAction): string => {
  if (action.actionType === 'create_task') {
    return `Judul: ${action.parameters.title}\nPrioritas: ${
      action.parameters.priority === 'high' ? 'Tinggi' : 
      action.parameters.priority === 'medium' ? 'Menengah' : 'Rendah'
    }${action.parameters.dueDate ? `\nTenggat: ${new Date(action.parameters.dueDate).toLocaleDateString()}` : ''}`;
  }
  
  if (action.actionType === 'create_schedule') {
    return `${action.parameters.title}\nWaktu: ${
      new Date(action.parameters.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    } - ${
      new Date(action.parameters.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }`;
  }
  
  if (action.actionType === 'create_habit') {
    return `Nama: ${action.parameters.name}\nFrekuensi: ${
      action.parameters.frequency === 'daily' ? 'Harian' :
      action.parameters.frequency === 'weekly' ? 'Mingguan' : 'Bulanan'
    }`;
  }
  
  if (action.actionType === 'create_note') {
    return `Judul: ${action.parameters.title}\n${action.parameters.content ? `Konten: ${action.parameters.content.substring(0, 50)}...` : ''}`;
  }
  
  return JSON.stringify(action.parameters);
};

// Get action status text
const getActionStatus = (action: AIAction): string => {
  const statuses: Record<string, string> = {
    'requested': 'Menunggu persetujuan',
    'approved': 'Disetujui',
    'rejected': 'Ditolak',
    'completed': 'Selesai',
    'failed': 'Gagal'
  };
  
  return statuses[action.status] || action.status;
};

// Get action status CSS class
const getActionStatusClass = (action: AIAction): string => {
  return `status-${action.status}`;
};

// Methods
const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return;
  
  // Add user message
  const userMessage = {
    content: userInput.value.trim(),
    sender: 'user' as const,
    timestamp: new Date()
  };
  messages.value.push(userMessage);
  
  // Clear input and scroll
  const sentMessage = userInput.value;
  userInput.value = '';
  scrollToBottom();
  
  // Set loading
  loading.value = true;
  
  try {
    // Get response from API
    const response = await aiAssistantService.chatWithAssistant(sentMessage, conversationId.value);
    
    // Set conversation ID if not already set
    if (response.success && response.data.conversationId) {
      conversationId.value = response.data.conversationId;
    }
    
    // Create AI message
    const aiMessage: Message = {
      content: response.success ? response.data.message : 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.',
      sender: 'ai' as const,
      timestamp: new Date(),
      action: response.data?.action || undefined
    };
    
    // Add AI message
    messages.value.push(aiMessage);
    
    // Update suggestions based on context
    updateSuggestions();
  } catch (error) {
    console.error('Error sending message:', error);
    messages.value.push({
      content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.',
      sender: 'ai' as const,
      timestamp: new Date()
    });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

// Update saran berdasarkan konteks percakapan dan waktu
const updateSuggestions = () => {
  const now = new Date();
  const hour = now.getHours();
  const userMessages = messages.value.filter(msg => msg.sender === 'user').map(msg => msg.content.toLowerCase());
  
  // Saran berdasarkan waktu
  const timeBasedSuggestions = [];
  
  // Pagi (5-11)
  if (hour >= 5 && hour <= 11) {
    timeBasedSuggestions.push('Buat jadwal kegiatan hari ini');
    timeBasedSuggestions.push('Catatan untuk meeting pagi ini');
  } 
  // Siang (12-15)
  else if (hour >= 12 && hour <= 15) {
    timeBasedSuggestions.push('Jadwalkan waktu fokus untuk sore nanti');
    timeBasedSuggestions.push('Tambahkan tugas untuk deadline minggu ini');
  } 
  // Sore (16-19)
  else if (hour >= 16 && hour <= 19) {
    timeBasedSuggestions.push('Ringkas pekerjaan hari ini');
    timeBasedSuggestions.push('Buat jadwal untuk besok');
  } 
  // Malam (20-23)
  else {
    timeBasedSuggestions.push('Evaluasi produktivitas hari ini');
    timeBasedSuggestions.push('Siapkan jadwal untuk besok pagi');
  }
  
  // Saran berdasarkan topik yang dibahas
  const taskKeywords = ['tugas', 'deadline', 'pr', 'assignment', 'pekerjaan'];
  const habitKeywords = ['kebiasaan', 'habit', 'rutin', 'rutinitas', 'daily'];
  const scheduleKeywords = ['jadwal', 'schedule', 'meeting', 'acara', 'rapat', 'kelas'];
  
  // Check if any message contains these keywords
  const hasTalkedAboutTasks = userMessages.some(msg => taskKeywords.some(keyword => msg.includes(keyword)));
  const hasTalkedAboutHabits = userMessages.some(msg => habitKeywords.some(keyword => msg.includes(keyword)));
  const hasTalkedAboutSchedule = userMessages.some(msg => scheduleKeywords.some(keyword => msg.includes(keyword)));
  
  // Add relevant suggestions
  if (hasTalkedAboutTasks) {
    timeBasedSuggestions.push('Tambahkan tugas untuk presentasi minggu depan');
    timeBasedSuggestions.push('Apa tugas prioritas untuk besok?');
  }
  
  if (hasTalkedAboutHabits) {
    timeBasedSuggestions.push('Buat kebiasaan baru untuk olahraga pagi');
    timeBasedSuggestions.push('Bagaimana cara konsisten dengan kebiasaan?');
  }
  
  if (hasTalkedAboutSchedule) {
    timeBasedSuggestions.push('Jadwalkan meeting dengan tim besok pukul 9');
    timeBasedSuggestions.push('Buatkan jadwal belajar efektif untuk minggu ini');
  }
  
  // Add some general suggestions if we don't have enough contextual ones
  const generalSuggestions = [
    'Tolong catat poin penting dari rapat hari ini',
    'Tambahkan kebiasaan membaca 30 menit setiap hari',
    'Jadwalkan waktu fokus untuk menulis laporan',
    'Buat daftar prioritas untuk minggu ini',
    'Bagaimana cara meningkatkan produktivitas?'
  ];
  
  // Combine time-based and context-based suggestions, add some general ones if needed
  let newSuggestions = [...timeBasedSuggestions];
  
  // Make sure we have 5 suggestions
  while (newSuggestions.length < 5) {
    const randomIndex = Math.floor(Math.random() * generalSuggestions.length);
    const suggestion = generalSuggestions[randomIndex];
    
    // Add suggestion if it's not already in the list
    if (!newSuggestions.includes(suggestion)) {
      newSuggestions.push(suggestion);
    }
  }
  
  // Take at most 5 suggestions
  suggestions.value = newSuggestions.slice(0, 5);
};

// Execute or reject AI action
const executeAction = async (actionId: string, approved: boolean) => {
  try {
    const response = await aiAssistantService.executeAction(actionId, approved);
    
    // Find the message with this action and update its status
    const messageWithAction = messages.value.find(
      msg => msg.action && msg.action.id === actionId
    );
    
    if (messageWithAction && messageWithAction.action) {
      // Update the action status in the message
      messageWithAction.action.status = approved ? 'completed' : 'rejected';
      // Cast result to match the required type
      messageWithAction.action.result = {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || {}
      };
      
      // Add a follow-up message from AI about the action result
      const resultMessage = approved
        ? `✅ Tindakan berhasil dilakukan: ${getActionTitle(messageWithAction.action)}.`
        : `❌ Tindakan ditolak: ${getActionTitle(messageWithAction.action)}.`;
      
      messages.value.push({
        content: resultMessage,
        sender: 'ai',
        timestamp: new Date()
      });
      
      // Show toast notification
      toastStore.showToast(
        resultMessage,
        approved && response.data.success ? 'success' : 'info',
        3000
      );
    }
  } catch (error) {
    console.error('Error executing action:', error);
    toastStore.showToast(
      'Gagal melaksanakan tindakan AI',
      'error',
      3000
    );
  }
};

// Load conversation history
const loadConversations = async (page = 1) => {
  try {
    const response = await aiAssistantService.getAllConversations(page, 10);
    if (response.success) {
      conversations.value = response.data.conversations;
      currentPage.value = response.data.pagination.page;
      totalPages.value = response.data.pagination.pages;
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
    toastStore.showToast(
      'Gagal memuat riwayat percakapan',
      'error',
      3000
    );
  }
};

// Load specific conversation
const loadConversation = async (id: string) => {
  try {
    const response = await aiAssistantService.getConversationById(id);
    if (response.success && response.data) {
      // Update conversation ID
      conversationId.value = id;
      
      // Convert history to messages
      messages.value = response.data.history.map((msg) => ({
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.timestamp)
      }));
      
      // Close conversations panel
      showConversations.value = false;
      
      // Scroll to bottom after loading
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
    toastStore.showToast(
      'Gagal memuat percakapan',
      'error',
      3000
    );
  }
};

// Delete conversation
const deleteConversation = async (id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
    return;
  }
  
  try {
    const response = await aiAssistantService.deleteConversation(id);
    if (response.success) {
      // If deleted the current conversation, reset it
      if (id === conversationId.value) {
        newConversation();
      }
      
      // Reload conversations list
      loadConversations(currentPage.value);
      
      toastStore.showToast(
        'Percakapan berhasil dihapus',
        'success',
        3000
      );
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
    toastStore.showToast(
      'Gagal menghapus percakapan',
      'error',
      3000
    );
  }
};

// Start a new conversation
const newConversation = () => {
  conversationId.value = '';
  messages.value = [
    {
      content: 'Apa yang bisa saya bantu hari ini?',
      sender: 'ai',
      timestamp: new Date()
    }
  ];
  showConversations.value = false;
};

// Menerapkan saran sebagai input
const applySuggestion = (suggestion: string) => {
  userInput.value = suggestion;
};

// Scroll ke pesan terbaru
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Lakukan scroll saat pesan baru ditambahkan
watch(() => messages.value.length, scrollToBottom);

// Ambil riwayat percakapan saat komponen dimuat
onMounted(async () => {
  try {
    const response = await aiAssistantService.getConversationHistory();
    if (response.success && response.data.history && response.data.history.length > 0) {
      // Hapus pesan sambutan default dan gunakan riwayat dari server
      messages.value = response.data.history.map((msg) => ({
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.timestamp)
      }));
      
      // Simpan ID percakapan jika ada
      if (response.data.id) {
        conversationId.value = response.data.id;
      }
    }
    
    // Load conversation history
    loadConversations();
  } catch (error) {
    console.error('Error saat mengambil riwayat percakapan:', error);
  }
  
  scrollToBottom();
  
  // Update suggestions based on current time
  updateSuggestions();
});
</script>

<style scoped>
.ai-assistant-view {
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.conversation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.new-conversation-btn,
.history-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.new-conversation-btn:hover,
.history-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.chat-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(80vh - 4rem);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 80%;
  animation: fadeIn 0.3s ease-out;
}

.ai-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 600;
}

.ai-avatar {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.user-avatar {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  color: white;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  position: relative;
  transition: all 0.3s ease-in-out;
  animation: fadeInMessage 0.4s ease-out;
}

.ai-message .message-bubble {
  border-top-left-radius: 0;
  text-align: left;
}

.user-message .message-bubble {
  background: rgba(59, 130, 246, 0.2);
  border-top-right-radius: 0;
}

.message-content {
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
  text-align: left;
}

/* Markdown styling */
.message-content p {
  margin: 0.5rem 0;
  text-align: left;
}

.message-content p:first-child {
  margin-top: 0;
}

.message-content p:last-child {
  margin-bottom: 0;
}

.message-content strong {
  font-weight: 700;
}

.message-content em {
  font-style: italic;
}

.message-content ul, .message-content ol {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 0;
  text-align: left;
}

.message-content li {
  text-align: left;
  margin-bottom: 0.25rem;
}

.message-content code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.6;
  text-align: right;
  margin-top: 0.5rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
}

.typing-indicator span {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: typingAnimation 1s infinite;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.chat-input {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
}

.input-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  padding: 0.25rem 0.25rem 0.25rem 1.5rem;
  margin-bottom: 1rem;
}

.input-container input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.input-container input:focus {
  outline: none;
}

.input-container button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.input-container button:hover {
  transform: scale(1.05);
}

.input-container button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.suggestion-chip {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  color: var(--text-primary);
}

.suggestion-chip:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInMessage {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .message {
    max-width: 90%;
  }
  
  .suggestions {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    flex-wrap: nowrap;
  }
  
  .chat-container {
    height: calc(85vh - 4rem);
  }
}

.action-container {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.action-icon {
  font-size: 1.25rem;
}

.action-title {
  font-weight: 600;
  color: #3b82f6;
}

.action-details {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-family: monospace;
  white-space: pre-line;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-approve, .action-reject {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-approve {
  background: #10b981;
  color: white;
}

.action-approve:hover {
  background: #059669;
}

.action-reject {
  background: rgba(255, 255, 255, 0.1);
  color: #f87171;
}

.action-reject:hover {
  background: rgba(255, 255, 255, 0.2);
}

.action-status {
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
}

.status-completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-rejected {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
}

.status-failed {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Conversation management */
.conversation-management {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.conversations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.conversations-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.conversations-list {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.conversation-item {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.conversation-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.conversation-item.active {
  background: rgba(59, 130, 246, 0.2);
  border-left: 3px solid #3b82f6;
}

.conversation-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
  padding-right: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-date {
  font-size: 0.75rem;
  opacity: 0.7;
}

.delete-conversation {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.conversation-item:hover .delete-conversation {
  opacity: 1;
}

.no-conversations {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

.conversations-pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.conversations-pagination button {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.conversations-pagination button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.conversations-pagination button.active {
  background: #3b82f6;
}
</style> 