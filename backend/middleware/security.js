const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

/**
 * Security Middleware Configuration
 */

// Helmet - Sets various HTTP headers for security
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Rate Limiting - General API rate limit
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.'
        });
    }
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes.'
    },
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        logger.warn('Auth rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts, please try again later.'
        });
    }
});

// Rate limiting for password reset
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per hour
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again after an hour.'
    },
    handler: (req, res) => {
        logger.warn('Password reset rate limit exceeded', {
            ip: req.ip
        });
        res.status(429).json({
            success: false,
            message: 'Too many password reset attempts, please try again later.'
        });
    }
});

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 OTP requests per 15 minutes
    message: {
        success: false,
        message: 'Too many OTP requests, please try again later.'
    },
    handler: (req, res) => {
        logger.warn('OTP rate limit exceeded', {
            ip: req.ip
        });
        res.status(429).json({
            success: false,
            message: 'Too many OTP requests, please try again later.'
        });
    }
});

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per minute
    message: {
        success: false,
        message: 'Too many API requests, please slow down.'
    },
    handler: (req, res) => {
        logger.warn('API rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests, please slow down.'
        });
    }
});

module.exports = {
    helmetConfig,
    generalLimiter,
    authLimiter,
    passwordResetLimiter,
    otpLimiter,
    apiLimiter
};
