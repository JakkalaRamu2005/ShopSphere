
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const bcrypt = require("bcrypt");


const { register, login, googleLogin, logout, getUserProfile, updateProfile, changePassword, sendOtp, verifyOtp } = require('../controllers/authController');
const verifyToken = require("../middleware/verifyToken");

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);

// Protected routes - require authentication
router.get('/profile', verifyToken, getUserProfile);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;


