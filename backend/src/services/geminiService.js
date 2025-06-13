const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');
const userContextService = require('./userContextService');

// Initialize the Gemini API with your API key
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: 'v1beta' });

/**
 * Formats user data for AI context
 * @param {Object} userData - User data including tasks, habits, etc.
 * @returns {String} - Formatted context string
 */
const formatUserContext = (userData) => {
  // Get current date and time
  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let context = `USER CONTEXT DATA:\n`;
  
  // Add current date and time
  context += `\nCURRENT DATE AND TIME: ${formattedDate}, ${formattedTime}\n`;
  
  // Add task data
  if (userData.tasks && userData.tasks.length > 0) {
    context += `\nTASKS (${userData.tasks.length} total):\n`;
    
    const pendingTasks = userData.tasks.filter(task => task.status !== 'completed');
    if (pendingTasks.length > 0) {
      context += `Pending Tasks (${pendingTasks.length}):\n`;
      pendingTasks.forEach((task, index) => {
        if (index < 5) { // Include only first 5 tasks for context
          const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
          context += `- ${task.title} (Priority: ${task.priority}, Due: ${dueDate})\n`;
        }
      });
    }
    
    const completedTasks = userData.tasks.filter(task => task.status === 'completed');
    if (completedTasks.length > 0) {
      context += `Recently Completed Tasks (${completedTasks.length}):\n`;
      const recentCompleted = completedTasks.slice(0, 3);
      recentCompleted.forEach(task => {
        const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown';
        context += `- ${task.title} (Completed on: ${completedDate})\n`;
      });
    }
  }
  
  // Add habit data
  if (userData.habits && userData.habits.length > 0) {
    context += `\nHABITS (${userData.habits.length} total):\n`;
    userData.habits.slice(0, 5).forEach(habit => {
      const streak = habit.streak || 0;
      context += `- ${habit.name} (Current streak: ${streak} days)\n`;
    });
  }
  
  // Add schedule data
  if (userData.schedule && userData.schedule.length > 0) {
    context += `\nTODAY'S SCHEDULE:\n`;
    userData.schedule.forEach(event => {
      const start = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const end = new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      context += `- ${start} - ${end}: ${event.title} (${event.type})\n`;
    });
  }
  
  // Add productivity stats if available
  if (userData.stats) {
    context += `\nPRODUCTIVITY STATS:\n`;
    context += `Productivity Score: ${userData.stats.productivityScore}/100\n`;
    context += `Task Completion Rate: ${userData.stats.taskCompletionRate}%\n`;
    context += `Habit Consistency: ${userData.stats.habitConsistency}%\n`;
  }

  // Add user behavior patterns and preferences
  if (userData.userContext) {
    if (userData.userContext.profile) {
      context += `\nUSER PROFILE:\n`;
      if (userData.userContext.profile.name) {
        context += `Name: ${userData.userContext.profile.name}\n`;
      }
      if (userData.userContext.profile.commonTasks && userData.userContext.profile.commonTasks.length > 0) {
        context += `Common Task Categories: ${userData.userContext.profile.commonTasks.join(', ')}\n`;
      }
      if (userData.userContext.profile.interests && userData.userContext.profile.interests.length > 0) {
        context += `Interests: ${userData.userContext.profile.interests.join(', ')}\n`;
      }
    }
    
    if (userData.userContext.behaviorPatterns) {
      context += `\nBEHAVIOR PATTERNS:\n`;
      if (userData.userContext.behaviorPatterns.morningPerson !== undefined) {
        context += `Morning Person: ${userData.userContext.behaviorPatterns.morningPerson ? 'Yes' : 'No'}\n`;
      }
      if (userData.userContext.behaviorPatterns.typicalActiveHours) {
        context += `Typical Active Hours: ${userData.userContext.behaviorPatterns.typicalActiveHours.start} - ${userData.userContext.behaviorPatterns.typicalActiveHours.end}\n`;
      }
    }
    
    if (userData.userContext.conversationHistory) {
      context += `\nRECENT CONVERSATION TOPICS:\n`;
      if (userData.userContext.conversationHistory.recentTopics && userData.userContext.conversationHistory.recentTopics.length > 0) {
        context += `${userData.userContext.conversationHistory.recentTopics.join(', ')}\n`;
      }
    }
  }
  
  return context;
};

