const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getAllCategories,
    searchProducts,
    getFeaturedProducts
} = require('../controllers/productController');

// Get all products with optional filters
// Query params: ?category=electronics&source=fakestore&minPrice=10&maxPrice=500&sort=price_asc
router.get('/', getAllProducts);

// Get all categories
router.get('/categories', getAllCategories);

// Get featured products (high ratings)
router.get('/featured', getFeaturedProducts);

// Search products
// Query params: ?q=laptop
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get single product by ID
router.get('/:id', getProductById);

module.exports = router;
