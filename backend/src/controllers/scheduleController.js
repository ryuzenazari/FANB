const Schedule = require('../models/Schedule');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  parseISO
} = require('date-fns');

/**
 * @desc    Get all schedules for a user
 * @route   GET /api/schedules
 * @access  Private
 */
exports.getSchedules = asyncHandler(async (req, res) => {
  // Filter options
  const filter = { userId: req.user.id };
  
  // Date range filter
  let startDate, endDate;
  
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    endDate = new Date(req.query.endDate);
  } else if (req.query.view) {
    // Different views based on client request
    const today = new Date();
    
    switch (req.query.view) {
      case 'day':
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        break;
      case 'week':
        startDate = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
        endDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      default:
        startDate = startOfDay(today);
        endDate = endOfDay(today);
    }
  } else {
    // Default to today's view
    const today = new Date();
    startDate = startOfDay(today);
    endDate = endOfDay(today);
  }
  
  // Add date range filter if dates are set
  if (startDate && endDate) {
    filter.$or = [
      // Events that start within the range
      {
        startTime: {
          $gte: startDate,
          $lte: endDate
        }
      },
      // Events that end within the range
      {
        endTime: {
          $gte: startDate,
          $lte: endDate
        }
      },
      // Events that span over the range
      {
        startTime: { $lte: startDate },
        endTime: { $gte: endDate }
      }
    ];
  }
  
  // Type filter
  if (req.query.type && req.query.type !== '') {
    filter.type = req.query.type;
  }
  
  // Category filter
  if (req.query.category && req.query.category !== '') {
    filter.category = req.query.category;
  }
  
  // Status filter
  if (req.query.status && req.query.status !== '') {
    filter.status = req.query.status;
  }
  
  // Search filter
  if (req.query.search && req.query.search !== '') {
    filter.$or = [
      ...(filter.$or || []),
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { location: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Execute query
  const schedules = await Schedule.find(filter)
    .sort({ startTime: 1 })
    .populate('category', 'name color icon');
  
  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

/**
 * @desc    Get single schedule
 * @route   GET /api/schedules/:id
 * @access  Private
 */
exports.getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate('category', 'name color icon');
  
  if (!schedule) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Jadwal tidak ditemukan'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: schedule
  });
});

/**
 * @desc    Create new schedule
 * @route   POST /api/schedules
 * @access  Private
 */
exports.createSchedule = asyncHandler(async (req, res) => {
  // Add user ID to request body
  req.body.userId = req.user.id;
  
  // Check if category exists and belongs to user
  if (req.body.category) {
    const category = await Category.findOne({
      _id: req.body.category,
      userId: req.user.id
    });
    
    if (!category) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Kategori tidak valid'
        }
      });
    }
  }
  
  // Validate time duration
  const startTime = new Date(req.body.startTime);
  const endTime = new Date(req.body.endTime);
  
  if (endTime <= startTime) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Waktu selesai harus lebih dari waktu mulai'
      }
    });
  }
  
  // Create schedule
  const schedule = await Schedule.create(req.body);
  
  logger.info(`Schedule created: ${schedule._id} by user: ${req.user._id}`);
  
  res.status(201).json({
    success: true,
    data: schedule
  });
});

/**
 * @desc    Update schedule
 * @route   PUT /api/schedules/:id
 * @access  Private
 */
exports.updateSchedule = asyncHandler(async (req, res) => {
  let schedule = await Schedule.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!schedule) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Jadwal tidak ditemukan'
      }
    });
  }
  
  // Check if category exists and belongs to user
  if (req.body.category) {
    const category = await Category.findOne({
      _id: req.body.category,
      userId: req.user.id
    });
    
    if (!category) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Kategori tidak valid'
        }
      });
    }
  }
  
  // Validate time duration if both fields are provided
  if (req.body.startTime && req.body.endTime) {
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Waktu selesai harus lebih dari waktu mulai'
        }
      });
    }
  }
  
  // Update schedule
  schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category', 'name color icon');
  
  logger.info(`Schedule updated: ${schedule._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: schedule
  });
});

/**
 * @desc    Delete schedule
 * @route   DELETE /api/schedules/:id
 * @access  Private
 */
exports.deleteSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!schedule) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Jadwal tidak ditemukan'
      }
    });
  }
  
  await schedule.deleteOne();
  
  logger.info(`Schedule deleted: ${schedule._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get available time slots for focus time
 * @route   GET /api/schedules/focus-slots
 * @access  Private
 */
exports.getFocusTimeSlots = asyncHandler(async (req, res) => {
  // Require date parameter
  if (!req.query.date) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Parameter tanggal diperlukan'
      }
    });
  }
  
  const targetDate = parseISO(req.query.date);
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);
  
  // Get all schedules for that day
  const schedules = await Schedule.find({
    userId: req.user.id,
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
  
  // Default working hours: 8:00 AM - 6:00 PM
  const workStart = new Date(dayStart);
  workStart.setHours(8, 0, 0, 0);
  
  const workEnd = new Date(dayStart);
  workEnd.setHours(18, 0, 0, 0);
  
  // Find available slots (minimum 30 minutes)
  const availableSlots = [];
  let currentTime = new Date(workStart);
  
  for (const event of schedules) {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    
    // If there's time before this event
    if (eventStart > currentTime) {
      const duration = (eventStart - currentTime) / (60 * 1000); // in minutes
      
      if (duration >= 30) {
        availableSlots.push({
          start: new Date(currentTime),
          end: new Date(eventStart),
          duration: duration
        });
      }
    }
    
    // Move current time to after this event
    if (eventEnd > currentTime) {
      currentTime = new Date(eventEnd);
    }
  }
  
  // Check if there's time after the last event until end of work day
  if (workEnd > currentTime) {
    const duration = (workEnd - currentTime) / (60 * 1000); // in minutes
    
    if (duration >= 30) {
      availableSlots.push({
        start: new Date(currentTime),
        end: new Date(workEnd),
        duration: duration
      });
    }
  }
  
  res.status(200).json({
    success: true,
    count: availableSlots.length,
    data: availableSlots
  });
}); 