const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');

// Semua routes menggunakan middleware protect
router.use(protect);

// Task stats route
router.get('/stats', getTaskStats);

// Test route untuk debugging
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task API is working',
    user: req.user ? req.user._id : 'No user'
  });
});

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router; 