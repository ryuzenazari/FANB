const UserContext = require('../models/UserContext');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const Habit = require('../models/Habit');
const logger = require('../config/logger');

/**
 * Get or create user context
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - User context
 */
exports.getOrCreateUserContext = async (userId) => {
  try {
    let userContext = await UserContext.findOne({ userId });
    
    if (!userContext) {
      // Create new user context
      const user = await User.findById(userId);
      
      userContext = await UserContext.create({
        userId,
        profile: {
          name: user?.name || 'Pengguna',
        }
      });
      
      logger.info(`Created new user context for user: ${userId}`);
    }
    
    return userContext;
  } catch (error) {
    logger.error(`Error getting user context: ${error.message}`);
    throw error;
  }
};

/**
 * Update user context with conversation data
 * @param {String} userId - User ID
 * @param {String} userQuery - User query
 * @param {String} aiResponse - AI response
 * @returns {Promise<Object>} - Updated user context
 */
exports.updateContextFromConversation = async (userId, userQuery, aiResponse) => {
  try {
    const userContext = await this.getOrCreateUserContext(userId);
    
    // Extract possible topics from user query
    const topics = extractTopics(userQuery);
    
    // Update recent topics (keep only unique topics)
    if (topics.length > 0) {
      if (!userContext.conversationHistory.recentTopics) {
        userContext.conversationHistory.recentTopics = [];
      }
      
      // Add new topics to the front of the array
      userContext.conversationHistory.recentTopics.unshift(...topics);
      
      // Keep only unique topics and limit to 10
      userContext.conversationHistory.recentTopics = [...new Set(userContext.conversationHistory.recentTopics)]
        .slice(0, 10);
    }
    
    // Update last query and response
    userContext.conversationHistory.lastQuery = userQuery;
    userContext.conversationHistory.lastResponse = aiResponse;
    
    // Update last interaction time
    userContext.lastInteraction = new Date();
    
    await userContext.save();
    return userContext;
  } catch (error) {
    logger.error(`Error updating user context: ${error.message}`);
    throw error;
  }
};

/**
 * Get user preferences
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - User preferences
 */
