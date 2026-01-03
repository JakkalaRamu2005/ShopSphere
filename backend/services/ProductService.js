const { pool } = require('../config/database');
const logger = require('../config/logger');

/**
 * Product Service - Business logic for product operations
 */
class ProductService {
    /**
     * Get all products with optional filtering
     */
    async getAllProducts(filters = {}) {
        try {
            logger.info('Fetching all products', { filters });

            const query = `
        SELECT 
          id, title, description, price, category, 
          images, rating_rate, rating_count, stock, source
        FROM products
        ORDER BY id DESC
      `;

            const [products] = await pool.query(query);

            // Parse JSON images for each product
            const formattedProducts = products.map(product => ({
                ...product,
                images: this.parseImages(product.images)
            }));

            logger.info(`Successfully fetched ${formattedProducts.length} products`);
            return formattedProducts;

        } catch (error) {
            logger.error('Error in getAllProducts service:', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Get product by ID
     */
    async getProductById(productId) {
        try {
            logger.info('Fetching product by ID', { productId });

            const query = `
        SELECT 
          id, title, description, price, category,
          images, rating_rate, rating_count, stock, source
        FROM products
        WHERE id = ?
      `;

            const [products] = await pool.query(query, [productId]);

            if (products.length === 0) {
                logger.warn('Product not found', { productId });
                return null;
            }

            const product = {
                ...products[0],
                images: this.parseImages(products[0].images)
            };

            logger.info('Successfully fetched product', { productId });
            return product;

        } catch (error) {
            logger.error('Error in getProductById service:', {
                error: error.message,
                productId
            });
            throw error;
        }
    }

    /**
     * Get products by category
     */
    async getProductsByCategory(category) {
        try {
            logger.info('Fetching products by category', { category });

            const query = `
        SELECT 
          id, title, description, price, category,
          images, rating_rate, rating_count, stock, source
        FROM products
        WHERE category = ?
        ORDER BY id DESC
      `;

            const [products] = await pool.query(query, [category]);

            const formattedProducts = products.map(product => ({
                ...product,
                images: this.parseImages(product.images)
            }));

            logger.info(`Found ${formattedProducts.length} products in category`, { category });
            return formattedProducts;

        } catch (error) {
            logger.error('Error in getProductsByCategory service:', {
                error: error.message,
                category
            });
            throw error;
        }
    }

    /**
     * Search products by query
     */
    async searchProducts(searchQuery) {
        try {
            logger.info('Searching products', { searchQuery });

            const query = `
        SELECT 
          id, title, description, price, category,
          images, rating_rate, rating_count, stock, source
        FROM products
        WHERE title LIKE ? OR description LIKE ? OR category LIKE ?
        ORDER BY id DESC
        LIMIT 50
      `;

            const searchTerm = `%${searchQuery}%`;
            const [products] = await pool.query(query, [searchTerm, searchTerm, searchTerm]);

            const formattedProducts = products.map(product => ({
                ...product,
                images: this.parseImages(product.images)
            }));

            logger.info(`Search returned ${formattedProducts.length} products`, { searchQuery });
            return formattedProducts;

        } catch (error) {
            logger.error('Error in searchProducts service:', {
                error: error.message,
                searchQuery
            });
            throw error;
        }
    }

    /**
     * Helper method to parse images JSON
     */
    parseImages(imagesData) {
        try {
            if (!imagesData) {
                return ['https://via.placeholder.com/300x300?text=No+Image'];
            }

            if (typeof imagesData === 'string') {
                const parsed = JSON.parse(imagesData);
                return Array.isArray(parsed) && parsed.length > 0
                    ? parsed
                    : ['https://via.placeholder.com/300x300?text=No+Image'];
            }

            if (Array.isArray(imagesData)) {
                return imagesData.length > 0
                    ? imagesData
                    : ['https://via.placeholder.com/300x300?text=No+Image'];
            }

            return ['https://via.placeholder.com/300x300?text=No+Image'];

        } catch (error) {
            logger.warn('Error parsing images, using placeholder', {
                error: error.message,
                imagesData: typeof imagesData
            });
            return ['https://via.placeholder.com/300x300?text=No+Image'];
        }
    }
}

module.exports = new ProductService();
