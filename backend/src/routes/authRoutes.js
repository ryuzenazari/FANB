const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  googleAuth,
  googleCallback
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router; 