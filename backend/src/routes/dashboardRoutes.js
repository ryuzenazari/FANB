const express = require('express');
const { 
  getDashboardSummary, 
  getHabitsOverview, 
  getUpcomingTasks, 
  getDailySchedule,
  getProductivityInsights,
  getAIInsights,
  getDashboardAnalytics
} = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/summary')
  .get(getDashboardSummary);

router
  .route('/habits-overview')
  .get(getHabitsOverview);

router
  .route('/upcoming-tasks')
  .get(getUpcomingTasks);

router
  .route('/daily-schedule')
  .get(getDailySchedule);

router
  .route('/productivity-insights')
  .get(getProductivityInsights);

router
  .route('/ai-insights')
  .get(getAIInsights);

router
  .route('/analytics')
  .get(getDashboardAnalytics);

module.exports = router; 