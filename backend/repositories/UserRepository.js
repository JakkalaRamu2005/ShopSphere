const BaseRepository = require('./BaseRepository');
const logger = require('../config/logger');

/**
 * User Repository - Database operations for users
 */
class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }

    /**
     * Find user by email
     */
    async findByEmail(email) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} WHERE email = ?`,
                [email]
            );

            return rows[0] || null;
        } catch (error) {
            logger.error('Error in findByEmail:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Find user by phone
     */
    async findByPhone(phone) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} WHERE phone = ?`,
                [phone]
            );

            return rows[0] || null;
        } catch (error) {
            logger.error('Error in findByPhone:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Find user by Google ID
     */
    async findByGoogleId(googleId) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} WHERE google_id = ?`,
                [googleId]
            );

            return rows[0] || null;
        } catch (error) {
            logger.error('Error in findByGoogleId:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Update user password
     */
    async updatePassword(userId, hashedPassword) {
        try {
            const [result] = await this.pool.query(
                `UPDATE ${this.tableName} SET password = ? WHERE id = ?`,
                [hashedPassword, userId]
            );

            logger.info('User password updated', { userId });
            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in updatePassword:', {
                error: error.message,
                userId
            });
            throw error;
        }
    }

    /**
     * Get all users with pagination
     */
    async getAllUsers(limit = 20, offset = 0) {
        try {
            const [rows] = await this.pool.query(
                `SELECT id, name, email, role, status, created_at 
         FROM ${this.tableName} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            return rows;
        } catch (error) {
            logger.error('Error in getAllUsers:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Update user status (active/blocked)
     */
    async updateStatus(userId, status) {
        try {
            const [result] = await this.pool.query(
                `UPDATE ${this.tableName} SET status = ? WHERE id = ?`,
                [status, userId]
            );

            logger.info('User status updated', { userId, status });
            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in updateStatus:', {
                error: error.message,
                userId,
                status
            });
            throw error;
        }
    }
}

module.exports = new UserRepository();
