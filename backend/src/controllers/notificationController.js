const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/**
 * @desc    Get all notifications for a user
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filter options
  const filter = { userId: req.user.id };
  
  // Status filter
  if (req.query.status && req.query.status !== '') {
    filter.status = req.query.status;
  }
  
  // Type filter
  if (req.query.type && req.query.type !== '') {
    filter.type = req.query.type;
  }
  
  // Priority filter
  if (req.query.priority && req.query.priority !== '') {
    filter.priority = req.query.priority;
  }

  // Date range filter for scheduledFor
  if (req.query.startDate && req.query.endDate) {
    filter.scheduledFor = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }
  
  // Sort options
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'scheduledFor':
        sortBy = { scheduledFor: 1 };
        break;
      case 'priority':
        sortBy = { priority: -1, createdAt: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  } else {
    // Default: by creation date (newest first)
    sortBy = { createdAt: -1 };
  }
  
  // Execute query
  const notifications = await Notification.find(filter)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit);
  
  // Get total count for pagination
  const total = await Notification.countDocuments(filter);
  
  // Count unread notifications
  const unreadCount = await Notification.countDocuments({
    userId: req.user.id,
    status: 'unread'
  });
  
  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    pagination,
    data: notifications
  });
});

/**
 * @desc    Get single notification
 * @route   GET /api/notifications/:id
 * @access  Private
 */
exports.getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Notifikasi tidak ditemukan'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Create new notification
 * @route   POST /api/notifications
 * @access  Private
 */
exports.createNotification = asyncHandler(async (req, res) => {
  // Add user ID to request body
  req.body.userId = req.user.id;
  
  // Create notification
  const notification = await Notification.create(req.body);
  
  logger.info(`Notification created: ${notification._id} for user: ${req.user._id}`);
  
  res.status(201).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Update notification
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
exports.updateNotification = asyncHandler(async (req, res) => {
  let notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Notifikasi tidak ditemukan'
      }
    });
  }
  
  // Update notification
  notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  logger.info(`Notification updated: ${notification._id}`);
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Notifikasi tidak ditemukan'
      }
    });
  }
  
  await notification.deleteOne();
  
  logger.info(`Notification deleted: ${notification._id}`);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  let notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Notifikasi tidak ditemukan'
      }
    });
  }
  
  // Set status to read
  notification.status = 'read';
  await notification.save();
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { 
      userId: req.user.id,
      status: 'unread'
    },
    {
      status: 'read'
    }
  );
  
  logger.info(`All notifications marked as read for user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    message: 'Semua notifikasi telah ditandai sebagai dibaca'
  });
});

/**
 * @desc    Generate scheduled notifications
 * @route   POST /api/notifications/generate-scheduled
 * @access  Private (Admin only)
 */
exports.generateScheduledNotifications = asyncHandler(async (req, res) => {
  // This would be a background job in production
  // Here we're just triggering it manually
  
  logger.info('Generating scheduled notifications');
  
  res.status(200).json({
    success: true,
    message: 'Notifikasi terjadwal telah diproses'
  });
}); 