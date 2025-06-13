const Task = require('../models/Task');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/**
 * @desc    Get all tasks for a user
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getTasks = asyncHandler(async (req, res) => {
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
  
  // Priority filter
  if (req.query.priority && req.query.priority !== '') {
    filter.priority = req.query.priority;
  }
  
  // Category filter
  if (req.query.category && req.query.category !== '') {
    filter.category = req.query.category;
  }
  
  // Tag/label filter
  if (req.query.tag && req.query.tag !== '') {
    filter.labels = { $in: [req.query.tag] };
  }
  
  // Search filter
  if (req.query.search && req.query.search !== '') {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Sort options
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'dueDate':
        sortBy = { dueDate: 1 };
        break;
      case 'priority':
        sortBy = { priority: -1 };
        break;
      case 'title':
        sortBy = { title: 1 };
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
  const tasks = await Task.find(filter)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .populate('category', 'name color icon');
  
  // Get total count for pagination
  const total = await Task.countDocuments(filter);
  
  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
  
  res.status(200).json({
    success: true,
    count: tasks.length,
    pagination,
    data: tasks
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate('category', 'name color icon');
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Tugas tidak ditemukan'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
exports.createTask = asyncHandler(async (req, res) => {
  // Validasi input
  const taskData = req.body;
  taskData.userId = req.user.id;
  
  // Handle new category as string
  if (taskData.categoryName && !taskData.category) {
    // Try to find existing category with this name
    let category = await Category.findOne({ name: taskData.categoryName });
    
    // If category doesn't exist, create it
    if (!category) {
      category = await Category.create({ 
        name: taskData.categoryName,
        userId: req.user.id
      });
    }
    
    // Set category ID
    taskData.category = category._id;
    delete taskData.categoryName;
  }
  
  // Check if category exists and belongs to user
  if (taskData.category) {
    const category = await Category.findOne({
      _id: taskData.category,
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
  
  const task = await Task.create(taskData);
  
  logger.info(`Task created: ${task._id} by user: ${req.user._id}`);
  
  res.status(201).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
exports.updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Tugas tidak ditemukan'
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
  
  // Update task
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category', 'name color icon');
  
  logger.info(`Task updated: ${task._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Tugas tidak ditemukan'
      }
    });
  }
  
  await Task.findByIdAndDelete(req.params.id);
  
  logger.info(`Task deleted: ${req.params.id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get task statistics
 * @route   GET /api/tasks/stats
 * @access  Private
 */
exports.getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Format stats
  const formattedStats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0
  };
  
  stats.forEach(stat => {
    if (stat._id === 'todo') formattedStats.todo = stat.count;
    if (stat._id === 'in-progress') formattedStats.inProgress = stat.count;
    if (stat._id === 'completed') formattedStats.completed = stat.count;
    formattedStats.total += stat.count;
  });
  
  // Get overdue tasks
  const overdueTasks = await Task.countDocuments({
    userId: req.user._id,
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() }
  });
  
  formattedStats.overdue = overdueTasks;
  
  // Get today's tasks
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const todayTasks = await Task.countDocuments({
    userId: req.user._id,
    dueDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  formattedStats.today = todayTasks;
  
  res.status(200).json({
    success: true,
    data: formattedStats
  });
}); 