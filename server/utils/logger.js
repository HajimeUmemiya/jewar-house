const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

/**
 * Format log message
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${message}${metaStr}`;
}

/**
 * Write log to file
 */
function writeToFile(level, message, meta = {}) {
  if (process.env.NODE_ENV === 'production') {
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    const formattedMessage = formatMessage(level, message, meta);
    
    fs.appendFile(logFile, formattedMessage + '\n', (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }
}

/**
 * Logger implementation
 */
const logger = {
  error: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message, meta));
      writeToFile('ERROR', message, meta);
    }
  },
  
  warn: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, meta));
      writeToFile('WARN', message, meta);
    }
  },
  
  info: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(formatMessage('INFO', message, meta));
      writeToFile('INFO', message, meta);
    }
  },
  
  debug: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage('DEBUG', message, meta));
      writeToFile('DEBUG', message, meta);
    }
  }
};

module.exports = { logger };