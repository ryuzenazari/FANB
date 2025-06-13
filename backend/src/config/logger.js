const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Pastikan direktori log ada
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format log
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `{"timestamp":"${timestamp}","level":"${level}","message":${JSON.stringify(message)}}`;
  })
);

// Buat logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'fanb-backend' },
  transports: [
    // File transport untuk semua log level
    new winston.transports.File({ 
      filename: process.env.LOG_FILE || path.join(logDir, 'app.log')
    }),
    
    // File khusus untuk error
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    
    // Console output pada mode development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
});

module.exports = logger; 