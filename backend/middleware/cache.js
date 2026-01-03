const { cache } = require('../config/redis');
const logger = require('../config/logger');

/**
 * Cache Middleware - Caches GET requests
 * Usage: app.get('/api/products', cacheMiddleware(300), controller)
 */
const cacheMiddleware = (duration = 300) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Generate cache key from URL and query params
        const cacheKey = `cache:${req.originalUrl || req.url}`;

        try {
            // Check if cached data exists
            const cachedData = await cache.get(cacheKey);

            if (cachedData) {
                logger.debug('Serving from cache', { cacheKey });
                return res.status(200).json(cachedData);
            }

            // Store original res.json function
            const originalJson = res.json.bind(res);

            // Override res.json to cache the response
            res.json = (body) => {
                // Cache the response
                cache.set(cacheKey, body, duration).catch(err => {
                    logger.error('Failed to cache response:', {
                        error: err.message,
                        cacheKey
                    });
                });

                // Call original json function
                return originalJson(body);
            };

            next();
        } catch (error) {
            logger.error('Cache middleware error:', {
                error: error.message,
                cacheKey
            });
            // Continue without caching on error
            next();
        }
    };
};

/**
 * Clear cache by pattern
 */
const clearCache = (pattern) => {
    return async (req, res, next) => {
        try {
            await cache.delPattern(pattern);
            logger.info('Cache cleared', { pattern });
        } catch (error) {
            logger.error('Error clearing cache:', {
                error: error.message,
                pattern
            });
        }
        next();
    };
};

module.exports = {
    cacheMiddleware,
    clearCache
};
