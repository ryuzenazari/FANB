const express = require('express');
const { 
  getHabits, 
  getHabit, 
  createHabit, 
  updateHabit, 
  deleteHabit,
  logHabit,
  getHabitLogs,
  getHabitsForFrontend
} = require('../controllers/habitController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getHabits)
  .post(createHabit);

// Rute khusus untuk frontend
router
  .route('/frontend')
  .get(getHabitsForFrontend);

router
  .route('/:id')
  .get(getHabit)
  .put(updateHabit)
  .delete(deleteHabit);

router
  .route('/:id/log')
  .post(logHabit);

router
  .route('/:id/logs')
  .get(getHabitLogs);

module.exports = router; 