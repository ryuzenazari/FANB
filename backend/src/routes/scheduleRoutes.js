const express = require('express');
const { 
  getSchedules, 
  getSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  getFocusTimeSlots
} = require('../controllers/scheduleController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getSchedules)
  .post(createSchedule);

router
  .route('/:id')
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

router
  .route('/focus-slots')
  .get(getFocusTimeSlots);

module.exports = router; 