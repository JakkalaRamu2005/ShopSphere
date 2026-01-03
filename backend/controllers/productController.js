const productService = require('../services/ProductService');
const logger = require('../config/logger');

/**
 * Get all products with optional filtering
 */
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query);

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        logger.error('Error in getAllProducts controller:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

/**
 * Get single product by ID
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        logger.error('Error in getProductById controller:', {
            error: error.message,
            productId: req.params.id
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

/**
 * Get products by category
 */
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await productService.getProductsByCategory(category);

        res.status(200).json({
            success: true,
            count: products.length,
            category,
            products
        });
    } catch (error) {
        logger.error('Error in getProductsByCategory controller:', {
            error: error.message,
            category: req.params.category
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};

/**
 * Get all categories with product counts
 */
const getAllCategories = async (req, res) => {
    try {
        const { pool } = require('../config/database');
        const [categories] = await pool.query(
            'SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY category'
        );

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        logger.error('Error in getAllCategories controller:', {
            error: error.message
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

/**
 * Search products
 */
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const products = await productService.searchProducts(q);

        res.status(200).json({
            success: true,
            count: products.length,
            searchQuery: q,
            products
        });
    } catch (error) {
        logger.error('Error in searchProducts controller:', {
            error: error.message,
            query: req.query.q
        });
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
};

/**
 * Get featured products (high ratings)
 */
const getFeaturedProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const { pool } = require('../config/database');

        const [products] = await pool.query(
            'SELECT * FROM products WHERE rating_rate >= 4.0 ORDER BY rating_rate DESC, rating_count DESC LIMIT ?',
            [limit]
        );

        const productsWithImages = products.map(product => ({
            ...product,
            images: productService.parseImages(product.images)
        }));

        res.status(200).json({
            success: true,
            count: productsWithImages.length,
            products: productsWithImages
        });
    } catch (error) {
        logger.error('Error in getFeaturedProducts controller:', {
            error: error.message
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getAllCategories,
    searchProducts,
    getFeaturedProducts
};
