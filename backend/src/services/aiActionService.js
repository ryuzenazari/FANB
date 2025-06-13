const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const Habit = require('../models/Habit');
const Note = require('../models/Note');
const AIAction = require('../models/AIAction');
const logger = require('../config/logger');
const { parseISO, addMinutes, addHours, addDays } = require('date-fns');

/**
 * Extract action intent from AI message
 * @param {String} message - User message
 * @param {Object} aiResponse - AI response object
 * @returns {Object|null} - Extracted action or null if no action
 */
exports.extractActionIntent = async (message, aiResponse) => {
  // Keywords to identify potential actions - diperluas untuk mengenali lebih banyak frasa umum
  const taskKeywords = [
    'buat tugas', 'tambahkan tugas', 'jadwalkan tugas', 'ingatkan saya', 'bikin task', 
    'catat tugas', 'tolong buat tugas', 'bisakah kamu membuat tugas', 'saya perlu mengerjakan',
    'tambah pr', 'tambahkan pr', 'ada pr', 'ada tugas', 'deadline', 'mengerjakan pr',
    'mengerjakan tugas', 'tambahkan to-do', 'tambah to-do', 'to do', 'todo', 'bikin tugas',
    'buatkan tugas', 'tambah tugas', 'tugas baru', 'assignment', 'pekerjaan rumah',
    'pr', 'task', 'tolong ingatkan', 'reminder', 'jangan lupa'
  ];
  
  const scheduleKeywords = [
    'jadwalkan', 'buat jadwal', 'tambahkan jadwal', 'buat event', 'tambahkan event',
    'bisakah kamu menjadwalkan', 'tolong jadwalkan', 'buat janji', 'tambahkan janji',
    'jadwalkan meeting', 'jadwal kegiatan', 'buat acara', 'tambahkan acara', 'rapat',
    'ada rapat', 'akan ada', 'akan diadakan', 'jadwal', 'janji temu', 'event',
    'acara', 'meeting', 'pertemuan', 'agenda', 'schedule', 'bikin jadwal',
    'buatkan jadwal', 'tambah jadwal', 'jadwal baru', 'appointment', 'kelas',
    'kuliah', 'ujian', 'seminar', 'workshop', 'webinar', 'presentasi'
  ];
  
  const habitKeywords = [
    'buat kebiasaan', 'tambahkan kebiasaan', 'catat kebiasaan', 'track kebiasaan',
    'bisakah kamu membuat kebiasaan', 'tolong buat kebiasaan', 'saya ingin memulai kebiasaan',
    'ingin membiasakan diri', 'kebiasaan baru', 'kebiasaan baik', 'habit baru', 'rutin',
    'habit', 'kebiasaan', 'rutinitas', 'bikin kebiasaan', 'buatkan kebiasaan', 
    'tambah kebiasaan', 'tracking kebiasaan', 'membiasakan', 'biasakan', 'daily habit',
    'weekly habit', 'monthly habit', 'kebiasaan harian', 'kebiasaan mingguan',
    'kebiasaan bulanan', 'mulai kebiasaan', 'memulai kebiasaan', 'membiasakan diri',
    'habit tracker', 'kebiasaan sehat', 'healthy habit', 'kebiasaan produktif'
  ];
  
  const noteKeywords = [
    'buat catatan', 'catat', 'tulis catatan', 'tolong catat', 'ingat ini',
    'tolong ingat', 'simpan catatan', 'catat ini', 'bisakah kamu mencatat',
    'catat poin', 'simpan poin', 'buat note', 'tolong buat note', 'note',
    'catatan', 'memo', 'bikin catatan', 'buatkan catatan', 'tambah catatan',
    'catatan baru', 'catat poin-poin', 'catat informasi', 'simpan informasi'
  ];
  
  // Konversi pesan ke lowercase dan hapus karakter khusus
  const cleanedMsg = message.toLowerCase().replace(/[,.!?;:'"()\[\]{}]/g, ' ');
  
  // Pencocokan lebih fleksibel dengan mempertimbangkan kata terpisah
  const containsKeyword = (keywords, msg) => {
    return keywords.some(keyword => {
      // Cek kata persis
      if (msg.includes(keyword)) return true;
      
      // Cek kata-kata terpisah (misal "buat" dan "tugas" terpisah dalam kalimat)
      if (keyword.includes(' ')) {
        const keywordParts = keyword.split(' ');
        // Pastikan semua kata bagian ada dalam pesan
        return keywordParts.every(part => msg.includes(part));
      }
      return false;
    });
  };
  
  // Detect action type from user message
  let actionType = null;
  let targetModel = null;
  
  if (containsKeyword(taskKeywords, cleanedMsg)) {
    actionType = 'create_task';
    targetModel = 'Task';
  } else if (containsKeyword(scheduleKeywords, cleanedMsg)) {
    actionType = 'create_schedule';
    targetModel = 'Schedule';
  } else if (containsKeyword(habitKeywords, cleanedMsg)) {
    actionType = 'create_habit';
    targetModel = 'Habit';
  } else if (containsKeyword(noteKeywords, cleanedMsg)) {
    actionType = 'create_note';
    targetModel = 'Note';
  }
  
  // Jika tidak ditemukan dari kata kunci, coba analisis dari respon AI
  if (!actionType && aiResponse) {
    const lowerResponse = aiResponse.toLowerCase();
    
    if (lowerResponse.includes('tugas') && (lowerResponse.includes('akan membuat') || lowerResponse.includes('saya akan') || lowerResponse.includes('akan saya'))) {
      actionType = 'create_task';
      targetModel = 'Task';
    } else if (lowerResponse.includes('jadwal') || lowerResponse.includes('event')) {
      actionType = 'create_schedule';
      targetModel = 'Schedule';
    } else if (lowerResponse.includes('kebiasaan') || lowerResponse.includes('habit')) {
      actionType = 'create_habit'; 
      targetModel = 'Habit';
    } else if (lowerResponse.includes('catatan') || lowerResponse.includes('note')) {
      actionType = 'create_note';
      targetModel = 'Note';
    }
  }
  
  if (!actionType) {
    return null; // No action detected
  }
  
  // Extract parameters based on action type
  let parameters = {};
  
  if (actionType === 'create_task') {
    parameters = extractTaskParameters(message, aiResponse);
  } else if (actionType === 'create_schedule') {
    parameters = extractScheduleParameters(message, aiResponse);
  } else if (actionType === 'create_habit') {
    parameters = extractHabitParameters(message, aiResponse);
  } else if (actionType === 'create_note') {
    parameters = extractNoteParameters(message, aiResponse);
  }
  
  return {
    actionType,
    targetModel,
    parameters,
    userPrompt: message,
    aiResponse
  };
};

/**
 * Create AI action record
 * @param {Object} action - Action object
 * @param {String} userId - User ID
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<Object>} - Created action record
 */
exports.createActionRequest = async (action, userId, conversationId) => {
  try {
    const actionRecord = await AIAction.create({
      userId,
      conversationId,
      actionType: action.actionType,
      targetModel: action.targetModel,
      parameters: action.parameters,
      status: 'requested',
      userPrompt: action.userPrompt,
      aiResponse: action.aiResponse
    });
    
    logger.info(`AI action requested: ${actionRecord._id} by user: ${userId}`);
    return actionRecord;
  } catch (error) {
    logger.error(`Error creating AI action: ${error.message}`);
    throw error;
  }
};

/**
 * Execute AI action
 * @param {String} actionId - Action ID
 * @param {Boolean} approved - Whether action is approved by user
 * @returns {Promise<Object>} - Result of action execution
 */
exports.executeAction = async (actionId, approved = false) => {
  try {
    const action = await AIAction.findById(actionId);
    
    if (!action) {
      throw new Error('Action not found');
    }
    
    if (!approved) {
      action.status = 'rejected';
      await action.save();
      return { success: false, message: 'Action rejected by user' };
    }
    
    let result;
    
    switch (action.actionType) {
      case 'create_task':
        result = await executeCreateTask(action);
        break;
      case 'create_schedule':
        result = await executeCreateSchedule(action);
        break;
      case 'create_habit':
        result = await executeCreateHabit(action);
        break;
      case 'create_note':
        result = await executeCreateNote(action);
        break;
      default:
        result = { success: false, message: 'Unsupported action type' };
    }
    
    // Update action with result
    action.status = result.success ? 'completed' : 'failed';
    action.result = result;
    if (result.success && result.data && result.data._id) {
      action.targetId = result.data._id;
    }
    
    await action.save();
    
    logger.info(`AI action executed: ${actionId}, success: ${result.success}`);
    return result;
  } catch (error) {
    logger.error(`Error executing AI action: ${error.message}`);
    
    // Update action status to failed
    const action = await AIAction.findById(actionId);
    if (action) {
      action.status = 'failed';
      action.result = { success: false, message: error.message };
      await action.save();
    }
    
    throw error;
  }
};

/**
 * Get pending action requests for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Pending action requests
 */
exports.getPendingActions = async (userId) => {
  try {
    const actions = await AIAction.find({
      userId,
      status: 'requested'
    }).sort({ createdAt: -1 }).limit(10);
    
    return actions;
  } catch (error) {
    logger.error(`Error getting pending actions: ${error.message}`);
    throw error;
  }
};

/**
 * Get action history for a conversation
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<Array>} - Action history
 */
exports.getConversationActions = async (conversationId) => {
  try {
    const actions = await AIAction.find({
      conversationId
    }).sort({ createdAt: -1 });
    
    return actions;
  } catch (error) {
    logger.error(`Error getting conversation actions: ${error.message}`);
    throw error;
  }
};

// Helper functions for parameter extraction

/**
 * Extract task parameters from message
 * @param {String} message - User message
 * @param {String} aiResponse - AI response
 * @returns {Object} - Task parameters
 */
function extractTaskParameters(message, aiResponse) {
  const params = {
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    category: ''
  };
  
  // Gunakan informasi dari kedua sumber
  const sources = [message];
  if (aiResponse) sources.push(aiResponse);
  
  // Analisis semua sumber yang tersedia
  for (const source of sources) {
    const lowSource = source.toLowerCase();
    
    // Extract title dan description jika belum terisi
    if (!params.title) {
      let foundTitle = extractTitleFromText(source);
      if (foundTitle) {
        params.title = formatTitle(foundTitle);
      }
    }
    
    // Extract kategori jika belum terisi
    if (!params.category) {
      let foundCategory = extractCategoryFromText(source);
      if (foundCategory) {
        params.category = foundCategory;
      }
    }
    
    // Extract due date jika belum terisi
    if (!params.dueDate) {
      const dateTimeInfo = extractDateTime(source);
      if (dateTimeInfo.dueDate) {
        params.dueDate = dateTimeInfo.dueDate;
      }
    }
    
    // Extract prioritas jika masih default
    if (params.priority === 'medium') {
      const foundPriority = extractPriority(source);
      if (foundPriority !== 'medium') {
        params.priority = foundPriority;
      }
    }
    
    // Extract deskripsi jika masih kosong
    if (!params.description && source !== aiResponse) {
      const foundDescription = extractDescriptionFromText(source);
      if (foundDescription) {
        params.description = foundDescription;
      }
    }
  }
  
  // Ekstrak khusus dari respons AI karena biasanya lebih terstruktur
  if (aiResponse) {
    // Cari pola umum di respons AI
    // Pola 1: "Saya akan membuat tugas 'Judul' dengan deadline..."
    const titleMatch = aiResponse.match(/(?:akan|telah) (?:membuat|menambahkan|mencatat) tugas ['"]([^'"]+)['"]/i);
    if (titleMatch && titleMatch[1] && !params.title) {
      params.title = formatTitle(titleMatch[1]);
    }
    
    // Pola 2: "Tugas 'Judul' telah dibuat"
    const titleMatch2 = aiResponse.match(/[tT]ugas ['"]([^'"]+)['"] (?:telah|berhasil|sudah) dibuat/i);
    if (titleMatch2 && titleMatch2[1] && !params.title) {
      params.title = formatTitle(titleMatch2[1]);
    }
    
    // Pola 3: "...dengan deadline tanggal X..."
    const deadlineMatch = aiResponse.match(/dengan deadline (?:tanggal|pada) ([^.!,]+)/i);
    if (deadlineMatch && deadlineMatch[1] && !params.dueDate) {
      const dateTimeInfo = extractDateTime(deadlineMatch[1]);
      if (dateTimeInfo.dueDate) {
        params.dueDate = dateTimeInfo.dueDate;
      }
    }
    
    // Pola 4: "...untuk mata kuliah/kategori X..."
    const categoryMatch = aiResponse.match(/(?:untuk|pada|dalam) (?:mata kuliah|mk|kategori|pelajaran) ([^.!,]+)/i);
    if (categoryMatch && categoryMatch[1] && !params.category) {
      params.category = categoryMatch[1].trim();
    }
    
    // Pola 5: "...dengan prioritas X..."
    if (params.priority === 'medium') {
      if (/dengan prioritas tinggi|prioritas: tinggi/i.test(aiResponse)) {
        params.priority = 'high';
      } else if (/dengan prioritas rendah|prioritas: rendah/i.test(aiResponse)) {
        params.priority = 'low';
      }
    }
  }
  
  // Jika masih belum ada judul, gunakan pesan utama atau bagian dari respon AI
  if (!params.title && message) {
    // Hapus frasa umum seperti "tolong buatkan tugas" dan ambil 6 kata pertama
    const cleanedMessage = message.replace(/(?:tolong|bisa|bisakah)\s+(?:buatkan|buat|tambahkan|catat)\s+(?:tugas|task|pr|assignment)/i, '').trim();
    const shortTitle = cleanedMessage.split(/\s+/).slice(0, 6).join(' ');
    if (shortTitle) {
      params.title = formatTitle(shortTitle);
    }
  }
  
  return params;
}

/**
 * Extract title dari teks
 * @param {String} text - Teks untuk diekstrak
 * @returns {String|null} - Judul yang diekstrak atau null
 */
function extractTitleFromText(text) {
  const lowText = text.toLowerCase();
  
  // Expanded list of title indicators for more flexibility
  const titleIndicators = [
    'buat tugas ', 'tambahkan tugas ', 'jadwalkan tugas ',
    'ingatkan saya ', 'bikin task ', 'catat tugas ',
    'ada tugas ', 'aku ada tugas ', 'aku punya tugas ',
    'buat task ', 'tambah task ', 'bikin pr ',
    'aku ada pr ', 'ada deadline ', 'aku ada deadline ',
    'tugas ', 'deadline ', 'pr ', 'assignment '
  ];
  
  // Cari indikator dan ekstrak judul
  for (const indicator of titleIndicators) {
    const pos = lowText.indexOf(indicator);
    if (pos !== -1) {
      const afterIndicator = text.substring(pos + indicator.length).trim();
      
      // Bersihkan judul dari frasa khusus
      const cleanedTitle = afterIndicator
        .split(/(?:dengan\s+deadline|pada\s+tanggal|sebelum\s+tanggal|kategori|pelajaran|mata\s+kuliah|mk)/i)[0]
        .trim();
        
      return cleanedTitle || null;
    }
  }
  
  // Mencari pola judul dalam quotes atau sama dengan
  const quotesMatch = text.match(/['""]([^'""]+)['""]|=\s*([^,.!?;]+)/);
  if (quotesMatch) {
    return (quotesMatch[1] || quotesMatch[2]).trim();
  }
  
  return null;
}

/**
 * Extract kategori dari teks
 * @param {String} text - Teks untuk diekstrak
 * @returns {String|null} - Kategori yang diekstrak atau null
 */
function extractCategoryFromText(text) {
  // Cari pola kategori
  const categoryPatterns = [
    /(?:mata ?kuliah|mk|course|subject|kategori|pelajaran)\s+(?:adalah|yaitu|:)?\s*['"]?([a-zA-Z][^,.!?'"]+)['"]?/i,
    /untuk\s+(?:mata ?kuliah|mk|course|subject|kategori|pelajaran)\s+['"]?([a-zA-Z][^,.!?'"]+)['"]?/i,
    /di\s+(?:mata ?kuliah|mk|course|subject|kategori|pelajaran)\s+['"]?([a-zA-Z][^,.!?'"]+)['"]?/i
  ];
  
  for (const pattern of categoryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Extract deskripsi dari teks
 * @param {String} text - Teks untuk diekstrak
 * @returns {String|null} - Deskripsi yang diekstrak atau null
 */
function extractDescriptionFromText(text) {
  // Cari pola deskripsi
  const descPatterns = [
    /deskripsi(?:nya)?\s*(?:adalah|yaitu|:)?\s+(.+)/i,
    /detail(?:nya)?\s*(?:adalah|yaitu|:)?\s+(.+)/i,
    /keterangan(?:nya)?\s*(?:adalah|yaitu|:)?\s+(.+)/i
  ];
  
  for (const pattern of descPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Jika tidak ada pola spesifik, dan pesan cukup panjang,
  // ambil bagian pesan yang tidak digunakan untuk judul atau deadline
  if (text.length > 50) {
    // Bersihkan dari frasa pembuka
    const cleanedText = text.replace(/^(?:tolong|mohon|bisa|bisakah)\s+(?:buatkan|buat|tambahkan|catat)\s+(?:sebuah|satu)?\s*(?:tugas|task|pr|assignment)(?:\s+baru|baru)?/i, '').trim();
    
    // Hapus bagian yang mengandung deadline, kategori, dll
    const parts = cleanedText.split(/(?:dengan\s+deadline|pada\s+tanggal|sebelum\s+tanggal|untuk\s+kategori|untuk\s+pelajaran|untuk\s+mata\s+kuliah|kategori|pelajaran|mata\s+kuliah|mk)/i);
    
    if (parts.length >= 2) {
      return parts[0].trim();
    }
  }
  
  return null;
}

/**
 * Extract date and time information from message
 * @param {String} message - Message to extract from
 * @returns {Object} - Date time information
 */
function extractDateTime(message) {
  const result = {
    dueDate: null
  };
  
  const now = new Date();
  const tomorrow = addDays(now, 1);
  
  // Check for time mentions
  let dueTime = null;
  const timeMatch = message.match(/jam\s+(\d{1,2})(?:[:.](\d{2}))?/i) || 
                   message.match(/pukul\s+(\d{1,2})(?:[:.](\d{2}))?/i);
  
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    dueTime = { hour, minute };
  }
  
  // Check for date patterns
  const datePatterns = [
    { 
      regex: /hari ini/i, 
      fn: () => {
        const date = new Date(now);
        if (dueTime) {
          date.setHours(dueTime.hour, dueTime.minute, 0, 0);
        }
        return date;
      }
    },
    { 
      regex: /besok/i, 
      fn: () => {
        const date = addDays(now, 1);
        if (dueTime) {
          date.setHours(dueTime.hour, dueTime.minute, 0, 0);
        }
        return date;
      }
    },
    { 
      regex: /lusa/i, 
      fn: () => {
        const date = addDays(now, 2);
        if (dueTime) {
          date.setHours(dueTime.hour, dueTime.minute, 0, 0);
        }
        return date;
      }
    },
    { 
      regex: /(\d{1,2})\s+(?:jam|hour)/i, 
      fn: (match) => {
        const hours = parseInt(match[1]);
        return addHours(now, hours);
      }
    },
    { 
      regex: /minggu depan/i, 
      fn: () => addDays(now, 7)
    },
    { 
      regex: /bulan depan/i, 
      fn: () => addDays(now, 30)
    }
  ];
  
  for (const pattern of datePatterns) {
    const match = message.match(pattern.regex);
    if (match) {
      result.dueDate = pattern.fn(match);
      break;
    }
  }
  
  // If we found time but no specific date pattern, default to tomorrow if it mentions deadline
  if (dueTime && !result.dueDate && /deadline/i.test(message)) {
    result.dueDate = new Date(tomorrow);
    result.dueDate.setHours(dueTime.hour, dueTime.minute, 0, 0);
  }
  
  return result;
}

/**
 * Extract priority from message
 * @param {String} message - Message to extract from
 * @returns {String} - Priority level
 */
function extractPriority(message) {
  if (/penting|urgent|segera|high|tinggi|krusial|critical/i.test(message)) {
    return 'high';
  } else if (/sedang|medium|normal/i.test(message)) {
    return 'medium';
  } else if (/rendah|low|tidak penting|santai/i.test(message)) {
    return 'low';
  }
  return 'medium';
}

/**
 * Format title for better readability
 * @param {String} title - Raw title
 * @returns {String} - Formatted title
 */
function formatTitle(title) {
  // Capitalize first letter
  title = capitalizeFirstLetter(title);
  
  // Trim to reasonable length
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  
  return title;
}

/**
 * Format description for better readability
 * @param {String} description - Raw description
 * @param {Object} components - Task components
 * @returns {String} - Formatted description
 */
function formatDescription(description, components) {
  // Description sudah diformat di extractTaskComponents
  // Tidak perlu menambahkan informasi yang sama lagi
  return description;
}

/**
 * Capitalize first letter of a string
 * @param {String} str - Input string
 * @returns {String} - String with first letter capitalized
 */
function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract schedule parameters from message
 * @param {String} message - User message
 * @param {String} aiResponse - AI response
 * @returns {Object} - Schedule parameters
 */
function extractScheduleParameters(message, aiResponse) {
  const params = {
    title: '',
    description: '',
    startTime: null,
    endTime: null,
    type: 'event',
    location: ''
  };
  
  // Gunakan informasi dari kedua sumber
  const sources = [message];
  if (aiResponse) sources.push(aiResponse);
  
  // Analisis kedua sumber untuk ekstraksi informasi
  for (const source of sources) {
    // Cari judul acara jika belum ada
    if (!params.title) {
      const titlePatterns = [
        // Judul dalam tanda kutip
        /'([^']+)'/,
        /"([^"]+)"/,
        // Pola: jadwalkan meeting/rapat/acara X
        /(?:jadwalkan|buat|tambahkan|schedule)\s+(?:meeting|rapat|acara|event|jadwal)\s+([A-Za-z0-9][^,.!?]*)/i,
        // Pola: X pada tanggal
        /([A-Za-z0-9][^,.!?]*?)\s+(?:pada|di|tanggal)/i
      ];
      
      for (const pattern of titlePatterns) {
        const match = source.match(pattern);
        if (match && match[1]) {
          params.title = match[1].trim();
          break;
        }
      }
      
      // Jika masih tidak ada judul dan ini adalah respons AI
      if (!params.title && source === aiResponse) {
        // Pola: Saya akan menjadwalkan "X"
        const aiTitleMatch = source.match(/(?:saya akan|baik|akan saya)\s+(?:jadwalkan|buat|tambahkan)\s+(?:jadwal|acara|event|meeting|rapat)?\s*["']([^"']+)["']/i);
        if (aiTitleMatch && aiTitleMatch[1]) {
          params.title = aiTitleMatch[1].trim();
        }
      }
    }
    
    // Cari lokasi jika belum ada
    if (!params.location) {
      const locationPatterns = [
        /(?:di|lokasi|tempat|bertempat di|venue)\s*(?::|adalah|yaitu)?\s*["']?([A-Za-z0-9][^,.!?"']+)["']?/i,
        /berlokasi di\s+["']?([A-Za-z0-9][^,.!?"']+)["']?/i
      ];
      
      for (const pattern of locationPatterns) {
        const match = source.match(pattern);
        if (match && match[1]) {
          params.location = match[1].trim();
          break;
        }
      }
    }
    
    // Cari informasi tipe acara jika belum ditentukan
    if (params.type === 'event') {
      if (/meeting|rapat|pertemuan/i.test(source)) {
        params.type = 'meeting';
      } else if (/deadline|tenggat waktu/i.test(source)) {
        params.type = 'deadline';
      } else if (/kuliah|kelas|class|lecture/i.test(source)) {
        params.type = 'class';
      } else if (/exam|ujian|tes|test|quiz|kuis/i.test(source)) {
        params.type = 'exam';
      } else if (/tugas|task|assignment|project/i.test(source)) {
        params.type = 'task';
      }
    }
    
    // Cari waktu mulai dan selesai jika belum ada
    if (!params.startTime || !params.endTime) {
      const dateTimeInfo = extractDateTime(source);
      
      // Set waktu mulai jika ditemukan
      if (dateTimeInfo.date && dateTimeInfo.time && !params.startTime) {
        params.startTime = dateTimeInfo.date;
        params.startTime.setHours(dateTimeInfo.time.getHours());
        params.startTime.setMinutes(dateTimeInfo.time.getMinutes());
        
        // Jika hanya waktu mulai yang ditemukan, tambahkan 1 jam untuk waktu selesai (default)
        if (!params.endTime) {
          params.endTime = new Date(params.startTime.getTime() + 60 * 60 * 1000); // + 1 jam
        }
      } 
      // Jika hanya tanggal yang ditemukan
      else if (dateTimeInfo.date && !params.startTime) {
        params.startTime = dateTimeInfo.date;
        params.startTime.setHours(9, 0, 0); // Default 09:00
        params.endTime = new Date(params.startTime.getTime() + 60 * 60 * 1000); // + 1 jam
      }
      
      // Cari durasi untuk mengatur waktu selesai
      if (params.startTime && !params.endTime) {
        const durationMatch = source.match(/(?:selama|durasi)\s+(\d+)\s*(?:jam|hour|hours|h|hr|hrs)/i);
        if (durationMatch && durationMatch[1]) {
          const durationHours = parseInt(durationMatch[1], 10);
          if (!isNaN(durationHours) && durationHours > 0) {
            params.endTime = new Date(params.startTime.getTime() + durationHours * 60 * 60 * 1000);
          }
        }
        
        // Cari durasi dalam menit
        const minutesMatch = source.match(/(?:selama|durasi)\s+(\d+)\s*(?:menit|minute|minutes|min|mins)/i);
        if (minutesMatch && minutesMatch[1]) {
          const durationMinutes = parseInt(minutesMatch[1], 10);
          if (!isNaN(durationMinutes) && durationMinutes > 0) {
            // Jika sudah ada waktu selesai dari durasi jam, tambahkan menit
            if (params.endTime) {
              params.endTime = new Date(params.endTime.getTime() + durationMinutes * 60 * 1000);
            } else {
              params.endTime = new Date(params.startTime.getTime() + durationMinutes * 60 * 1000);
            }
          }
        }
      }
      
      // Jika ada waktu selesai yang spesifik
      if (dateTimeInfo.endTime && params.startTime) {
        params.endTime = new Date(params.startTime);
        params.endTime.setHours(dateTimeInfo.endTime.getHours());
        params.endTime.setMinutes(dateTimeInfo.endTime.getMinutes());
        
        // Pastikan waktu selesai setelah waktu mulai
        if (params.endTime <= params.startTime) {
          params.endTime = new Date(params.startTime.getTime() + 60 * 60 * 1000); // + 1 jam
        }
      }
    }
  }
  
  // Jika masih tidak ada judul, buat judul default berdasarkan tipe acara
  if (!params.title) {
    switch (params.type) {
      case 'meeting': 
        params.title = 'Rapat';
        break;
      case 'deadline':
        params.title = 'Tenggat Waktu';
        break;
      case 'class':
        params.title = 'Kelas';
        break;
      case 'exam':
        params.title = 'Ujian';
        break;
      case 'task':
        params.title = 'Tugas';
        break;
      default:
        params.title = 'Acara Baru';
    }
  }
  
  // Tambahkan deskripsi default jika tidak ada
  if (!params.description) {
    if (message.length > 30) {
      params.description = message;
    } else {
      params.description = `${params.type.charAt(0).toUpperCase() + params.type.slice(1)}: ${params.title}`;
    }
  }
  
  return params;
}

/**
 * Extract habit parameters from message
 * @param {String} message - User message
 * @param {String} aiResponse - AI response
 * @returns {Object} - Habit parameters
 */
function extractHabitParameters(message, aiResponse) {
  const params = {
    name: '',
    description: '',
    frequency: 'daily',
    icon: '📌',
    color: '#10b981'
  };
  
  // Gunakan informasi dari kedua sumber
  const sources = [message];
  if (aiResponse) sources.push(aiResponse);
  
  // Extract title
  let nameExtracted = false;
  
  for (const source of sources) {
    const lowSrc = source.toLowerCase();
    let titleStart = -1;
    
    // Pola untuk mendeteksi nama kebiasaan
    const titleIndicators = [
      'buat kebiasaan ', 'tambahkan kebiasaan ', 'catat kebiasaan ', 'track kebiasaan ',
      'biasakan ', 'habit ', 'kebiasaan ', 'rutin ', 'rutinitas '
    ];
    
    for (const indicator of titleIndicators) {
      const pos = lowSrc.indexOf(indicator);
      if (pos !== -1) {
        titleStart = pos + indicator.length;
        break;
      }
    }
    
    if (titleStart >= 0) {
      // Look for a period, question mark, or end of string
      let titleEnd = source.length;
      const possibleEnds = ['.', '?', '\n', ','];
      
      for (const end of possibleEnds) {
        const pos = source.indexOf(end, titleStart);
        if (pos !== -1 && pos < titleEnd) {
          titleEnd = pos;
        }
      }
      
      const extractedName = source.substring(titleStart, titleEnd).trim();
      if (extractedName && !nameExtracted) {
        params.name = extractedName;
        nameExtracted = true;
      }
    }
    
    // Coba ekstrak dari respons AI jika ini adalah respons AI
    if (source === aiResponse && !nameExtracted) {
      const aiNameMatch = source.match(/(?:saya akan|baik|akan saya)\s+(?:buat|tambahkan|catat)\s+(?:kebiasaan|habit)?\s*["']([^"']+)["']/i);
      if (aiNameMatch && aiNameMatch[1]) {
        params.name = aiNameMatch[1].trim();
        nameExtracted = true;
      }
    }
    
    // Extract description
    if (!params.description) {
      // Cari deskripsi setelah kata "untuk" atau "agar" atau "supaya"
      const descPatterns = [
        /(?:untuk|agar|supaya)\s+([^.?!]+)[.?!]/i,
        /(?:dengan tujuan)\s+([^.?!]+)[.?!]/i
      ];
      
      for (const pattern of descPatterns) {
        const match = source.match(pattern);
        if (match && match[1]) {
          params.description = match[1].trim();
          break;
        }
      }
    }
    
    // Extract frequency
    if (/setiap hari|daily|harian|tiap hari/i.test(source)) {
      params.frequency = 'daily';
    } else if (/setiap minggu|weekly|mingguan|tiap minggu/i.test(source)) {
      params.frequency = 'weekly';
    } else if (/setiap bulan|monthly|bulanan|tiap bulan/i.test(source)) {
      params.frequency = 'monthly';
    } else if (/setiap 2 hari|setiap dua hari|every 2 days|every other day/i.test(source)) {
      params.frequency = 'every_other_day';
    } else if (/setiap weekday|weekdays|hari kerja/i.test(source)) {
      params.frequency = 'weekdays';
    } else if (/weekend|akhir pekan|sabtu minggu/i.test(source)) {
      params.frequency = 'weekends';
    }
    
    // Extract icon berdasarkan konteks
    if (/olahraga|fitness|gym|latihan|workout|exercise/i.test(source)) {
      params.icon = '🏋️';
      params.color = '#ef4444'; // Merah
    } else if (/baca|membaca|reading|buku|book/i.test(source)) {
      params.icon = '📚';
      params.color = '#f59e0b'; // Oranye
    } else if (/air|minum|hydrate|hydration/i.test(source)) {
      params.icon = '💧';
      params.color = '#3b82f6'; // Biru
    } else if (/tidur|sleep|istirahat|rest/i.test(source)) {
      params.icon = '😴';
      params.color = '#8b5cf6'; // Ungu
    } else if (/makan|makanan|nutrisi|nutrition|food|eat/i.test(source)) {
      params.icon = '🍎';
      params.color = '#ef4444'; // Merah
    } else if (/medita|meditasi|mindfulness/i.test(source)) {
      params.icon = '🧘';
      params.color = '#8b5cf6'; // Ungu
    } else if (/belajar|study|pelajaran|learn/i.test(source)) {
      params.icon = '📝';
      params.color = '#f59e0b'; // Oranye
    } else if (/jalan|walk|walking|jogging/i.test(source)) {
      params.icon = '🚶';
      params.color = '#10b981'; // Hijau
    }
  }
  
  // Jika tidak ada nama yang diekstrak, gunakan default
  if (!params.name) {
    params.name = "Kebiasaan Baru";
  }
  
  // Jika tidak ada deskripsi, buat deskripsi sederhana
  if (!params.description) {
    params.description = `Kebiasaan ${params.frequency === 'daily' ? 'harian' : 
      params.frequency === 'weekly' ? 'mingguan' : 'bulanan'}: ${params.name}`;
  }
  
  return params;
}

/**
 * Extract note parameters from message
 * @param {String} message - User message
 * @param {String} aiResponse - AI response
 * @returns {Object} - Note parameters
 */
function extractNoteParameters(message, aiResponse) {
  const params = {
    title: '',
    content: ''
  };
  
  // Extract title
  const lowMsg = message.toLowerCase();
  let titleStart = -1;
  
  const titleIndicators = [
    'buat catatan ', 'catat ', 'tulis catatan '
  ];
  
  for (const indicator of titleIndicators) {
    const pos = lowMsg.indexOf(indicator);
    if (pos !== -1) {
      titleStart = pos + indicator.length;
      break;
    }
  }
  
  if (titleStart >= 0) {
    // Use first line as title, rest as content
    const text = message.substring(titleStart).trim();
    const lines = text.split('\n');
    
    if (lines.length > 0) {
      params.title = lines[0].split('.')[0].trim(); // First line up to first period
      if (lines.length > 1) {
        params.content = lines.slice(1).join('\n').trim();
      } else {
        // If only one line, use as both title and content
        params.content = text;
      }
    }
  }
  
  return params;
}

// Helper functions for action execution

/**
 * Execute create task action
 * @param {Object} action - Action object
 * @returns {Promise<Object>} - Execution result
 */
async function executeCreateTask(action) {
  try {
    const { title, description, dueDate, priority, category } = action.parameters;
    
    // Jika ada kategori, gunakan sebagai label
    const labels = category ? [category] : [];
    
    const task = await Task.create({
      userId: action.userId,
      title,
      description,
      dueDate,
      priority,
      labels
    });
    
    return {
      success: true,
      message: 'Task created successfully',
      data: task
    };
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`);
    return {
      success: false,
      message: `Failed to create task: ${error.message}`
    };
  }
}

/**
 * Execute create schedule action
 * @param {Object} action - Action object
 * @returns {Promise<Object>} - Execution result
 */
async function executeCreateSchedule(action) {
  try {
    const { title, description, startTime, endTime, type, location, isAllDay, color } = action.parameters;
    
    // Validasi parameter
    if (!title) {
      throw new Error('Judul jadwal tidak boleh kosong');
    }
    
    if (!startTime) {
      throw new Error('Waktu mulai tidak boleh kosong');
    }
    
    // Jika tidak ada waktu selesai, default 1 jam setelah waktu mulai
    let endTimeValue = endTime;
    if (!endTimeValue && startTime) {
      const startDate = new Date(startTime);
      endTimeValue = new Date(startDate.getTime() + 60 * 60 * 1000); // + 1 jam
    }
    
    // Tentukan warna berdasarkan tipe event
    let eventColor = color || '#3B82F6'; // Default blue color
    
    if (!color) {
      switch (type) {
        case 'meeting':
          eventColor = '#EF4444'; // Merah untuk meeting
          break;
        case 'task':
          eventColor = '#F59E0B'; // Oranye untuk task
          break;
        case 'focus-time':
          eventColor = '#8B5CF6'; // Ungu untuk focus time
          break;
        case 'break':
          eventColor = '#10B981'; // Hijau untuk break
          break;
        case 'routine':
          eventColor = '#6366F1'; // Indigo untuk routine
          break;
      }
    }
    
    const schedule = await Schedule.create({
      userId: action.userId,
      title,
      description: description || '',
      startTime,
      endTime: endTimeValue,
      isAllDay: isAllDay || false,
      type: type || 'event',
      location: location || '',
      priority: 'medium',
      status: 'scheduled',
      color: eventColor
    });
    
    return {
      success: true,
      message: 'Schedule created successfully',
      data: schedule
    };
  } catch (error) {
    logger.error(`Error creating schedule: ${error.message}`);
    return {
      success: false,
      message: `Failed to create schedule: ${error.message}`
    };
  }
}

/**
 * Execute create habit action
 * @param {Object} action - Action object
 * @returns {Promise<Object>} - Execution result
 */
async function executeCreateHabit(action) {
  try {
    const { name, description, frequency, icon, color } = action.parameters;
    
    // Validasi parameter
    if (!name) {
      throw new Error('Nama kebiasaan tidak boleh kosong');
    }
    
    const habit = await Habit.create({
      userId: action.userId,
      name,
      description: description || `Kebiasaan ${frequency === 'daily' ? 'harian' : frequency === 'weekly' ? 'mingguan' : 'bulanan'}: ${name}`,
      frequency: frequency || 'daily',
      icon: icon || '📌', // Gunakan icon dari parameter atau default
      color: color || '#10b981', // Gunakan color dari parameter atau default
      streak: 0,
      longestStreak: 0
    });
    
    return {
      success: true,
      message: 'Habit created successfully',
      data: habit
    };
  } catch (error) {
    logger.error(`Error creating habit: ${error.message}`);
    return {
      success: false,
      message: `Failed to create habit: ${error.message}`
    };
  }
}

/**
 * Execute create note action
 * @param {Object} action - Action object
 * @returns {Promise<Object>} - Execution result
 */
async function executeCreateNote(action) {
  try {
    const { title, content } = action.parameters;
    
    const note = await Note.create({
      userId: action.userId,
      title,
      content,
      color: '#F59E0B' // Default color
    });
    
    return {
      success: true,
      message: 'Note created successfully',
      data: note
    };
  } catch (error) {
    logger.error(`Error creating note: ${error.message}`);
    return {
      success: false,
      message: `Failed to create note: ${error.message}`
    };
  }
} 