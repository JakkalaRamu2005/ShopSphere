const Redis = require('ioredis');
const logger = require('./logger');

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
};

// Create Redis client
const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
    logger.info('✅ Redis client connected successfully');
});

redis.on('ready', () => {
    logger.info('✅ Redis client ready to use');
});

redis.on('error', (err) => {
    logger.error('❌ Redis client error:', {
        error: err.message,
        code: err.code
    });
});

redis.on('close', () => {
    logger.warn('⚠️  Redis connection closed');
});

redis.on('reconnecting', () => {
    logger.info('🔄 Redis client reconnecting...');
});

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('🔄 Closing Redis connection...');
    try {
        await redis.quit();
        logger.info('✅ Redis connection closed successfully');
    } catch (err) {
        logger.error('❌ Error closing Redis connection:', {
            error: err.message
        });
    }
};

process.on('SIGINT', async () => {
    await gracefulShutdown();
});

process.on('SIGTERM', async () => {
    await gracefulShutdown();
});

/**
 * Cache helper functions
 */
const cache = {
    /**
     * Get value from cache
     */
    async get(key) {
        try {
            const value = await redis.get(key);
            if (value) {
                logger.debug('Cache hit', { key });
                return JSON.parse(value);
            }
            logger.debug('Cache miss', { key });
            return null;
        } catch (error) {
            logger.error('Error getting from cache:', {
                error: error.message,
                key
            });
            return null; // Fail gracefully
        }
    },

    /**
     * Set value in cache with TTL (in seconds)
     */
    async set(key, value, ttl = 300) {
        try {
            await redis.setex(key, ttl, JSON.stringify(value));
            logger.debug('Cache set', { key, ttl });
            return true;
        } catch (error) {
            logger.error('Error setting cache:', {
                error: error.message,
                key
            });
            return false;
        }
    },

    /**
     * Delete key from cache
     */
    async del(key) {
        try {
            await redis.del(key);
            logger.debug('Cache deleted', { key });
            return true;
        } catch (error) {
            logger.error('Error deleting from cache:', {
                error: error.message,
                key
            });
            return false;
        }
    },

    /**
     * Delete multiple keys matching pattern
     */
    async delPattern(pattern) {
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
                logger.debug('Cache pattern deleted', { pattern, count: keys.length });
            }
            return true;
        } catch (error) {
            logger.error('Error deleting cache pattern:', {
                error: error.message,
                pattern
            });
            return false;
        }
    },

    /**
     * Check if key exists
     */
    async exists(key) {
        try {
            const result = await redis.exists(key);
            return result === 1;
        } catch (error) {
            logger.error('Error checking cache existence:', {
                error: error.message,
                key
            });
            return false;
        }
    },

    /**
     * Set expiry on existing key
     */
    async expire(key, ttl) {
        try {
            await redis.expire(key, ttl);
            return true;
        } catch (error) {
            logger.error('Error setting cache expiry:', {
                error: error.message,
                key,
                ttl
            });
            return false;
        }
    },

    /**
     * Increment counter
     */
    async incr(key) {
        try {
            const value = await redis.incr(key);
            return value;
        } catch (error) {
            logger.error('Error incrementing cache:', {
                error: error.message,
                key
            });
            return null;
        }
    },

    /**
     * Get TTL of key
     */
    async ttl(key) {
        try {
            return await redis.ttl(key);
        } catch (error) {
            logger.error('Error getting TTL:', {
                error: error.message,
                key
            });
            return -1;
        }
    }
};

module.exports = {
    redis,
    cache
};
