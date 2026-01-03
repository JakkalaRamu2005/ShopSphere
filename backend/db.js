const mysql = require('mysql2/promise');
const logger = require('./config/logger');

// This file is deprecated - use config/database.js instead
logger.warn('⚠️  db.js is deprecated. Please use config/database.js');

module.exports = require('./config/database').pool;
