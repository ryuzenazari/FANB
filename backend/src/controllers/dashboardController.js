const mongoose = require('mongoose');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Note = require('../models/Note');
const Schedule = require('../models/Schedule');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  subDays, 
  format,
  isSameDay,
  addDays 
} = require('date-fns');

/**
 * @desc    Get dashboard overview summary
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Tasks statistics
  const taskStats = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format task stats
  const taskStatsByStatus = {
    total: 0,
    todo: 0,
    'in-progress': 0,
    completed: 0
  };

  taskStats.forEach(stat => {
    taskStatsByStatus[stat._id] = stat.count;
    taskStatsByStatus.total += stat.count;
  });

  // Habits statistics
  const activeHabits = await Habit.countDocuments({
    userId: userId,
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: today } }
    ]
  });

  // Get habit completion rate for the current week
  const habitLogsThisWeek = await HabitLog.find({
    userId: userId,
    date: {
      $gte: weekStart,
      $lte: weekEnd
    },
    skipped: false
  });

  // Get unique habit IDs that have logs this week
  const habitsCompletedThisWeek = new Set();
  habitLogsThisWeek.forEach(log => {
    habitsCompletedThisWeek.add(log.habitId.toString());
  });

  // Today's schedule
  const todaySchedules = await Schedule.find({
    userId: userId,
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
  }).sort({ startTime: 1 }).limit(5);

  // Upcoming due tasks
  const upcomingTasks = await Task.find({
    userId: userId,
    status: { $ne: 'completed' },
    dueDate: { $gte: today }
  }).sort({ dueDate: 1 }).limit(5);

  // Unread notifications
  const unreadNotifications = await Notification.countDocuments({
    userId: userId,
    status: 'unread'
  });

  // Recent notes
  const recentNotes = await Note.find({
    userId: userId
  }).sort({ updatedAt: -1 }).limit(3);

  // Calculate productivity score (simplified version)
  // 100 points max: tasks (40), habits (40), schedules (20)
  let productivityScore = 0;
  
  // Task completion rate (40 points)
  const completedTasks = taskStatsByStatus.completed || 0;
  const totalTasks = taskStatsByStatus.total || 1; // prevent division by zero
  const taskCompletionRate = completedTasks / totalTasks;
  productivityScore += Math.round(taskCompletionRate * 40);
  
  // Habit completion rate (40 points)
  const habitScore = activeHabits > 0 
    ? Math.round((habitsCompletedThisWeek.size / activeHabits) * 40)
    : 0;
  productivityScore += habitScore;
  
  // Schedule adherence (20 points)
  // This would ideally compare planned vs actual
  // Simplified version: give 20 points if user has any schedules
  if (todaySchedules.length > 0) {
    productivityScore += 20;
  }

  // Response object
  const dashboardData = {
    overviewStats: {
      taskCount: {
        total: taskStatsByStatus.total,
        completed: taskStatsByStatus.completed,
        inProgress: taskStatsByStatus['in-progress'],
        todo: taskStatsByStatus.todo
      },
      habitCount: {
        active: activeHabits,
        completedThisWeek: habitsCompletedThisWeek.size
      },
      notificationsUnread: unreadNotifications,
      productivityScore: productivityScore
    },
    todaySchedule: todaySchedules,
    upcomingTasks: upcomingTasks,
    recentNotes: recentNotes
  };

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

/**
 * @desc    Get habit overview for the dashboard
 * @route   GET /api/dashboard/habits-overview
 * @access  Private
 */
