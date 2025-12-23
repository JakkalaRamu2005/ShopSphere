const express = require('express');
const router = express.Router();
const {
    validateCoupon,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controllers/couponController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Validate coupon (user)
router.post('/validate', verifyToken, validateCoupon);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllCoupons);
router.post('/', verifyToken, isAdmin, createCoupon);
router.put('/:id', verifyToken, isAdmin, updateCoupon);
router.delete('/:id', verifyToken, isAdmin, deleteCoupon);

module.exports = router;
