const db = require('../db');

// Get all products (both admin and fakestore)
const getAllProducts = async (req, res) => {
    try {
        const { category, source, minPrice, maxPrice, sort } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        // Filter by category
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        // Filter by source (admin or fakestore)
        if (source) {
            query += ' AND source = ?';
            params.push(source);
        }

        // Filter by price range
        if (minPrice) {
            query += ' AND price >= ?';
            params.push(parseFloat(minPrice));
        }
        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(parseFloat(maxPrice));
        }

        // Sorting
        if (sort === 'price_asc') {
            query += ' ORDER BY price ASC';
        } else if (sort === 'price_desc') {
            query += ' ORDER BY price DESC';
        } else if (sort === 'rating') {
            query += ' ORDER BY rating_rate DESC';
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const [products] = await db.query(query, params);

        // Parse images if they are strings (ensure they are always arrays)
        const productsWithImages = products.map(product => {
            let images = [];
            if (product.images) {
                // Debug: Log the type and value of images
                console.log(`Product ${product.id} - images type:`, typeof product.images);
                console.log(`Product ${product.id} - images value:`, product.images);

                try {
                    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch (e) {
                    console.error('Error parsing images JSON for product', product.id, e);
                    // Fallback to treating as single string or empty
                    images = typeof product.images === 'string' ? [product.images] : [];
                }

                console.log(`Product ${product.id} - parsed images:`, images);
            }
            return {
                ...product,
                images: Array.isArray(images) ? images : []
            };
        });

        res.status(200).json({
            success: true,
            count: productsWithImages.length,
            products: productsWithImages
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = products[0];
        let images = [];
        if (product.images) {
            try {
                images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
            } catch (e) {
                images = [];
            }
        }
        product.images = Array.isArray(images) ? images : [];

        res.status(200).json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const [products] = await db.query(
            'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC',
            [category]
        );

        const productsWithImages = products.map(product => {
            let images = [];
            if (product.images) {
                try {
                    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch (e) { images = []; }
            }
            return { ...product, images: Array.isArray(images) ? images : [] };
        });

        res.status(200).json({
            success: true,
            count: productsWithImages.length,
            category,
            products: productsWithImages
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};

// Get all categories with product counts
const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY category'
        );

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchTerm = `%${q}%`;
        const [products] = await db.query(
            'SELECT * FROM products WHERE title LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY created_at DESC',
            [searchTerm, searchTerm, searchTerm]
        );

        const productsWithImages = products.map(product => {
            let images = [];
            if (product.images) {
                try {
                    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch (e) { images = []; }
            }
            return { ...product, images: Array.isArray(images) ? images : [] };
        });

        res.status(200).json({
            success: true,
            count: productsWithImages.length,
            searchQuery: q,
            products: productsWithImages
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
};

// Get featured products (high ratings)
const getFeaturedProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const [products] = await db.query(
            'SELECT * FROM products WHERE rating_rate >= 4.0 ORDER BY rating_rate DESC, rating_count DESC LIMIT ?',
            [limit]
        );

        const productsWithImages = products.map(product => {
            let images = [];
            if (product.images) {
                try {
                    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch (e) { images = []; }
            }
            return { ...product, images: Array.isArray(images) ? images : [] };
        });

        res.status(200).json({
            success: true,
            count: productsWithImages.length,
            products: productsWithImages
        });
    } catch (error) {
        console.error('Error fetching featured products:', error);
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