/**
 * Format conversation history for context
 * @param {Array} messages - Recent conversation messages
 * @returns {String} - Formatted conversation history
 */
const formatConversationHistory = (messages) => {
  if (!messages || messages.length === 0) {
    return '';
  }
  
  let history = '\nRECENT CONVERSATION:\n';
  
  messages.forEach(msg => {
    const role = msg.role === 'user' ? 'USER' : 'ASSISTANT';
    history += `${role}: ${msg.content}\n`;
  });
  
  return history;
};

/**
 * Get a response from Gemini AI with user context
 * @param {String} prompt - User prompt
 * @param {Object} userData - User data for context
 * @param {String} userId - User ID
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<String>} - AI response
 */
exports.getGeminiResponse = async (prompt, userData = null, userId = null, conversationId = null) => {
  try {
    // Get the model (Gemini Flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Format context with user data if provided
    let fullPrompt = prompt;
    
    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Fetch user context if userId is provided
    let userContext = null;
    let conversationMemory = null;
    
    if (userId && conversationId) {
      try {
        conversationMemory = await userContextService.getConversationMemory(userId, conversationId);
      } catch (contextError) {
        logger.warn(`Error fetching conversation memory: ${contextError.message}`);
      }
    }
    
    if (userId) {
      try {
        userContext = await userContextService.getOrCreateUserContext(userId);
      } catch (contextError) {
        logger.warn(`Error fetching user context: ${contextError.message}`);
      }
    }
    
    if (userData) {
      // Add user context to userData
      if (userContext) {
        userData.userContext = userContext;
      }
      
      const context = formatUserContext(userData);
      
      // Add conversation history if available
      let conversationContext = '';
      if (conversationMemory && conversationMemory.recentMessages) {
        conversationContext = formatConversationHistory(conversationMemory.recentMessages);
      }
      
      fullPrompt = `${context}\n${conversationContext}\n\nUSER QUERY: ${prompt}`;
    } else {
      fullPrompt = `CURRENT DATE AND TIME: ${formattedDate}, ${formattedTime}\n\nUSER QUERY: ${prompt}`;
      
      // Add conversation history if available
      if (conversationMemory && conversationMemory.recentMessages) {
        const conversationContext = formatConversationHistory(conversationMemory.recentMessages);
        fullPrompt = `${conversationContext}\n${fullPrompt}`;
      }
      
      // Add user profile if available
      if (userContext && userContext.profile && userContext.profile.name) {
        fullPrompt = `USER NAME: ${userContext.profile.name}\n${fullPrompt}`;
      }
    }
    
    // Add instruction to use markdown formatting and be direct
    fullPrompt = `${fullPrompt}\n\nINSTRUCTIONS: 
    1. Fokus langsung menjawab pertanyaan pengguna tanpa basa-basi.
    2. Berikan jawaban yang singkat, padat, dan jelas.
    3. Gunakan format markdown yang tepat: **teks tebal** untuk hal penting, *teks miring* untuk penekanan.
    4. Gunakan poin atau daftar bernomor untuk informasi berurutan.
    5. Hindari kalimat pembuka yang bertele-tele atau tidak langsung ke topik.
    6. PENTING: Tanggal dan waktu saat ini adalah ${formattedDate}, ${formattedTime}. Selalu gunakan informasi ini ketika menjawab pertanyaan tentang tanggal dan waktu.
    7. Jika pengguna meminta Anda melakukan tindakan seperti membuat tugas, jadwal, kebiasaan, atau catatan:
       a. Secara proaktif tawarkan untuk membuatnya tanpa ragu-ragu
       b. Ekstrak informasi penting (judul, mata kuliah, deadline, jenis tugas)
       c. Berikan respons yang sangat singkat dan langsung, contoh:
          "Saya akan segera membuat tugas 'Tugas Metopen - Proposal Skripsi' dengan deadline besok jam 12."
          "Baik, akan saya jadwalkan 'Rapat Kelompok' pada Senin jam 10:00."
       d. Mengonfirmasi tindakan yang akan dilakukan dengan percaya diri
    8. Ketika pengguna meminta tindakan atau informasi yang kurang jelas:
       a. JANGAN menjawab "Saya tidak bisa" atau "Saya tidak dapat membantu"
       b. Selalu tawarkan cara alternatif untuk membantu atau minta klarifikasi dengan jelas
       c. Proaktif menyarankan informasi yang mungkin dibutuhkan pengguna
    9. Untuk permintaan pembuatan jadwal:
       - Selalu tanyakan waktu dan durasi jika tidak disebutkan
       - Secara otomatis tentukan waktu yang masuk akal jika konteksnya jelas
       - Berikan konfirmasi bahwa jadwal akan dibuat
    10. Untuk permintaan pembuatan tugas, fokus pada:
       - Nama mata kuliah/kategori 
       - Jenis tugas (apa yang perlu dikerjakan)
       - Deadline (kapan harus selesai)
       - Prioritas jika disebutkan
    11. Selalu tunjukkan sikap positif, responsif, dan siap membantu dalam setiap jawaban.
    12. Untuk pertanyaan umum, berikan jawaban singkat langsung ke pointnya.
    
    ATURAN PERCAKAPAN:
    1. Simpan dan gunakan informasi tentang pengguna (nama, preferensi, riwayat interaksi) sepanjang percakapan.
    2. Berikan respons yang kontekstual dan konsisten dengan percakapan sebelumnya.
    3. Jika pengguna meminta membuat jadwal atau acara, LANGSUNG BUAT tanpa keraguan kecuali informasi sangat kurang.
    4. Sebelum menjawab, periksa apakah respons yang akan diberikan konsisten dengan percakapan sebelumnya.
    5. Ketika tidak yakin, bertanya untuk klarifikasi dengan cara yang spesifik dan membantu.
    6. Gunakan bahasa yang natural, ramah, dan percaya diri - hindari keraguan atau kekakuan.
    7. Berikan respons seakan-akan Anda adalah asisten pribadi yang memahami pengguna dengan baik.
    8. HINDARI KALIMAT: "Maaf, saya tidak bisa...", "Saya tidak memiliki kemampuan...", atau "Saya tidak dapat melakukan...".
    9. Jangan terlalu formal atau kaku. Tetap profesional namun ramah dan berdampingan dengan pengguna.
    10. Selalu ingat bahwa tujuan Anda adalah MEMBANTU pengguna dengan cara APAPUN yang Anda bisa.`;
    
    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    
    // Update user context with this conversation
    if (userId) {
      try {
        await userContextService.updateContextFromConversation(userId, prompt, response.text());
      } catch (updateError) {
        logger.warn(`Error updating user context: ${updateError.message}`);
      }
    }
    
    return response.text();
  } catch (error) {
    logger.error(`Gemini API error: ${error.message}`);
    throw new Error('Gagal memperoleh respons dari AI Assistant');
  }
};

