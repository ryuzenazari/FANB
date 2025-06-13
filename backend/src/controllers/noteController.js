const Note = require('../models/Note');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/**
 * @desc    Get all notes for a user
 * @route   GET /api/notes
 * @access  Private
 */
exports.getNotes = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filter options
  const filter = { userId: req.user.id };
  
  // Type filter
  if (req.query.type && req.query.type !== '') {
    filter.type = req.query.type;
  }
  
  // Tag filter
  if (req.query.tag && req.query.tag !== '') {
    filter.tags = { $in: [req.query.tag] };
  }
  
  // Archived filter
  if (req.query.archived === 'true') {
    filter.archived = true;
  } else {
    filter.archived = false; // Default to non-archived notes
  }
  
  // Pinned filter
  if (req.query.pinned === 'true') {
    filter.pinned = true;
  }
  
  // Search filter
  if (req.query.search && req.query.search !== '') {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Mood filter
  if (req.query.mood && req.query.mood !== '') {
    filter.mood = req.query.mood;
  }
  
  // Sort options
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'title':
        sortBy = { title: 1 };
        break;
      case 'updatedAt':
        sortBy = { updatedAt: -1 };
        break;
      default:
        sortBy = { updatedAt: -1 };
    }
  } else {
    // Default sort: pinned first, then by updatedAt
    sortBy = { pinned: -1, updatedAt: -1 };
  }
  
  // Execute query
  const notes = await Note.find(filter)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'linkedTasks', 
      select: 'title status priority dueDate'
    });
  
  // Get total count for pagination
  const total = await Note.countDocuments(filter);
  
  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
  
  res.status(200).json({
    success: true,
    count: notes.length,
    pagination,
    data: notes
  });
});

/**
 * @desc    Get single note
 * @route   GET /api/notes/:id
 * @access  Private
 */
exports.getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate({
    path: 'linkedTasks', 
    select: 'title status priority dueDate'
  });
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Catatan tidak ditemukan'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Create new note
 * @route   POST /api/notes
 * @access  Private
 */
exports.createNote = asyncHandler(async (req, res) => {
  // Add user ID to request body
  req.body.userId = req.user.id;
  
  // Validasi linkedTasks
  if (req.body.linkedTasks && req.body.linkedTasks.length > 0) {
    const taskIds = req.body.linkedTasks;
    
    // Verifikasi semua task ada dan milik user yang sama
    const tasks = await Task.find({
      _id: { $in: taskIds },
      userId: req.user.id
    });
    
    if (tasks.length !== taskIds.length) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Satu atau beberapa task tidak valid'
        }
      });
    }
  }
  
  // Create note
  const note = await Note.create(req.body);
  
  logger.info(`Note created: ${note._id} by user: ${req.user._id}`);
  
  res.status(201).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Update note
 * @route   PUT /api/notes/:id
 * @access  Private
 */
exports.updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Catatan tidak ditemukan'
      }
    });
  }
  
  // Validasi linkedTasks
  if (req.body.linkedTasks && req.body.linkedTasks.length > 0) {
    const taskIds = req.body.linkedTasks;
    
    // Verifikasi semua task ada dan milik user yang sama
    const tasks = await Task.find({
      _id: { $in: taskIds },
      userId: req.user.id
    });
    
    if (tasks.length !== taskIds.length) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Satu atau beberapa task tidak valid'
        }
      });
    }
  }
  
  // Update note
  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate({
    path: 'linkedTasks', 
    select: 'title status priority dueDate'
  });
  
  logger.info(`Note updated: ${note._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Delete note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Catatan tidak ditemukan'
      }
    });
  }
  
  await note.deleteOne();
  
  logger.info(`Note deleted: ${note._id} by user: ${req.user._id}`);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Toggle pin note
 * @route   PUT /api/notes/:id/pin
 * @access  Private
 */
exports.togglePin = asyncHandler(async (req, res) => {
  let note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Catatan tidak ditemukan'
      }
    });
  }
  
  // Toggle pinned status
  note.pinned = !note.pinned;
  await note.save();
  
  res.status(200).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Toggle archive note
 * @route   PUT /api/notes/:id/archive
 * @access  Private
 */
exports.toggleArchive = asyncHandler(async (req, res) => {
  let note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Catatan tidak ditemukan'
      }
    });
  }
  
  // Toggle archived status
  note.archived = !note.archived;
  await note.save();
  
  res.status(200).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Get all tags from user notes
 * @route   GET /api/notes/tags
 * @access  Private
 */
exports.getTags = asyncHandler(async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  
  // Extract tags from all notes
  let tags = new Set();
  notes.forEach(note => {
    if (note.tags && note.tags.length > 0) {
      note.tags.forEach(tag => tags.add(tag));
    }
  });
  
  res.status(200).json({
    success: true,
    count: tags.size,
    data: Array.from(tags)
  });
}); 