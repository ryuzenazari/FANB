const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./config/logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "ui-avatars.com", "*.googleusercontent.com", "lh3.googleusercontent.com"],
      connectSrc: ["'self'", "localhost:5000", "http://localhost:5000"]
    }
  }
}));

// Rate limiting (hanya untuk production)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000 || 15 * 60 * 1000, // 15 minutes default
    max: process.env.RATE_LIMIT_MAX || 500, // 500 requests default
    message: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti',
    standardHeaders: true,
    legacyHeaders: false
  });

  // Apply rate limiting to all requests
  app.use(limiter);
  logger.info('Rate limiting enabled for production environment');
} else {
  logger.info('Rate limiting disabled for development environment');
}

// Set static folder for uploads
const uploadsDir = path.join(__dirname, '..', process.env.FILE_UPLOAD_PATH || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const noteRoutes = require('./routes/noteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount routers
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/tasks`, taskRoutes);
app.use(`${apiPrefix}/habits`, habitRoutes);
app.use(`${apiPrefix}/notes`, noteRoutes);
app.use(`${apiPrefix}/notifications`, notificationRoutes);
app.use(`${apiPrefix}/schedules`, scheduleRoutes);
app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
app.use(`${apiPrefix}/ai`, aiRoutes);

// Health check endpoint
app.get(`${apiPrefix}/health`, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route tidak ditemukan'
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Error: ${err.message}`);
  console.error(`Error: ${err.message}`);
  
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server; 