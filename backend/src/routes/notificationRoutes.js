const express = require('express');
const { 
  getNotifications, 
  getNotification, 
  createNotification, 
  updateNotification, 
  deleteNotification,
  markAsRead,
  markAllAsRead,
  generateScheduledNotifications
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getNotifications)
  .post(createNotification);

router
  .route('/:id')
  .get(getNotification)
  .put(updateNotification)
  .delete(deleteNotification);

router
  .route('/:id/read')
  .put(markAsRead);

router
  .route('/read-all')
  .put(markAllAsRead);

// Admin only route
router
  .route('/generate-scheduled')
  .post(authorize('admin'), generateScheduledNotifications);

module.exports = router; 