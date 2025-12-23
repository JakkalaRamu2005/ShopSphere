const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
    getUserOrders,
    getOrderById,
    getOrderStats
} = require("../controllers/orderController");

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /orders
 * @desc    Get all orders for authenticated user
 * @access  Private
 */
router.get('/', getUserOrders);

/**
 * @route   GET /orders/stats
 * @desc    Get order statistics for authenticated user
 * @access  Private
 */
router.get('/stats', getOrderStats);

/**
 * @route   GET /orders/:orderId
 * @desc    Get specific order details by ID
 * @access  Private
 */
router.get('/:orderId', getOrderById);

module.exports = router;