/**
 * Generate personalized insights for a user
 * @param {Object} userData - User data including tasks, habits, etc.
 * @returns {Promise<Object>} - Insights object
 */
exports.generatePersonalInsights = async (userData) => {
  try {
    // User context
    const context = formatUserContext(userData);
    
    // Define the prompts for different insight types
    const prompts = {
      productivity: `${context}\n\nBerdasarkan data pengguna di atas, berikan insight tentang pola produktivitas mereka dan saran untuk meningkatkannya. Batasi menjadi 2-3 paragraf singkat.\n\nINSTRUCTIONS: Use proper markdown formatting in your response. Use **asterisks** for bold text, *single asterisks* for italic, and other markdown features as appropriate.`,
      habits: `${context}\n\nBerdasarkan data kebiasaan pengguna di atas, berikan insight tentang konsistensi kebiasaan mereka dan saran untuk meningkatkannya. Batasi menjadi 2-3 paragraf singkat.\n\nINSTRUCTIONS: Use proper markdown formatting in your response. Use **asterisks** for bold text, *single asterisks* for italic, and other markdown features as appropriate.`,
      timeManagement: `${context}\n\nBerdasarkan data jadwal pengguna di atas, berikan insight tentang manajemen waktu mereka dan saran untuk optimasi. Batasi menjadi 2-3 paragraf singkat.\n\nINSTRUCTIONS: Use proper markdown formatting in your response. Use **asterisks** for bold text, *single asterisks* for italic, and other markdown features as appropriate.`
    };
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate insights for each type
    const insights = {};
    
    // Generate productivity insights
    const productivityResult = await model.generateContent(prompts.productivity);
    insights.productivity = productivityResult.response.text();
    
    // Generate habit insights
    const habitsResult = await model.generateContent(prompts.habits);
    insights.habits = habitsResult.response.text();
    
    // Generate time management insights
    const timeResult = await model.generateContent(prompts.timeManagement);
    insights.timeManagement = timeResult.response.text();
    
    return insights;
  } catch (error) {
    logger.error(`Gemini insight generation error: ${error.message}`);
    throw new Error('Gagal membuat insight personal');
  }
};

