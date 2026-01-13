const db = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');


// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, rating, reviewText } = req.body;
        const userId = req.user.id;
        const processedRating = rating || 0;

        // At least rating or comment must be provided
        if (processedRating === 0 && (!reviewText || !reviewText.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Please provide either a rating or a comment'
            });
        }

        let reviewImage = null;

        // Upload image to Cloudinary if exists
        if (req.file) {
            try {
                reviewImage = await uploadToCloudinary(req.file.buffer, 'product_reviews');
            } catch (err) {
                console.error('Cloudinary upload error:', err);
                return res.status(500).json({ success: false, message: 'Image upload failed' });
            }
        }

        // Insert new review
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, product_id, rating, review_text, review_image) VALUES (?, ?, ?, ?, ?)',
            [userId, productId, processedRating, reviewText || null, reviewImage]
        );

        res.status(201).json({
            success: true,
            message: 'Feedback added successfully',
            reviewId: result.insertId
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ status: 500, success: false, message: 'Internal server error' });
    }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const [reviews] = await db.query(
            `SELECT 
                r.id,
                r.user_id,
                r.rating,
                r.review_text,
                r.review_image,
                r.created_at,
                u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC`,
            [productId]
        );

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews'
        });
    }
};

// Get average rating for a product
const getProductRating = async (req, res) => {
    try {
        const { productId } = req.params;

        const [result] = await db.query(
            `SELECT 
                COALESCE(AVG(NULLIF(rating, 0)), 0) as average_rating,
                COUNT(*) as total_reviews,
                COUNT(CASE WHEN rating = 5 THEN 1 END) as count_5,
                COUNT(CASE WHEN rating = 4 THEN 1 END) as count_4,
                COUNT(CASE WHEN rating = 3 THEN 1 END) as count_3,
                COUNT(CASE WHEN rating = 2 THEN 1 END) as count_2,
                COUNT(CASE WHEN rating = 1 THEN 1 END) as count_1
            FROM reviews
            WHERE product_id = ?`,
            [productId]
        );

        res.json({
            success: true,
            averageRating: parseFloat(result[0].average_rating).toFixed(1),
            totalReviews: result[0].total_reviews,
            distribution: {
                5: result[0].count_5,
                4: result[0].count_4,
                3: result[0].count_3,
                2: result[0].count_2,
                1: result[0].count_1
            }
        });
    } catch (error) {
        console.error('Error fetching product rating:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product rating'
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.user.id;

        // Check ownership
        const [review] = await db.query(
            'SELECT id FROM reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (review.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        const processedRating = rating || 0;

        let reviewImage = null;
        if (req.file) {
            try {
                reviewImage = await uploadToCloudinary(req.file.buffer, 'product_reviews');
            } catch (err) {
                console.error('Cloudinary upload error:', err);
            }
        }

        // Update review
        if (reviewImage) {
            await db.query(
                'UPDATE reviews SET rating = ?, review_text = ?, review_image = ? WHERE id = ?',
                [processedRating, reviewText || null, reviewImage, reviewId]
            );
        } else {
            await db.query(
                'UPDATE reviews SET rating = ?, review_text = ? WHERE id = ?',
                [processedRating, reviewText || null, reviewId]
            );
        }


        res.json({
            success: true,
            message: 'Feedback updated successfully'
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update feedback'
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        // Check if review belongs to user
        const [review] = await db.query(
            'SELECT id FROM reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (review.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        // Delete review
        await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
};

// Check if user has reviewed a product
const checkUserReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const [review] = await db.query(
            'SELECT id, rating, review_text, review_image FROM reviews WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({
            success: true,
            hasReviewed: review.length > 0,
            review: review.length > 0 ? review[0] : null
        });
    } catch (error) {
        console.error('Error checking user review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check user review'
        });
    }
};

module.exports = {
    addReview,
    getProductReviews,
    getProductRating,
    updateReview,
    deleteReview,
    checkUserReview
};
