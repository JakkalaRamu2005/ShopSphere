const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    toggleUserStatus,
    getAnalytics
} = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// All routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// ============================================
// PRODUCT MANAGEMENT ROUTES
// ============================================
router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);

// ============================================
// ANALYTICS ROUTES
// ============================================
router.get('/analytics', getAnalytics);

module.exports = router;
