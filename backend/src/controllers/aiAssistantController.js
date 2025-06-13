const Task = require('../models/Task');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Schedule = require('../models/Schedule');
const Note = require('../models/Note');
const Conversation = require('../models/Conversation');
const AIAction = require('../models/AIAction');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const geminiService = require('../services/geminiService');
const aiActionService = require('../services/aiActionService');
const userContextService = require('../services/userContextService');
const { startOfDay, endOfDay, subDays, addDays } = require('date-fns');

/**
 * @desc    Chat with AI assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
exports.chatWithAssistant = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;
  const userId = req.user.id;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Pesan tidak boleh kosong'
      }
    });
  }
  
  try {
    // Get user context data
    const userData = await getUserContextData(userId);
    
    // Get response from Gemini
    const response = await geminiService.getGeminiResponse(message, userData, userId, conversationId);
    
    // Save conversation to history
    let conversation;
    
    if (conversationId) {
      // Update existing conversation
      conversation = await Conversation.findOne({ 
        _id: conversationId,
        userId: userId
      });
    }
    
    if (!conversation) {
      // Create new conversation with the first message pair
      conversation = new Conversation({
        userId: userId,
        title: message.length > 30 ? `${message.substring(0, 30)}...` : message,
        messages: [
          {
            role: 'user',
            content: message,
            timestamp: new Date()
          },
          {
            role: 'assistant',
            content: response,
            timestamp: new Date()
          }
        ],
        lastMessageAt: new Date()
      });
    } else {
      // Add messages to existing conversation
      conversation.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });
      
      conversation.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });
      
      conversation.lastMessageAt = new Date();
      
      // Limit the number of messages stored if needed
      const maxMessages = parseInt(process.env.AI_CHAT_HISTORY_LIMIT, 10) * 2 || 20;
      if (conversation.messages.length > maxMessages) {
        conversation.messages = conversation.messages.slice(-maxMessages);
      }
    }
    
    await conversation.save();
    
    // Learn user behavior periodically (every 5 conversations)
    const conversationCount = await Conversation.countDocuments({ userId });
    if (conversationCount % 5 === 0) {
      // Run asynchronously to avoid delaying the response
      userContextService.learnUserBehavior(userId).catch(err => {
        logger.warn(`Failed to learn user behavior: ${err.message}`);
      });
    }
    
    // Check if the message contains an action intent
    const actionIntent = await aiActionService.extractActionIntent(message, response);
    let actionData = null;
    
    if (actionIntent) {
      // Tentukan apakah aksi ini bisa dieksekusi otomatis
      const isSimpleAction = 
        (actionIntent.actionType === 'create_habit' && actionIntent.parameters.name) || 
        (actionIntent.actionType === 'create_schedule' && 
         actionIntent.parameters.title && 
         actionIntent.parameters.startTime);
      
      // Create action request
      const action = await aiActionService.createActionRequest(
        actionIntent, 
        userId, 
        conversation._id
      );
      
      // Eksekusi otomatis untuk aksi sederhana
      if (isSimpleAction) {
        try {
          // Eksekusi aksi secara otomatis
          const result = await aiActionService.executeAction(action._id, true);
          
          // Update status aksi
          action.status = result.success ? 'completed' : 'failed';
          action.result = result;
          await action.save();
          
          // Tambahkan hasil ke respons
          actionData = {
            id: action._id,
            type: action.actionType,
            status: action.status,
            parameters: action.parameters,
            autoExecuted: true,
            result: result
          };
        } catch (error) {
          logger.error(`Error auto-executing action: ${error.message}`);
          
          // Jika gagal, kembalikan ke status requested
          actionData = {
            id: action._id,
            type: action.actionType,
            status: 'requested',
            parameters: action.parameters
          };
        }
      } else {
        // Add action data to response untuk aksi yang perlu konfirmasi
        actionData = {
          id: action._id,
          type: action.actionType,
          status: action.status,
          parameters: action.parameters
        };
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        message: response,
        conversationId: conversation._id,
        context: {
          tasksCount: userData.tasks.length,
          habitsCount: userData.habits.length,
          schedulesCount: userData.schedule.length
        },
        action: actionData
      }
    });
  } catch (error) {
    logger.error(`AI Assistant error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat memproses permintaan'
      }
    });
  }
});

/**
 * @desc    Get personalized insights
 * @route   GET /api/ai/insights
 * @access  Private
 */
