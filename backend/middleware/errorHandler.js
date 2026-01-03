const express = require('express');
const router = express.Router();

/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
function errorHandler(err, req, res, next) {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    // Default error status and message
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err.details,
            }),
        },
    });
}

/**
 * 404 Not Found Handler
 * Handles requests to undefined routes
 */
function notFoundHandler(req, res, next) {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * Custom Error Classes
 */
class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, details);
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
};
