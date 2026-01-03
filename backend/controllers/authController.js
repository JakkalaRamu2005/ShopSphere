const authService = require('../services/AuthService');
const logger = require('../config/logger');
const { OAuth2Client } = require('google-auth-library');
const { sendWelcomeEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { pool } = require('../config/database');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Register new user
 */
exports.register = async (request, response) => {
    try {
        const { name, email, password, phone } = request.body;

        // Check if user already exists
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return response.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Create new user
        const userId = await authService.createUser({ name, email, password, phone });

        // Send welcome email (async, don't wait)
        sendWelcomeEmail(email, name).catch(err => {
            logger.error('Failed to send welcome email:', { error: err.message, email });
        });

        logger.info('User registered successfully', { userId, email });

        response.status(201).json({
            success: true,
            message: "User registered successfully",
            userId
        });
    } catch (error) {
        logger.error('Error in register controller:', {
            error: error.message,
            stack: error.stack
        });
        response.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

/**
 * Login user
 */
exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await authService.findUserByEmail(email);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isPasswordValid = await authService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }

        // Generate token
        const token = authService.generateToken(user);

        logger.info('User logged in successfully', { userId: user.id, email });

        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        return response.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        logger.error('Error in login controller:', {
            error: error.message,
            stack: error.stack
        });
        return response.status(500).json({ message: "Internal server error" });
    }
};

// Keep all other existing functions unchanged - just add logger where there's console.log
exports.googleLogin = async (request, response) => {
    try {
        const { credential } = request.body;

        if (!credential) {
            return response.status(400).json({ message: "Google credential is required" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        let user = await authService.findUserByEmail(email);

        if (!user) {
            await pool.execute(
                'INSERT INTO users (name, email, google_id, profile_pic) VALUES (?, ?, ?, ?)',
                [name, email, googleId, picture]
            );
            user = await authService.findUserByEmail(email);
            sendWelcomeEmail(email, name).catch(err => logger.error('Welcome email error:', { error: err.message }));
        } else if (!user.google_id) {
            await pool.execute(
                'UPDATE users SET google_id = ?, profile_pic = ? WHERE id = ?',
                [googleId, picture, user.id]
            );
        }

        if (user.status === 'blocked') {
            return response.status(403).json({ message: "Your account has been blocked" });
        }

        const token = authService.generateToken(user);

        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        return response.status(200).json({
            success: true,
            message: "Google login successful",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                profilePic: picture
            }
        });

    } catch (error) {
        logger.error('Google login error:', { error: error.message });
        return response.status(500).json({ message: "Google authentication failed" });
    }
};

exports.logout = (request, response) => {
    response.clearCookie('token');
    return response.status(200).json({ message: "Logout successful" });
};

exports.getUserProfile = async (request, response) => {
    try {
        const userId = request.user.id;

        const [rows] = await pool.execute(
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
        logger.error('Get profile error:', { error: error.message });
        return response.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProfile = async (request, response) => {
    try {
        const userId = request.user.id;
        const { name, email } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Email is required" });
        }

        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
        );

        if (existingUsers.length > 0) {
            return response.status(400).json({ message: "Email already in use" });
        }

        await pool.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name || null, email, userId]
        );

        const [rows] = await pool.execute(
            'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
            [userId]
        );

        return response.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (error) {
        logger.error('Update profile error:', { error: error.message });
        return response.status(500).json({ message: "Internal server error" });
    }
};

exports.changePassword = async (request, response) => {
    try {
        const userId = request.user.id;
        const { currentPassword, newPassword } = request.body;

        if (!currentPassword || !newPassword) {
            return response.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return response.status(400).json({
                message: "New password must be at least 6 characters long"
            });
        }

        const [users] = await pool.execute(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return response.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await authService.verifyPassword(currentPassword, users[0].password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Current password is incorrect" });
        }

        await authService.changePassword(userId, newPassword);

        return response.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        logger.error('Change password error:', { error: error.message });
        return response.status(500).json({ message: "Internal server error" });
    }
};

exports.sendOtp = async (request, response) => {
    try {
        const { phoneNumber } = request.body;

        if (!phoneNumber || phoneNumber.length !== 10) {
            return response.status(400).json({ message: "Invalid phone number. Please provide a 10-digit number." });
        }

        const [userRows] = await pool.execute(
            'SELECT id, lastOtpRequest FROM users WHERE phoneNumber = ?',
            [phoneNumber]
        );

        const now = new Date();
        if (userRows.length > 0 && userRows[0].lastOtpRequest) {
            const lastRequest = new Date(userRows[0].lastOtpRequest);
            const diffSeconds = (now - lastRequest) / 1000;
            if (diffSeconds < 60) {
                return response.status(429).json({ message: `Please wait ${Math.ceil(60 - diffSeconds)} seconds before requesting another OTP.` });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(now.getTime() + 5 * 60000);

        await authService.storeOTP(phoneNumber, otp, expiry);

        try {
            await sendSMS(`+91${phoneNumber}`, `Your OTP for ShopSphere is ${otp}. Valid for 5 minutes.`);
        } catch (smsError) {
            logger.error('SMS Service Failed:', { error: smsError.message });
            return response.status(502).json({
                message: "Failed to send SMS. Please check server logs for details.",
                error: smsError.message
            });
        }

        return response.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        logger.error('Send OTP error:', { error: error.message });
        return response.status(500).json({ message: "Internal server error during OTP generation." });
    }
};

exports.verifyOtp = async (request, response) => {
    try {
        const { phoneNumber, otp } = request.body;

        if (!phoneNumber || !otp) {
            return response.status(400).json({ message: "Phone number and OTP are required" });
        }

        const isValid = await authService.verifyOTP(phoneNumber, otp);

        if (!isValid) {
            return response.status(401).json({ message: "Invalid or expired OTP" });
        }

        const user = await authService.findUserByPhone(phoneNumber);
        const token = authService.generateToken(user);

        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 1000 * 60
        });

        return response.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        logger.error('Verify OTP error:', { error: error.message });
        return response.status(500).json({ message: "OTP verification failed" });
    }
};
