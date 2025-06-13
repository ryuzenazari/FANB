const express = require('express');
const { 
  getNotes, 
  getNote, 
  createNote, 
  updateNote, 
  deleteNote,
  togglePin,
  toggleArchive,
  getTags
} = require('../controllers/noteController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getNotes)
  .post(createNote);

router
  .route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

router
  .route('/:id/pin')
  .put(togglePin);

router
  .route('/:id/archive')
  .put(toggleArchive);

router
  .route('/tags')
  .get(getTags);

module.exports = router; 