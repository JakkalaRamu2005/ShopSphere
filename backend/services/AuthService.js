const { pool } = require('../config/database');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Auth Service - Business logic for authentication operations
 */
class AuthService {
    /**
     * Find user by email
     */
    async findUserByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = ?';
            const [users] = await pool.query(query, [email]);
            return users[0] || null;
        } catch (error) {
            logger.error('Error finding user by email:', {
                error: error.message,
                email
            });
            throw error;
        }
    }

    /**
     * Find user by phone
     */
    async findUserByPhone(phone) {
        try {
            const query = 'SELECT * FROM users WHERE phone = ?';
            const [users] = await pool.query(query, [phone]);
            return users[0] || null;
        } catch (error) {
            logger.error('Error finding user by phone:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Create new user
     */
    async createUser(userData) {
        try {
            logger.info('Creating new user', { email: userData.email });

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const query = `
        INSERT INTO users (name, email, password, phone, role)
        VALUES (?, ?, ?, ?, ?)
      `;

            const [result] = await pool.query(query, [
                userData.name,
                userData.email,
                hashedPassword,
                userData.phone || null,
                userData.role || 'user'
            ]);

            logger.info('User created successfully', {
                userId: result.insertId,
                email: userData.email
            });

            return result.insertId;

        } catch (error) {
            logger.error('Error creating user:', {
                error: error.message,
                email: userData.email
            });
            throw error;
        }
    }

    /**
     * Verify password
     */
    async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            logger.error('Error verifying password:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Generate JWT token
     */
    generateToken(user) {
        try {
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });

            logger.info('JWT token generated', { userId: user.id });
            return token;

        } catch (error) {
            logger.error('Error generating token:', {
                error: error.message,
                userId: user.id
            });
            throw error;
        }
    }

    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            logger.error('Error verifying token:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateUserProfile(userId, updates) {
        try {
            logger.info('Updating user profile', { userId });

            const query = `
        UPDATE users 
        SET name = ?, email = ?, phone = ?
        WHERE id = ?
      `;

            await pool.query(query, [
                updates.name,
                updates.email,
                updates.phone || null,
                userId
            ]);

            logger.info('User profile updated successfully', { userId });

        } catch (error) {
            logger.error('Error updating user profile:', {
                error: error.message,
                userId
            });
            throw error;
        }
    }

    /**
     * Change user password
     */
    async changePassword(userId, newPassword) {
        try {
            logger.info('Changing user password', { userId });

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const query = 'UPDATE users SET password = ? WHERE id = ?';
            await pool.query(query, [hashedPassword, userId]);

            logger.info('Password changed successfully', { userId });

        } catch (error) {
            logger.error('Error changing password:', {
                error: error.message,
                userId
            });
            throw error;
        }
    }

    /**
     * Store OTP
     */
    async storeOTP(phone, otp, expiresAt) {
        try {
            const query = `
        INSERT INTO otps (phone, otp, expires_at)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?
      `;

            await pool.query(query, [phone, otp, expiresAt, otp, expiresAt]);

            logger.info('OTP stored successfully', { phone });

        } catch (error) {
            logger.error('Error storing OTP:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Verify OTP
     */
    async verifyOTP(phone, otp) {
        try {
            const query = `
        SELECT * FROM otps 
        WHERE phone = ? AND otp = ? AND expires_at > NOW()
      `;

            const [otps] = await pool.query(query, [phone, otp]);

            if (otps.length > 0) {
                // Delete used OTP
                await pool.query('DELETE FROM otps WHERE phone = ?', [phone]);
                logger.info('OTP verified successfully', { phone });
                return true;
            }

            logger.warn('Invalid or expired OTP', { phone });
            return false;

        } catch (error) {
            logger.error('Error verifying OTP:', {
                error: error.message
            });
            throw error;
        }
    }
}

module.exports = new AuthService();
