const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const logger = require('../config/logger');

/**
 * Middleware untuk proteksi rute
 * Memeriksa token yang diberikan di header
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Periksa header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Pastikan token ada
  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({
      success: false,
      error: {
        message: 'Akses ditolak, autentikasi diperlukan'
      }
    });
  }
  
  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Dapatkan user berdasarkan id dalam token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      logger.warn(`User not found with id: ${decoded.id}`);
      return res.status(401).json({
        success: false,
        error: {
          message: 'User tidak ditemukan'
        }
      });
    }
    
    // Tambahkan user ke request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      success: false,
      error: {
        message: `Authentication error: ${error.message}`
      }
    });
  }
});

/**
 * Middleware untuk membatasi akses berdasarkan role
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Akses ditolak, autentikasi diperlukan'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      logger.warn(`User ${req.user._id} attempted to access a restricted route`);
      return res.status(403).json({
        success: false,
        error: {
          message: 'Anda tidak memiliki izin untuk mengakses resource ini'
        }
      });
    }
    
    next();
  };
}; 