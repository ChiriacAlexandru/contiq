const { getConfig } = require('../config/env');

const config = getConfig();

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Postgres/Database errors
  if (err.code === '23505') { // Unique constraint violation
    const message = 'Duplicate field value entered';
    error = new AppError(message, 409, 'DUPLICATE_ENTRY');
  }

  if (err.code === '23503') { // Foreign key constraint violation  
    const message = 'Invalid reference to related data';
    error = new AppError(message, 400, 'INVALID_REFERENCE');
  }

  if (err.code === '23502') { // Not null constraint violation
    const message = 'Required field is missing';
    error = new AppError(message, 400, 'MISSING_REQUIRED_FIELD');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401, 'TOKEN_EXPIRED');
  }

  // Validation errors (Joi)
  if (err.name === 'ValidationError') {
    const message = err.details ? err.details.map(val => val.message).join(', ') : 'Validation error';
    error = new AppError(message, 400, 'VALIDATION_ERROR');
  }

  // Bcrypt errors
  if (err.message && err.message.includes('bcrypt')) {
    const message = 'Authentication failed';
    error = new AppError(message, 401, 'AUTH_FAILED');
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    const message = 'Not allowed by CORS policy';
    error = new AppError(message, 403, 'CORS_ERROR');
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  
  const response = {
    error: error.message || 'Internal server error',
    code: code,
    timestamp: new Date().toISOString()
  };

  // Include stack trace in development
  if (config.app.environment === 'development') {
    response.stack = err.stack;
    response.details = {
      originalError: err.name,
      url: req.url,
      method: req.method
    };
  }

  res.status(statusCode).json(response);
};

// Handle 404 routes
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE REJECTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

module.exports = {
  AppError,
  asyncHandler,
  errorHandler,
  notFound
};