exports.getHabitsOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysToShow = 7;
  
  // Get active habits
  const habits = await Habit.find({
    userId: userId,
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: today } }
    ]
  }).sort({ name: 1 });
  
  // Date range for the logs
  const startDate = subDays(today, daysToShow - 1);
  const endDate = today;
  
  // Get habit logs for the date range
  const habitLogs = await HabitLog.find({
    userId: userId,
    habitId: { $in: habits.map(h => h._id) },
    date: {
      $gte: startOfDay(startDate),
      $lte: endOfDay(endDate)
    }
  });
  
  // Create a map for quick access to logs
  const habitLogMap = {};
  habitLogs.forEach(log => {
    const habitId = log.habitId.toString();
    const logDate = format(new Date(log.date), 'yyyy-MM-dd');
    
    if (!habitLogMap[habitId]) {
      habitLogMap[habitId] = {};
    }
    habitLogMap[habitId][logDate] = log;
  });
  
  // Create an array of dates for the last 7 days
  const dateLabels = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = addDays(startDate, i);
    dateLabels.push(format(date, 'yyyy-MM-dd'));
  }
  
  // Format the response
  const habitData = habits.map(habit => {
    const dailyData = dateLabels.map(dateStr => {
      const log = habitLogMap[habit._id.toString()]
        ? habitLogMap[habit._id.toString()][dateStr]
        : null;
      
      return {
        date: dateStr,
        completed: log ? !log.skipped : false,
        value: log ? log.value : 0
      };
    });
    
    // Calculate streak and completion rate
    const completedDays = dailyData.filter(day => day.completed).length;
    const completionRate = (completedDays / daysToShow) * 100;
    
    return {
      id: habit._id,
      name: habit.name,
      streak: habit.streak,
      longestStreak: habit.longestStreak,
      frequency: habit.frequency,
      target: habit.target,
      unit: habit.unit,
      color: habit.color,
      icon: habit.icon,
      completionRate: Math.round(completionRate),
      dailyData: dailyData
    };
  });
  
  res.status(200).json({
    success: true,
    date: {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      labels: dateLabels
    },
    count: habits.length,
    data: habitData
  });
});

/**
 * @desc    Get upcoming tasks for dashboard
 * @route   GET /api/dashboard/upcoming-tasks
 * @access  Private
 */
exports.getUpcomingTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const todayStart = startOfDay(today);
  const nextWeekEnd = endOfDay(addDays(today, 7));
  
  // Get overdue tasks
  const overdueTasks = await Task.find({
    userId: userId,
    status: { $ne: 'completed' },
    dueDate: { $lt: todayStart }
  })
    .sort({ dueDate: 1 })
    .populate('category', 'name color icon')
    .limit(5);
  
  // Get today's tasks
  const todayTasks = await Task.find({
    userId: userId,
    dueDate: {
      $gte: todayStart,
      $lte: endOfDay(today)
    }
  })
    .sort({ priority: -1, dueDate: 1 })
    .populate('category', 'name color icon')
    .limit(10);
  
  // Get this week's tasks
  const weekTasks = await Task.find({
    userId: userId,
    dueDate: {
      $gt: endOfDay(today),
      $lte: nextWeekEnd
    }
  })
    .sort({ dueDate: 1, priority: -1 })
    .populate('category', 'name color icon')
    .limit(10);
  
  res.status(200).json({
    success: true,
    data: {
      overdue: overdueTasks,
      today: todayTasks,
      upcoming: weekTasks
    }
  });
});

/**
 * @desc    Get daily schedule
 * @route   GET /api/dashboard/daily-schedule
 * @access  Private
 */
exports.getDailySchedule = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let targetDate;
  
  // Parse date from query if provided, otherwise use today
  if (req.query.date) {
    targetDate = new Date(req.query.date);
  } else {
    targetDate = new Date();
  }
  
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);
  
  // Get schedules for the day
  const schedules = await Schedule.find({
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
  })
    .sort({ startTime: 1 })
    .populate('category', 'name color icon');
  
  // Get tasks due today
  const tasks = await Task.find({
    userId: userId,
    dueDate: {
      $gte: dayStart,
      $lte: dayEnd
    }
  })
    .sort({ priority: -1 })
    .populate('category', 'name color icon');
  
  // Get habits for today
  const habits = await Habit.find({
    userId: userId,
    $or: [
      // For daily habits
      { frequency: 'daily' },
      // For weekly habits matching today's day of week
      {
        frequency: 'weekly',
        // For weekly habits, we'd ideally check if today's day matches
      },
      // For custom frequency
      {
        frequency: 'custom',
        customDays: targetDate.getDay() // 0 = Sunday, 1 = Monday, etc.
      }
    ],
    // Only active habits
    $and: [
      {
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: dayStart } }
        ]
      }
    ]
  }).populate('category', 'name color icon');
  
  // Check which habits have been completed today
  const habitIds = habits.map(h => h._id);
  
  const habitLogs = await HabitLog.find({
    habitId: { $in: habitIds },
    userId: userId,
    date: {
      $gte: dayStart,
      $lte: dayEnd
    }
  });
  
  // Map completed habits
  const habitsWithStatus = habits.map(habit => {
    const log = habitLogs.find(
      log => log.habitId.toString() === habit._id.toString()
    );
    
    return {
      ...habit.toObject(),
      completed: log ? !log.skipped : false,
      value: log ? log.value : 0,
      logId: log ? log._id : null
    };
  });
  
  res.status(200).json({
    success: true,
    date: format(targetDate, 'yyyy-MM-dd'),
    data: {
      schedules: schedules,
      tasks: tasks,
      habits: habitsWithStatus
    }
  });
});

