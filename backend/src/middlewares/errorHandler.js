const logger = require('../config/logger');

/**
 * Error handler untuk aplikasi Express
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.stack);
  
  // Default error message dan status
  let error = { ...err };
  error.message = err.message || 'Server Error';
  
  // MongoDB bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource tidak ditemukan';
    error = { message };
  }
  
  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} sudah terdaftar`;
    error = { message };
  }
  
  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Token tidak valid' };
  }
  
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token sudah kadaluwarsa' };
  }
  
  // Response format yang konsisten
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: error.message
    }
  });
};

module.exports = errorHandler; 