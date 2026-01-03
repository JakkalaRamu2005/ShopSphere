const { pool } = require('../config/database');
const logger = require('../config/logger');

/**
 * Base Repository - Provides common database operations
 * All specific repositories should extend this class
 */
class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
        this.pool = pool;
    }

    /**
     * Find all records with optional conditions
     */
    async findAll(conditions = {}, options = {}) {
        try {
            let query = `SELECT * FROM ${this.tableName}`;
            const params = [];

            // Add WHERE conditions
            if (Object.keys(conditions).length > 0) {
                const whereClause = Object.keys(conditions)
                    .map(key => `${key} = ?`)
                    .join(' AND ');
                query += ` WHERE ${whereClause}`;
                params.push(...Object.values(conditions));
            }

            // Add ORDER BY
            if (options.orderBy) {
                query += ` ORDER BY ${options.orderBy}`;
                if (options.order) {
                    query += ` ${options.order}`;
                }
            }

            // Add LIMIT and OFFSET
            if (options.limit) {
                query += ` LIMIT ?`;
                params.push(options.limit);
            }
            if (options.offset) {
                query += ` OFFSET ?`;
                params.push(options.offset);
            }

            const [rows] = await this.pool.query(query, params);

            logger.debug(`FindAll executed on ${this.tableName}`, {
                conditions,
                rowCount: rows.length
            });

            return rows;
        } catch (error) {
            logger.error(`Error in findAll for ${this.tableName}:`, {
                error: error.message,
                conditions
            });
            throw error;
        }
    }

    /**
     * Find a single record by ID
     */
    async findById(id) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} WHERE id = ?`,
                [id]
            );

            logger.debug(`FindById executed on ${this.tableName}`, { id });
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error in findById for ${this.tableName}:`, {
                error: error.message,
                id
            });
            throw error;
        }
    }

    /**
     * Find one record by conditions
     */
    async findOne(conditions) {
        try {
            const whereClause = Object.keys(conditions)
                .map(key => `${key} = ?`)
                .join(' AND ');

            const [rows] = await this.pool.query(
                `SELECT * FROM ${this.tableName} WHERE ${whereClause}`,
                Object.values(conditions)
            );

            logger.debug(`FindOne executed on ${this.tableName}`, { conditions });
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error in findOne for ${this.tableName}:`, {
                error: error.message,
                conditions
            });
            throw error;
        }
    }

    /**
     * Create a new record
     */
    async create(data) {
        try {
            const [result] = await this.pool.query(
                `INSERT INTO ${this.tableName} SET ?`,
                [data]
            );

            logger.info(`Record created in ${this.tableName}`, {
                id: result.insertId
            });

            return result.insertId;
        } catch (error) {
            logger.error(`Error in create for ${this.tableName}:`, {
                error: error.message,
                data
            });
            throw error;
        }
    }

    /**
     * Update a record by ID
     */
    async update(id, data) {
        try {
            const [result] = await this.pool.query(
                `UPDATE ${this.tableName} SET ? WHERE id = ?`,
                [data, id]
            );

            logger.info(`Record updated in ${this.tableName}`, {
                id,
                affectedRows: result.affectedRows
            });

            return result.affectedRows > 0;
        } catch (error) {
            logger.error(`Error in update for ${this.tableName}:`, {
                error: error.message,
                id,
                data
            });
            throw error;
        }
    }

    /**
     * Delete a record by ID
     */
    async delete(id) {
        try {
            const [result] = await this.pool.query(
                `DELETE FROM ${this.tableName} WHERE id = ?`,
                [id]
            );

            logger.info(`Record deleted from ${this.tableName}`, {
                id,
                affectedRows: result.affectedRows
            });

            return result.affectedRows > 0;
        } catch (error) {
            logger.error(`Error in delete for ${this.tableName}:`, {
                error: error.message,
                id
            });
            throw error;
        }
    }

    /**
     * Count records with optional conditions
     */
    async count(conditions = {}) {
        try {
            let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
            const params = [];

            if (Object.keys(conditions).length > 0) {
                const whereClause = Object.keys(conditions)
                    .map(key => `${key} = ?`)
                    .join(' AND ');
                query += ` WHERE ${whereClause}`;
                params.push(...Object.values(conditions));
            }

            const [rows] = await this.pool.query(query, params);
            return rows[0].count;
        } catch (error) {
            logger.error(`Error in count for ${this.tableName}:`, {
                error: error.message,
                conditions
            });
            throw error;
        }
    }

    /**
     * Execute raw query
     */
    async executeQuery(query, params = []) {
        try {
            const [rows] = await this.pool.query(query, params);
            return rows;
        } catch (error) {
            logger.error(`Error executing query on ${this.tableName}:`, {
                error: error.message,
                query: query.substring(0, 100)
            });
            throw error;
        }
    }
}

module.exports = BaseRepository;
