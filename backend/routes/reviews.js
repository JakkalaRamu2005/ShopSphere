const express = require('express');
const router = express.Router();
const {
    addReview,
    getProductReviews,
    getProductRating,
    updateReview,
    deleteReview,
    checkUserReview
} = require('../controllers/reviewController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');


// Public routes - anyone can view reviews
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/rating', getProductRating);

// Protected routes - only authenticated users
router.post('/', verifyToken, upload.single('reviewImage'), addReview);
router.put('/:reviewId', verifyToken, upload.single('reviewImage'), updateReview);

router.delete('/:reviewId', verifyToken, deleteReview);
router.get('/check/:productId', verifyToken, checkUserReview);

module.exports = router;
