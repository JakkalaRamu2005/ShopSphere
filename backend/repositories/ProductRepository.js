const BaseRepository = require('./BaseRepository');
const logger = require('../config/logger');

/**
 * Product Repository - Database operations for products
 */
class ProductRepository extends BaseRepository {
    constructor() {
        super('products');
    }

    /**
     * Find products with filters and pagination
     */
    async findWithFilters(filters = {}) {
        try {
            const { category, minPrice, maxPrice, search, limit = 20, offset = 0, orderBy = 'created_at', order = 'DESC' } = filters;

            let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
            const params = [];

            // Category filter
            if (category) {
                query += ' AND category = ?';
                params.push(category);
            }

            // Price range filter
            if (minPrice !== undefined) {
                query += ' AND price >= ?';
                params.push(minPrice);
            }
            if (maxPrice !== undefined) {
                query += ' AND price <= ?';
                params.push(maxPrice);
            }

            // Search filter
            if (search) {
                query += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            // Ordering
            query += ` ORDER BY ${orderBy} ${order}`;

            // Pagination
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const [rows] = await this.pool.query(query, params);

            logger.debug('Products fetched with filters', {
                filters,
                rowCount: rows.length
            });

            return rows;
        } catch (error) {
            logger.error('Error in findWithFilters:', {
                error: error.message,
                filters
            });
            throw error;
        }
    }

    /**
     * Find products by category
     */
    async findByCategory(category, options = {}) {
        try {
            const limit = options.limit || 20;
            const offset = options.offset || 0;

            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                [category, limit, offset]
            );

            return rows;
        } catch (error) {
            logger.error('Error in findByCategory:', {
                error: error.message,
                category
            });
            throw error;
        }
    }

    /**
     * Search products
     */
    async search(searchTerm, limit = 50) {
        try {
            const term = `%${searchTerm}%`;
            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} 
         WHERE title LIKE ? OR description LIKE ? OR category LIKE ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
                [term, term, term, limit]
            );

            return rows;
        } catch (error) {
            logger.error('Error in search:', {
                error: error.message,
                searchTerm
            });
            throw error;
        }
    }

    /**
     * Get featured products (high ratings)
     */
    async getFeatured(limit = 8) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} 
         WHERE rating_rate >= 4.0 
         ORDER BY rating_rate DESC, rating_count DESC 
         LIMIT ?`,
                [limit]
            );

            return rows;
        } catch (error) {
            logger.error('Error in getFeatured:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Get all categories with product counts
     */
    async getCategories() {
        try {
            const [rows] = await this.pool.query(
                `SELECT category, COUNT(*) as product_count 
         FROM ${this.tableName} 
         GROUP BY category 
         ORDER BY category`
            );

            return rows;
        } catch (error) {
            logger.error('Error in getCategories:', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Update product stock
     */
    async updateStock(productId, quantity) {
        try {
            const [result] = await this.pool.query(
                `UPDATE ${this.tableName} SET stock = stock + ? WHERE id = ?`,
                [quantity, productId]
            );

            logger.info('Product stock updated', {
                productId,
                quantity,
                affectedRows: result.affectedRows
            });

            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in updateStock:', {
                error: error.message,
                productId,
                quantity
            });
            throw error;
        }
    }
}

module.exports = new ProductRepository();
