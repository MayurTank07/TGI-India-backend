// Production-ready logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message, meta = {}) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, meta);
    }
  },
  
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  
  error: (message, error = null, meta = {}) => {
    console.error(`[ERROR] ${message}`, {
      error: error?.message || error,
      stack: error?.stack,
      ...meta
    });
  },
  
  debug: (message, meta = {}) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }
};

export default logger;