exports.getUserPreferences = async (userId) => {
  try {
    const userContext = await this.getOrCreateUserContext(userId);
    return userContext.preferences;
  } catch (error) {
    logger.error(`Error getting user preferences: ${error.message}`);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {String} userId - User ID
 * @param {Object} preferences - Updated preferences
 * @returns {Promise<Object>} - Updated user context
 */
exports.updateUserPreferences = async (userId, preferences) => {
  try {
    const userContext = await this.getOrCreateUserContext(userId);
    
    // Update preferences
    userContext.preferences = {
      ...userContext.preferences,
      ...preferences
    };
    
    await userContext.save();
    return userContext;
  } catch (error) {
    logger.error(`Error updating user preferences: ${error.message}`);
    throw error;
  }
};

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {String} name - User name
 * @returns {Promise<Object>} - Updated user context
 */
exports.updateUserProfile = async (userId, name) => {
  try {
    const userContext = await this.getOrCreateUserContext(userId);
    
    if (name) {
      if (!userContext.profile) {
        userContext.profile = {};
      }
      userContext.profile.name = name;
    }
    
    await userContext.save();
    return userContext;
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    throw error;
  }
};

/**
 * Learn about user behavior patterns
 * @param {String} userId - User ID
 * @returns {Promise<void>}
 */
exports.learnUserBehavior = async (userId) => {
  try {
    const userContext = await this.getOrCreateUserContext(userId);
    
    // Get user tasks and schedules
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).limit(100);
    const schedules = await Schedule.find({ userId }).sort({ startTime: -1 }).limit(100);
    const habits = await Habit.find({ userId });
    
    // Extract common task types
    const commonTasks = extractCommonTaskTypes(tasks);
    
    // Extract typical active hours
    const typicalHours = extractTypicalHours(schedules);
    
    // Update behavior patterns and interests
    userContext.profile.commonTasks = commonTasks;
    
    if (!userContext.behaviorPatterns) {
      userContext.behaviorPatterns = {};
    }
    
    if (typicalHours) {
      userContext.behaviorPatterns.typicalActiveHours = typicalHours;
    }
    
    // Detect if user is a morning person
    const isMorningPerson = detectMorningPerson(schedules, habits);
    userContext.behaviorPatterns.morningPerson = isMorningPerson;
    
    await userContext.save();
  } catch (error) {
    logger.error(`Error learning user behavior: ${error.message}`);
    throw error;
  }
};

/**
 * Get conversation memory
 * @param {String} userId - User ID
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<Object>} - Conversation memory object
 */
exports.getConversationMemory = async (userId, conversationId) => {
  try {
    const userContext = await this.getOrCreateUserContext(userId);
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    const recentMessages = conversation.messages
      .slice(-5) // Get last 5 messages
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    
    return {
      userProfile: userContext.profile,
      preferences: userContext.preferences,
      recentTopics: userContext.conversationHistory?.recentTopics || [],
      recentMessages,
      conversationTitle: conversation.title
    };
  } catch (error) {
    logger.error(`Error getting conversation memory: ${error.message}`);
    throw error;
  }
};

// Helper functions

/**
 * Extract topics from user query
 * @param {String} query - User query
 * @returns {Array<String>} - Extracted topics
 */
function extractTopics(query) {
  const topics = [];
  
  // Keywords mapping to topics
  const keywordMap = {
    'tugas': 'tugas',
    'jadwal': 'jadwal',
    'kebiasaan': 'kebiasaan',
    'habit': 'kebiasaan',
    'catatan': 'catatan',
    'note': 'catatan',
    'kuliah': 'pendidikan',
    'sekolah': 'pendidikan',
    'belajar': 'pendidikan',
    'rapat': 'meeting',
    'meeting': 'meeting',
    'pengingat': 'pengingat',
    'reminder': 'pengingat',
    'deadline': 'deadline',
    'target': 'target',
    'tujuan': 'tujuan',
    'goal': 'tujuan'
  };
  
  // Check for keywords in user query
  const lowerQuery = query.toLowerCase();
  Object.entries(keywordMap).forEach(([keyword, topic]) => {
    if (lowerQuery.includes(keyword)) {
      topics.push(topic);
    }
  });
  
  return [...new Set(topics)]; // Return unique topics
}

/**
 * Extract common task types from user tasks
 * @param {Array} tasks - User tasks
 * @returns {Array<String>} - Common task types
 */
function extractCommonTaskTypes(tasks) {
  const taskTypes = {};
  
  tasks.forEach(task => {
    const category = task.category || 'other';
    taskTypes[category] = (taskTypes[category] || 0) + 1;
  });
  
  // Return task types sorted by frequency (highest first)
  return Object.entries(taskTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
}

/**
 * Extract typical hours from schedules
 * @param {Array} schedules - User schedules
 * @returns {Object|null} - Typical hours object
 */
function extractTypicalHours(schedules) {
  if (schedules.length < 5) {
    return null;
  }
  
  const hours = schedules.map(schedule => {
    const start = new Date(schedule.startTime).getHours();
    const end = new Date(schedule.endTime).getHours();
    return { start, end };
  });
  
  // Calculate average start and end hours
  const avgStart = Math.round(
    hours.reduce((sum, hour) => sum + hour.start, 0) / hours.length
  );
  const avgEnd = Math.round(
    hours.reduce((sum, hour) => sum + hour.end, 0) / hours.length
  );
  
  return {
    start: `${avgStart}:00`,
    end: `${avgEnd}:00`
  };
}

/**
 * Detect if user is a morning person
 * @param {Array} schedules - User schedules
 * @param {Array} habits - User habits
 * @returns {Boolean} - Whether user is a morning person
 */
function detectMorningPerson(schedules, habits) {
  // Count early morning activities (before 9 AM)
  let earlyActivities = 0;
  let totalActivities = 0;
  
  // Check schedules
  schedules.forEach(schedule => {
    const hour = new Date(schedule.startTime).getHours();
    if (hour <= 9) {
      earlyActivities++;
    }
    totalActivities++;
  });
  
  // Check habits
  habits.forEach(habit => {
    if (habit.preferredTime && habit.preferredTime.startsWith('morning')) {
      earlyActivities++;
    }
    totalActivities++;
  });
  
  // If at least 30% of activities are early morning, consider as morning person
  return totalActivities > 0 
    ? (earlyActivities / totalActivities) >= 0.3
    : false;
} 