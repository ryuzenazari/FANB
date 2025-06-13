const express = require('express');
const { 
  chatWithAssistant, 
  getPersonalInsights, 
  optimizeSchedule, 
  getHabitRecommendations,
  getConversationHistory,
  getAllConversations,
  getConversationById,
  deleteConversation,
  getPendingActions,
  executeAction,
  getConversationActions,
  userAIPreferences,
  updateAIProfile
} = require('../controllers/aiAssistantController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Chat and responses
router
  .route('/chat')
  .post(chatWithAssistant);

// AI Insights and recommendations
router
  .route('/insights')
  .get(getPersonalInsights);

router
  .route('/optimize-schedule')
  .post(optimizeSchedule);

router
  .route('/habit-recommendations')
  .get(getHabitRecommendations);

// User AI context and preferences
router
  .route('/preferences')
  .get(userAIPreferences)
  .put(userAIPreferences);

router
  .route('/profile')
  .put(updateAIProfile);

// Conversation management
router
  .route('/conversation-history')
  .get(getConversationHistory);

router
  .route('/conversations')
  .get(getAllConversations);

router
  .route('/conversations/:id')
  .get(getConversationById)
  .delete(deleteConversation);

// AI Actions
router
  .route('/pending-actions')
  .get(getPendingActions);

router
  .route('/actions/:id/execute')
  .post(executeAction);

router
  .route('/conversations/:id/actions')
  .get(getConversationActions);

module.exports = router; 