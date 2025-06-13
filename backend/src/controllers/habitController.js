const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const { startOfDay, endOfDay, subDays, format, parseISO, isWithinInterval } = require('date-fns');

/**
 * @desc    Get all habits for a user
 * @route   GET /api/habits
 * @access  Private
 */
exports.getHabits = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filter options
  const filter = { userId: req.user.id };
  
  // Frequency filter
  if (req.query.frequency && req.query.frequency !== '') {
    filter.frequency = req.query.frequency;
  }
  
  // Category filter
  if (req.query.category && req.query.category !== '') {
    filter.category = req.query.category;
  }
  
  // Search filter
  if (req.query.search && req.query.search !== '') {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Sort options
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'name':
        sortBy = { name: 1 };
        break;
      case 'streak':
        sortBy = { streak: -1 };
        break;
      case 'createdAt':
        sortBy = { createdAt: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  } else {
    sortBy = { createdAt: -1 };
  }
  
  // Execute query
  const habits = await Habit.find(filter)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .populate('category', 'name color icon');
  
  // Get total count for pagination
  const total = await Habit.countDocuments(filter);
  
  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
  
  res.status(200).json({
    success: true,
    count: habits.length,
    pagination,
    data: habits
  });
});

/**
 * @desc    Get single habit
 * @route   GET /api/habits/:id
 * @access  Private
 */
exports.getHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate('category', 'name color icon');
  
  if (!habit) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Kebiasaan tidak ditemukan'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: habit
  });
});

/**
 * @desc    Create new habit
 * @route   POST /api/habits
 * @access  Private
 */
exports.createHabit = asyncHandler(async (req, res) => {
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
  
  // Create habit
  const habit = await Habit.create(req.body);
  
  logger.info(`Habit created: ${habit._id} by user: ${req.user._id}`);
  
  res.status(201).json({
    success: true,
    data: habit
  });
});

/**
 * @desc    Update habit
 * @route   PUT /api/habits/:id
 * @access  Private
 */
exports.updateHabit = asyncHandler(async (req, res) => {
  let habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!habit) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Kebiasaan tidak ditemukan'
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
  
  // Update habit
  habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category', 'name color icon');
  
  logger.info(`Habit updated: ${habit._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: habit
  });
});

/**
 * @desc    Delete habit
 * @route   DELETE /api/habits/:id
 * @access  Private
 */
exports.deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!habit) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Kebiasaan tidak ditemukan'
      }
    });
  }
  
  await habit.deleteOne();
  
  // Delete all related logs
  await HabitLog.deleteMany({ habitId: habit._id });
  
  logger.info(`Habit deleted: ${habit._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Log habit completion
 * @route   POST /api/habits/:id/log
 * @access  Private
 */
exports.logHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!habit) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Kebiasaan tidak ditemukan'
      }
    });
  }
  
  // Create log body
  const logData = {
    habitId: habit._id,
    userId: req.user.id,
    value: req.body.value || 1,
    notes: req.body.notes || '',
    mood: req.body.mood || 'neutral',
    skipped: req.body.skipped || false,
    date: req.body.date ? new Date(req.body.date) : new Date()
  };
  
  // Check if log already exists for this date
  const startDate = startOfDay(logData.date);
  const endDate = endOfDay(logData.date);
  
  let existingLog = await HabitLog.findOne({
    habitId: habit._id,
    userId: req.user.id,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  if (existingLog) {
    // Update existing log
    existingLog = await HabitLog.findByIdAndUpdate(
      existingLog._id,
      logData,
      {
        new: true,
        runValidators: true
      }
    );
    
    logger.info(`HabitLog updated: ${existingLog._id} by user: ${req.user._id}`);
    
    return res.status(200).json({
      success: true,
      data: existingLog
    });
  }
  
  // Create new log
  const habitLog = await HabitLog.create(logData);
  
  // Perbarui streak jika tidak dilewati
  if (!logData.skipped) {
    // Check if there was a log yesterday
    const yesterday = subDays(startOfDay(new Date()), 1);
    const yesterdayLog = await HabitLog.findOne({
      habitId: habit._id,
      userId: req.user.id,
      date: {
        $gte: startOfDay(yesterday),
        $lte: endOfDay(yesterday)
      },
      skipped: false
    });
    
    if (yesterdayLog) {
      // Increment streak
      habit.streak += 1;
    } else {
      // Reset streak
      habit.streak = 1;
    }
    
    // Update longest streak if needed
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }
    
    await habit.save();
  }
  
  logger.info(`HabitLog created: ${habitLog._id} by user: ${req.user._id}`);
  
  res.status(201).json({
    success: true,
    data: habitLog
  });
});

/**
 * @desc    Get habit logs for a habit
 * @route   GET /api/habits/:id/logs
 * @access  Private
 */
exports.getHabitLogs = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!habit) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Kebiasaan tidak ditemukan'
      }
    });
  }
  
  // Date range filter
  let startDate, endDate;
  
  if (req.query.startDate && req.query.endDate) {
    startDate = startOfDay(parseISO(req.query.startDate));
    endDate = endOfDay(parseISO(req.query.endDate));
  } else {
    // Default to last 30 days
    endDate = endOfDay(new Date());
    startDate = startOfDay(subDays(new Date(), 30));
  }
  
  const logs = await HabitLog.find({
    habitId: habit._id,
    userId: req.user.id,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
  
  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
});

/**
 * @desc    Get habits formatted for frontend
 * @route   GET /api/habits/frontend
 * @access  Private
 */
exports.getHabitsForFrontend = asyncHandler(async (req, res) => {
  try {
    // Get all habits for the user
    const habits = await Habit.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('category', 'name color icon');
    
    // Format habits for frontend
    const formattedHabits = habits.map(habit => {
      // Check if habit was completed today
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      
      // Format the habit data
      return {
        id: habit._id,
        userId: habit.userId,
        name: habit.name,
        description: habit.description || '',
        category: habit.category ? habit.category._id : null,
        categoryName: habit.category ? habit.category.name : 'Uncategorized',
        icon: habit.icon || '📌',
        frequency: habit.frequency,
        frequencyValue: habit.frequencyValue,
        targetCount: habit.targetCount,
        completedCount: habit.completedCount || 0,
        unit: habit.unit || '',
        currentStreak: habit.streak || 0,
        bestStreak: habit.longestStreak || 0,
        startDate: habit.startDate,
        color: habit.color || '#4f90f2',
        reminderEnabled: habit.reminderEnabled || false,
        reminderTime: habit.reminderTime || null,
        notes: habit.notes || '',
        archived: habit.archived || false,
        completedToday: false, // Will be updated by frontend
        completedDates: [], // Will be populated if needed
        createdAt: habit.createdAt,
        updatedAt: habit.updatedAt
      };
    });
    
    logger.info(`Frontend habits fetched by user: ${req.user._id}`);
    
    return res.status(200).json({
      success: true,
      count: formattedHabits.length,
      data: formattedHabits
    });
  } catch (error) {
    logger.error(`Error fetching frontend habits: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Terjadi kesalahan saat mengambil data kebiasaan'
      }
    });
  }
}); 