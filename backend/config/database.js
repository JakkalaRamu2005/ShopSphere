const mysql = require('mysql2/promise');
const logger = require('./logger');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shopsphere',

    // SSL configuration for cloud databases
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud') ? {
        rejectUnauthorized: true
    } : undefined,

    // Connection pool settings
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // Timeout settings to prevent ECONNRESET
    connectTimeout: 60000,

    // Charset
    charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
    .then(connection => {
        logger.info('✅ Database connection pool established successfully');
        logger.info(`📊 Database: ${dbConfig.database} on ${dbConfig.host}`);
        connection.release();
    })
    .catch(err => {
        logger.error('❌ Failed to connect to database:', {
            error: err.message,
            code: err.code,
            host: dbConfig.host,
            database: dbConfig.database
        });
        process.exit(1);
    });

// Handle pool errors
pool.on('connection', (connection) => {
    logger.debug('New database connection established', {
        threadId: connection.threadId
    });

    connection.on('error', (err) => {
        logger.error('Database connection error:', {
            error: err.message,
            code: err.code,
            threadId: connection.threadId
        });
    });
});

pool.on('acquire', (connection) => {
    logger.debug('Connection acquired from pool', {
        threadId: connection.threadId
    });
});

pool.on('release', (connection) => {
    logger.debug('Connection released back to pool', {
        threadId: connection.threadId
    });
});

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('🔄 Closing database connection pool...');
    try {
        await pool.end();
        logger.info('✅ Database connection pool closed successfully');
    } catch (err) {
        logger.error('❌ Error closing database pool:', {
            error: err.message
        });
    }
};

process.on('SIGINT', async () => {
    await gracefulShutdown();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await gracefulShutdown();
    process.exit(0);
});

// Helper function to execute queries with error handling
const query = async (sql, params) => {
    const start = Date.now();
    try {
        const [results] = await pool.query(sql, params);
        const duration = Date.now() - start;

        logger.debug('Query executed successfully', {
            duration: `${duration}ms`,
            sql: sql.substring(0, 100) // Log first 100 chars
        });

        return results;
    } catch (error) {
        logger.error('Database query error:', {
            error: error.message,
            code: error.code,
            sql: sql.substring(0, 100),
            sqlState: error.sqlState
        });
        throw error;
    }
};

// Helper function to execute queries with connection (for transactions)
const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        logger.error('Failed to get database connection:', {
            error: error.message,
            code: error.code
        });
        throw error;
    }
};

module.exports = {
    pool,
    query,
    getConnection
};
