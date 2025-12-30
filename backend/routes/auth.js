<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const bcrypt = require("bcrypt");


const { register, login, logout, getUserProfile, updateProfile, changePassword } = require('../controllers/authController');
const verifyToken = require("../middleware/verifyToken");

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes - require authentication
router.get('/profile', verifyToken, getUserProfile);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;


=======
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const bcrypt = require("bcrypt");


const { register, login, logout, getUserProfile, updateProfile, changePassword } = require('../controllers/authController');
const verifyToken = require("../middleware/verifyToken");

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes - require authentication
router.get('/profile', verifyToken, getUserProfile);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;


>>>>>>> master
