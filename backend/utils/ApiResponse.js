const logger = require('../config/logger');

/**
 * Standard API Response Format
 */
class ApiResponse {
    /**
     * Success response
     */
    static success(res, data, message = 'Success', statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        logger.debug('API Success Response', {
            statusCode,
            message
        });

        return res.status(statusCode).json(response);
    }

    /**
     * Success response with pagination
     */
    static successWithPagination(res, data, pagination, message = 'Success', statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
            pagination: {
                currentPage: pagination.currentPage || 1,
                totalPages: pagination.totalPages || 1,
                pageSize: pagination.pageSize || data.length,
                totalItems: pagination.totalItems || data.length,
                hasNextPage: pagination.hasNextPage || false,
                hasPreviousPage: pagination.hasPreviousPage || false
            },
            timestamp: new Date().toISOString()
        };

        return res.status(statusCode).json(response);
    }

    /**
     * Error response
     */
    static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        logger.error('API Error Response', {
            statusCode,
            message,
            errors
        });

        return res.status(statusCode).json(response);
    }

    /**
     * Validation error response
     */
    static validationError(res, errors, message = 'Validation failed') {
        const response = {
            success: false,
            message,
            errors: Array.isArray(errors) ? errors : [errors],
            timestamp: new Date().toISOString()
        };

        logger.warn('Validation Error', { errors });

        return res.status(400).json(response);
    }

    /**
     * Not found response
     */
    static notFound(res, message = 'Resource not found') {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        logger.warn('Resource Not Found', { message });

        return res.status(404).json(response);
    }

    /**
     * Unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized access') {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        logger.warn('Unauthorized Access', { message });

        return res.status(401).json(response);
    }

    /**
     * Forbidden response
     */
    static forbidden(res, message = 'Access forbidden') {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        logger.warn('Forbidden Access', { message });

        return res.status(403).json(response);
    }

    /**
     * Created response
     */
    static created(res, data, message = 'Resource created successfully') {
        return ApiResponse.success(res, data, message, 201);
    }

    /**
     * No content response
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Custom response
     */
    static custom(res, statusCode, success, message, data = null) {
        const response = {
            success,
            message,
            timestamp: new Date().toISOString()
        };

        if (data) {
            response.data = data;
        }

        return res.status(statusCode).json(response);
    }
}

/**
 * Response middleware - Adds response helper methods to res object
 */
const responseMiddleware = (req, res, next) => {
    res.success = (data, message, statusCode) =>
        ApiResponse.success(res, data, message, statusCode);

    res.successWithPagination = (data, pagination, message, statusCode) =>
        ApiResponse.successWithPagination(res, data, pagination, message, statusCode);

    res.error = (message, statusCode, errors) =>
        ApiResponse.error(res, message, statusCode, errors);

    res.validationError = (errors, message) =>
        ApiResponse.validationError(res, errors, message);

    res.notFound = (message) =>
        ApiResponse.notFound(res, message);

    res.unauthorized = (message) =>
        ApiResponse.unauthorized(res, message);

    res.forbidden = (message) =>
        ApiResponse.forbidden(res, message);

    res.created = (data, message) =>
        ApiResponse.created(res, data, message);

    res.noContent = () =>
        ApiResponse.noContent(res);

    next();
};

module.exports = {
    ApiResponse,
    responseMiddleware
};