exports.getPersonalInsights = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Get user context data
    const userData = await getUserContextData(userId);
    
    // Generate insights
    const insights = await geminiService.generatePersonalInsights(userData);
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    logger.error(`Personal insights error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat memproses permintaan'
      }
    });
  }
});

/**
 * @desc    Get schedule optimization
 * @route   POST /api/ai/optimize-schedule
 * @access  Private
 */
exports.optimizeSchedule = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { date } = req.body;
  
  // Default to today if no date provided
  const targetDate = date ? new Date(date) : new Date();
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);
  
  try {
    // Get current schedule
    const currentSchedule = await Schedule.find({
      userId: userId,
      $or: [
        {
          startTime: {
            $gte: dayStart,
            $lte: dayEnd
          }
        },
        {
          endTime: {
            $gte: dayStart,
            $lte: dayEnd
          }
        },
        {
          startTime: { $lte: dayStart },
          endTime: { $gte: dayEnd }
        }
      ]
    }).sort({ startTime: 1 });
    
    // Get pending tasks
    const pendingTasks = await Task.find({
      userId: userId,
      status: { $ne: 'completed' },
      $or: [
        { dueDate: { $lte: dayEnd } },
        { dueDate: null }
      ]
    }).sort({ priority: -1, dueDate: 1 });
    
    // Generate optimization
    const optimization = await geminiService.optimizeSchedule(
      currentSchedule,
      pendingTasks
    );
    
    res.status(200).json({
      success: true,
      date: dayStart,
      data: optimization
    });
  } catch (error) {
    logger.error(`Schedule optimization error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mengoptimalkan jadwal'
      }
    });
  }
});

/**
 * @desc    Get habit recommendations
 * @route   GET /api/ai/habit-recommendations
 * @access  Private
 */
exports.getHabitRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Get user context data
    const userData = await getUserContextData(userId);
    
    // Generate recommendations
    const recommendations = await geminiService.getHabitRecommendations(userData);
    
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error(`Habit recommendations error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mendapatkan rekomendasi'
      }
    });
  }
});

/**
 * @desc    Get conversation history for a user
 * @route   GET /api/ai/conversation-history
 * @access  Private
 */
exports.getConversationHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(process.env.AI_CHAT_HISTORY_LIMIT) || 10;
  
  try {
    // Get the most recent conversation
    const conversation = await Conversation.findOne({ userId })
      .sort({ lastMessageAt: -1 })
      .limit(1);
    
    if (!conversation) {
      return res.status(200).json({
        success: true,
        data: {
          history: []
        }
      });
    }
    
    // Return the conversation messages
    res.status(200).json({
      success: true,
      data: {
        id: conversation._id,
        title: conversation.title,
        history: conversation.messages
      }
    });
  } catch (error) {
    logger.error(`Error fetching conversation history: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mengambil riwayat percakapan'
      }
    });
  }
});

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/ai/conversations
 * @access  Private
 */
exports.getAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  try {
    // Get conversations with pagination
    const conversations = await Conversation.find({ userId })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title lastMessageAt');
      
    // Get total count
    const total = await Conversation.countDocuments({ userId });
    
    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching conversations: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mengambil percakapan'
      }
    });
  }
});

/**
 * @desc    Get a specific conversation
 * @route   GET /api/ai/conversations/:id
 * @access  Private
 */
exports.getConversationById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id;
  
  try {
    // Get conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Percakapan tidak ditemukan'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    logger.error(`Error fetching conversation: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mengambil percakapan'
      }
    });
  }
});

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/ai/conversations/:id
 * @access  Private
 */
exports.deleteConversation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id;
  
  try {
    // Find conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Percakapan tidak ditemukan'
        }
      });
    }
    
    // Delete conversation
    await conversation.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting conversation: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat menghapus percakapan'
      }
    });
  }
});

/**
 * @desc    Get pending AI actions for a user
 * @route   GET /api/ai/pending-actions
 * @access  Private
 */
exports.getPendingActions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    const actions = await aiActionService.getPendingActions(userId);
    
    res.status(200).json({
      success: true,
      data: actions
    });
  } catch (error) {
    logger.error(`Error fetching pending actions: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mengambil aksi tertunda'
      }
    });
  }
});

/**
 * @desc    Execute or reject an AI action
 * @route   POST /api/ai/actions/:id/execute
 * @access  Private
 */
exports.executeAction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const actionId = req.params.id;
  const { approved } = req.body;
  
  try {
    // Check if action exists and belongs to the user
    const action = await AIAction.findOne({
      _id: actionId,
      userId
    });
    
    if (!action) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Aksi tidak ditemukan'
        }
      });
    }
    
    // Execute or reject the action
    const result = await aiActionService.executeAction(actionId, approved);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error executing action: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat melaksanakan aksi'
      }
    });
  }
});

/**
 * @desc    Get action history for a conversation
 * @route   GET /api/ai/conversations/:id/actions
 * @access  Private
 */
exports.getConversationActions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id;
  
  try {
    // Check if conversation exists and belongs to the user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Percakapan tidak ditemukan'
        }
      });
    }
    
    // Get actions for the conversation
    const actions = await aiActionService.getConversationActions(conversationId);
    
    res.status(200).json({
      success: true,
      data: actions
    });
  } catch (error) {
    logger.error(`Error fetching conversation actions: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Terjadi kesalahan saat mengambil riwayat aksi'
      }
    });
  }
});

