<<<<<<< HEAD
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require('../services/emailService');

async function findUserByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}


exports.register = async (request, response) => {
    try {
        const { name, email, password } = request.body;
        // console.log(request.body);
        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return response.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name || null, email, hashedPassword]

        );

        // Send welcome email (don't wait for it to complete)
        sendWelcomeEmail(email, name || 'User').catch(err =>
            console.error('Failed to send welcome email:', err)
        );

        return response.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }

}

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        console.log('Generated JWT for user', user.id, ':', token);

        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        })
        return response.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }

};


exports.logout = (request, response) => {
    response.clearCookie('token');
    return response.status(200).json({ message: "Logout successful" });
}

/**
 * Get user profile information
 */
exports.getUserProfile = async (request, response) => {
    try {
        const userId = request.user.id;

        const [rows] = await db.execute(
            'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return response.status(404).json({ message: "User not found" });
        }

        return response.status(200).json({
            success: true,
            user: rows[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update user profile (name and email)
 */
exports.updateProfile = async (request, response) => {
    try {
        const userId = request.user.id;
        const { name, email } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Email is required" });
        }

        // Check if email is already taken by another user
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
        );

        if (existingUsers.length > 0) {
            return response.status(400).json({ message: "Email already in use" });
        }

        // Update user profile
        await db.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name || null, email, userId]
        );

        // Fetch updated user data
        const [rows] = await db.execute(
            'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
            [userId]
        );

        return response.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Change user password
 */
exports.changePassword = async (request, response) => {
    try {
        const userId = request.user.id;
        const { currentPassword, newPassword } = request.body;

        if (!currentPassword || !newPassword) {
            return response.status(400).json({
                message: "Current password and new password are required"
            });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return response.status(400).json({
                message: "New password must be at least 6 characters long"
            });
        }

        // Get current user
        const [users] = await db.execute(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return response.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        return response.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error('Change password error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
=======
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require('../services/emailService');

async function findUserByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}


exports.register = async (request, response) => {
    try {
        const { name, email, password } = request.body;
        // console.log(request.body);
        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return response.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name || null, email, hashedPassword]

        );

        // Send welcome email (don't wait for it to complete)
        sendWelcomeEmail(email, name || 'User').catch(err =>
            console.error('Failed to send welcome email:', err)
        );

        return response.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }

}

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        console.log('Generated JWT for user', user.id, ':', token);

        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        })
        return response.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }

};


exports.logout = (request, response) => {
    response.clearCookie('token');
    return response.status(200).json({ message: "Logout successful" });
}

/**
 * Get user profile information
 */
exports.getUserProfile = async (request, response) => {
    try {
        const userId = request.user.id;

        const [rows] = await db.execute(
            'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return response.status(404).json({ message: "User not found" });
        }

        return response.status(200).json({
            success: true,
            user: rows[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update user profile (name and email)
 */
exports.updateProfile = async (request, response) => {
    try {
        const userId = request.user.id;
        const { name, email } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Email is required" });
        }

        // Check if email is already taken by another user
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
        );

        if (existingUsers.length > 0) {
            return response.status(400).json({ message: "Email already in use" });
        }

        // Update user profile
        await db.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name || null, email, userId]
        );

        // Fetch updated user data
        const [rows] = await db.execute(
            'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
            [userId]
        );

        return response.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Change user password
 */
exports.changePassword = async (request, response) => {
    try {
        const userId = request.user.id;
        const { currentPassword, newPassword } = request.body;

        if (!currentPassword || !newPassword) {
            return response.status(400).json({
                message: "Current password and new password are required"
            });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return response.status(400).json({
                message: "New password must be at least 6 characters long"
            });
        }

        // Get current user
        const [users] = await db.execute(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return response.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        return response.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error('Change password error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
>>>>>>> master
};