/**
 * @desc    Get productivity insights
 * @route   GET /api/dashboard/productivity-insights
 * @access  Private
 */
exports.getProductivityInsights = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const last30Days = subDays(today, 30);
  
  // Task completion by day
  const taskCompletionByDay = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completedAt: {
          $gte: startOfDay(last30Days),
          $lte: endOfDay(today)
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Habit completion by day
  const habitCompletionByDay = await HabitLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startOfDay(last30Days),
          $lte: endOfDay(today)
        },
        skipped: false
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Task completion by category
  const taskByCategory = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'completed',
        completedAt: {
          $gte: startOfDay(last30Days)
        }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData'
      }
    },
    {
      $unwind: {
        path: '$categoryData',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          categoryId: '$category',
          name: '$categoryData.name',
          color: '$categoryData.color'
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        categoryId: '$_id.categoryId',
        name: { $ifNull: ['$_id.name', 'Uncategorized'] },
        color: { $ifNull: ['$_id.color', '#94a3b8'] }, // slate-400
        count: 1
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      taskCompletionByDay,
      habitCompletionByDay,
      taskByCategory
    }
  });
});

/**
 * @desc    Get AI-generated insights based on user's data
 * @route   GET /api/dashboard/ai-insights
 * @access  Private
 */
exports.getAIInsights = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const todayStart = startOfDay(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  try {
    // Get tasks data
    const [
      pendingTasks, 
      overdueTasks, 
      upcomingTasks, 
      completedTasksLastWeek
    ] = await Promise.all([
      // Tasks not completed
      Task.countDocuments({
        userId,
        status: { $ne: 'completed' }
      }),
      // Overdue tasks
      Task.countDocuments({
        userId,
        status: { $ne: 'completed' },
        dueDate: { $lt: todayStart }
      }),
      // Tasks due soon (next 3 days)
      Task.countDocuments({
        userId,
        status: { $ne: 'completed' },
        dueDate: { 
          $gte: todayStart,
          $lte: addDays(todayStart, 3)
        }
      }),
      // Tasks completed in last week
      Task.countDocuments({
        userId,
        status: 'completed',
        completedAt: {
          $gte: weekStart,
          $lte: today
        }
      })
    ]);
    
    // Get habits data
    const activeHabits = await Habit.find({
      userId,
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: today } }
      ]
    });
    
    const habitLogs = await HabitLog.find({
      userId,
      date: {
        $gte: weekStart,
        $lte: today
      },
      skipped: false
    });
    
    // Generate insights based on collected data
    const insights = [];
    
    // Task insights
    if (overdueTasks > 0) {
      insights.push({
        title: 'Tugas Tertunda',
        description: `Anda memiliki ${overdueTasks} tugas yang tertunda. Prioritaskan untuk menyelesaikan tugas ini untuk meningkatkan produktivitas.`,
        icon: '📌',
        type: 'tasks'
      });
    }
    
    if (upcomingTasks > 0) {
      insights.push({
        title: 'Tugas Akan Datang',
        description: `Anda memiliki ${upcomingTasks} tugas yang akan jatuh tempo dalam 3 hari kedepan. Luangkan waktu untuk menyelesaikan tugas-tugas ini.`,
        icon: '🗓️',
        type: 'tasks'
      });
    }
    
    if (completedTasksLastWeek > 0) {
      insights.push({
        title: 'Pencapaian Tugas',
        description: `Anda telah menyelesaikan ${completedTasksLastWeek} tugas minggu ini. Terus pertahankan momentum ini!`,
        icon: '✅',
        type: 'tasks'
      });
    }
    
    // Habit insights
    if (activeHabits.length > 0) {
      // Map habit logs to habit IDs
      const habitCompletions = {};
      habitLogs.forEach(log => {
        const habitId = log.habitId.toString();
        if (!habitCompletions[habitId]) {
          habitCompletions[habitId] = [];
        }
        habitCompletions[habitId].push(log);
      });
      
      // Find habits with consistent streaks
      const habitsWithStreaks = activeHabits.filter(habit => 
        habit.streak >= 7 || habit.longestStreak >= 14
      );
      
      if (habitsWithStreaks.length > 0) {
        const habitWithLongestStreak = [...habitsWithStreaks].sort((a, b) => 
          b.streak - a.streak
        )[0];
        
        insights.push({
          title: 'Konsistensi Kebiasaan',
          description: `Luar biasa! Anda telah menjaga kebiasaan "${habitWithLongestStreak.name}" selama ${habitWithLongestStreak.streak} hari berturut-turut. Streak adalah kunci untuk mengembangkan kebiasaan yang bertahan lama.`,
          icon: '🔥',
          type: 'habits'
        });
      }
      
      // Calculate habit completion rate
      const completedHabitsCount = Object.keys(habitCompletions).length;
      const completionRate = Math.round((completedHabitsCount / activeHabits.length) * 100);
      
      if (completionRate > 0) {
        insights.push({
          title: 'Tingkat Penyelesaian Kebiasaan',
          description: `Minggu ini Anda telah menyelesaikan ${completionRate}% dari kebiasaan aktif Anda. ${completionRate >= 80 ? 'Pertahankan kinerja yang luar biasa ini!' : 'Terus tingkatkan konsistensi Anda.'}`,
          icon: '📊',
          type: 'habits'
        });
      }
    }
    
    // Focus insights (placeholder - would need actual focus session data)
    insights.push({
      title: 'Saran Produktivitas',
      description: 'Coba teknik Pomodoro untuk meningkatkan fokus: 25 menit fokus penuh, diikuti dengan istirahat 5 menit. Ulangi 4 kali, lalu ambil istirahat lebih lama.',
      icon: '⏱️',
      type: 'focus'
    });
    
    // Balance insight
    if (pendingTasks > 10) {
      insights.push({
        title: 'Keseimbangan Hidup',
        description: 'Anda memiliki banyak tugas tertunda. Pertimbangkan untuk memprioritaskan dan mendelegasikan beberapa tugas untuk menjaga keseimbangan hidup Anda.',
        icon: '⚖️',
        type: 'insights'
      });
    } else {
      insights.push({
        title: 'Keseimbangan Hidup',
        description: 'Anda mengelola beban kerja dengan baik. Pastikan untuk menyisihkan waktu untuk kegiatan yang Anda nikmati dan istirahat.',
        icon: '🧘',
        type: 'insights'
      });
    }
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat menghasilkan wawasan AI',
      data: [
        // Fallback insights if error occurs
        {
          title: 'Pengelolaan Tugas',
          description: 'Tetapkan prioritas untuk tugas-tugas Anda untuk mengelola beban kerja dengan lebih efektif.',
          icon: '📋',
          type: 'tasks'
        },
        {
          title: 'Pengembangan Kebiasaan',
          description: 'Konsistensi adalah kunci untuk mengembangkan kebiasaan baru yang bertahan lama.',
          icon: '🔄',
          type: 'habits'
        }
      ]
    });
  }
});

