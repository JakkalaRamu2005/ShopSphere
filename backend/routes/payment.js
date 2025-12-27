const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getPaymentHistory
} = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

// All routes require authentication
router.use(verifyToken);

// Create Razorpay order
router.post('/create-order', createOrder);

// Verify payment
router.post('/verify', verifyPayment);

// Get payment history
router.get('/history', getPaymentHistory);

module.exports = router;