/**
 * @desc    Get or update user AI preferences
 * @route   GET /api/ai/preferences
 * @route   PUT /api/ai/preferences
 * @access  Private
 */
exports.userAIPreferences = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  if (req.method === 'GET') {
    try {
      // Get user preferences
      const preferences = await userContextService.getUserPreferences(userId);
      
      res.status(200).json({
        success: true,
        data: preferences
      });
    } catch (error) {
      logger.error(`Error getting AI preferences: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Gagal mendapatkan preferensi AI'
        }
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { language, responseStyle, notifications } = req.body;
      
      // Update preferences
      const preferences = {};
      if (language) preferences.language = language;
      if (responseStyle) preferences.responseStyle = responseStyle;
      if (notifications !== undefined) preferences.notifications = notifications;
      
      const updatedContext = await userContextService.updateUserPreferences(userId, preferences);
      
      res.status(200).json({
        success: true,
        data: updatedContext.preferences
      });
    } catch (error) {
      logger.error(`Error updating AI preferences: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Gagal memperbarui preferensi AI'
        }
      });
    }
  }
});

/**
 * @desc    Update user profile information
 * @route   PUT /api/ai/profile
 * @access  Private
 */
exports.updateAIProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;
  
  try {
    const updatedContext = await userContextService.updateUserProfile(userId, name);
    
    res.status(200).json({
      success: true,
      data: updatedContext.profile
    });
  } catch (error) {
    logger.error(`Error updating AI profile: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Gagal memperbarui profil AI'
      }
    });
  }
});

/**
 * Helper: Get user context data for AI
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - User data
 */
const getUserContextData = async (userId) => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  // Get recent and upcoming tasks
  const tasks = await Task.find({ userId })
    .sort({ dueDate: 1 })
    .limit(20);
  
  // Get active habits
  const habits = await Habit.find({
    userId,
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: today } }
    ]
  });
  
  // Get today's schedule
  const schedule = await Schedule.find({
    userId,
    $or: [
      {
        startTime: {
          $gte: todayStart,
          $lte: todayEnd
        }
      },
      {
        endTime: {
          $gte: todayStart,
          $lte: todayEnd
        }
      },
      {
        startTime: { $lte: todayStart },
        endTime: { $gte: todayEnd }
      }
    ]
  }).sort({ startTime: 1 });
  
  // Get recent habit logs (last 7 days)
  const recentLogs = await HabitLog.find({
    userId,
    date: {
      $gte: subDays(todayStart, 7),
      $lte: todayEnd
    }
  });
  
  // Calculate stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  // Calculate habit consistency from logs
  const habitsByDay = {};
  habits.forEach(habit => {
    // For each day in the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!habitsByDay[dateStr]) {
        habitsByDay[dateStr] = {
          total: 0,
          completed: 0
        };
      }
      
      habitsByDay[dateStr].total++;
    }
  });
  
  // Mark completed habits
  recentLogs.forEach(log => {
    if (!log.skipped) {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      if (habitsByDay[dateStr]) {
        habitsByDay[dateStr].completed++;
      }
    }
  });
  
  // Calculate overall consistency
  let totalHabitDays = 0;
  let completedHabitDays = 0;
  
  Object.values(habitsByDay).forEach(day => {
    totalHabitDays += day.total;
    completedHabitDays += day.completed;
  });
  
  const habitConsistency = totalHabitDays > 0 ? (completedHabitDays / totalHabitDays) * 100 : 0;
  
  // Calculate productivity score (simplified)
  const taskScore = Math.min(40, Math.round(taskCompletionRate * 0.4));
  const habitScore = Math.min(40, Math.round(habitConsistency * 0.4));
  const scheduleScore = schedule.length > 0 ? 20 : 0;
  
  const productivityScore = taskScore + habitScore + scheduleScore;
  
  // Return formatted user context
  return {
    tasks,
    habits,
    schedule,
    stats: {
      taskCompletionRate: Math.round(taskCompletionRate),
      habitConsistency: Math.round(habitConsistency),
      productivityScore
    }
  };
}; 