/**
 * @desc    Get analytics data for charts
 * @route   GET /api/dashboard/analytics
 * @access  Private
 */
exports.getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);
  
  // Get completed tasks per day for last 7 days
  const completedTasksPerDay = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'completed',
        completedAt: {
          $gte: startOfDay(sevenDaysAgo),
          $lte: endOfDay(today)
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Get pending tasks per day for last 7 days
  const pendingTasksPerDay = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $ne: 'completed' },
        dueDate: {
          $gte: startOfDay(sevenDaysAgo),
          $lte: endOfDay(today)
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$dueDate' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Get habit completions per day for last 7 days
  const habitCompletionsPerDay = await HabitLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startOfDay(sevenDaysAgo),
          $lte: endOfDay(today)
        },
        skipped: false
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Prepare the data structure with all dates
  const dateArray = [];
  for (let i = 0; i <= 6; i++) {
    const date = addDays(sevenDaysAgo, i);
    dateArray.push(format(date, 'yyyy-MM-dd'));
  }
  
  // Format completed tasks data
  const completedTasksData = dateArray.map(date => {
    const data = completedTasksPerDay.find(item => item._id === date);
    return data ? data.count : 0;
  });
  
  // Format pending tasks data
  const pendingTasksData = dateArray.map(date => {
    const data = pendingTasksPerDay.find(item => item._id === date);
    return data ? data.count : 0;
  });
  
  // Format habit completions data
  const habitData = dateArray.map(date => {
    const data = habitCompletionsPerDay.find(item => item._id === date);
    return data ? data.count : 0;
  });
  
  // Generate focus time data (mock data for now)
  const focusData = dateArray.map(() => {
    return Math.floor(Math.random() * 60) + 20; // Random between 20-80 mins
  });
  
  res.status(200).json({
    success: true,
    data: {
      taskData: {
        completed: completedTasksData,
        pending: pendingTasksData
      },
      habitData: habitData,
      focusData: focusData
    }
  });
}); 