/**
 * Generate schedule optimization suggestions
 * @param {Array} currentSchedule - User's current schedule
 * @param {Array} pendingTasks - Pending tasks to schedule
 * @returns {Promise<Object>} - Schedule suggestions
 */
exports.optimizeSchedule = async (currentSchedule, pendingTasks) => {
  try {
    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Format the input data
    let scheduleData = `CURRENT DATE AND TIME: ${formattedDate}, ${formattedTime}\n\nCURRENT SCHEDULE:\n`;
    
    currentSchedule.forEach(event => {
      const start = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const end = new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      scheduleData += `- ${start} - ${end}: ${event.title} (${event.type})\n`;
    });
    
    scheduleData += '\nPENDING TASKS:\n';
    pendingTasks.forEach(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
      scheduleData += `- ${task.title} (Priority: ${task.priority}, Due: ${dueDate}, Estimated time needed: ${task.estimatedTime || 'unknown'})\n`;
    });
    
    const prompt = `${scheduleData}\n\nBerdasarkan jadwal pengguna dan tugas yang tertunda di atas, berikan rekomendasi untuk mengoptimalkan jadwal harian mereka. Sertakan slot waktu yang tersedia untuk fokus dan mengerjakan tugas. Hasilkan output dalam format JSON dengan properti: recommendedSchedule (array jadwal yang dioptimalkan) dan explanation (penjelasan singkat alasannya). Dalam properti explanation, gunakan format markdown dengan **teks tebal** untuk hal penting dan *teks miring* untuk penekanan.`;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate schedule optimization
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON response
    try {
      const parsedResponse = JSON.parse(response);
      return parsedResponse;
    } catch (parseError) {
      // If parsing fails, return the raw text
      logger.warn(`Failed to parse Gemini response as JSON: ${parseError.message}`);
      return { 
        explanation: response,
        rawResponse: true
      };
    }
  } catch (error) {
    logger.error(`Gemini schedule optimization error: ${error.message}`);
    throw new Error('Gagal mengoptimalkan jadwal');
  }
};

/**
 * Get habit recommendations for a user
 * @param {Object} userData - User data including existing habits
 * @returns {Promise<Array>} - Recommended habits
 */
exports.getHabitRecommendations = async (userData) => {
  try {
    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Format user context
    const context = formatUserContext(userData);
    
    const prompt = `${context}\n\nBerdasarkan kebiasaan dan aktivitas pengguna saat ini, rekomendasikan 5 kebiasaan baru yang sesuai dan bisa melengkapi rutinitas mereka. Format dalam JSON dengan array 'recommendations' yang berisi objek dengan nama, deskripsi, frekuensi, dan alasan untuk setiap kebiasaan. Pastikan rekomendasi spesifik, realistis, dan dapat ditindaklanjuti.\n\nDalam property deskripsi dan alasan, gunakan format markdown dengan **teks tebal** untuk hal penting dan *teks miring* untuk penekanan.`;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate habit recommendations
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON response
    try {
      const parsedResponse = JSON.parse(response);
      return parsedResponse.recommendations || [];
    } catch (parseError) {
      logger.warn(`Failed to parse Gemini habit recommendations as JSON: ${parseError.message}`);
      return [{ 
        name: "Error generating recommendations",
        description: "Maaf, terjadi kesalahan saat memproses rekomendasi.",
        frequency: "daily",
        reason: "Silakan coba lagi nanti."
      }];
    }
  } catch (error) {
    logger.error(`Gemini habit recommendation error: ${error.message}`);
    throw new Error('Gagal mendapatkan rekomendasi kebiasaan');
  }
}; 