const db = require('../db');

/**
 * Get all categories with nested structure for mega menu
 * Returns categories organized in parent-child hierarchy
 */
const getCategoriesForMegaMenu = async (req, res) => {
    try {
        // Fetch all categories ordered by display_order
        const [categories] = await db.query(`
            SELECT 
                id,
                name,
                description,
                parent_id,
                icon_url,
                display_order,
                show_in_menu,
                (SELECT COUNT(*) FROM products WHERE category = categories.name) as product_count
            FROM categories
            WHERE show_in_menu = TRUE
            ORDER BY display_order ASC
        `);

        // Build nested structure
        const categoryMap = {};
        const rootCategories = [];

        // First pass: Create map of all categories
        categories.forEach(category => {
            categoryMap[category.id] = {
                ...category,
                subcategories: []
            };
        });

        // Second pass: Build hierarchy
        categories.forEach(category => {
            if (category.parent_id === null) {
                // This is a root category
                rootCategories.push(categoryMap[category.id]);
            } else {
                // This is a subcategory, add it to its parent
                if (categoryMap[category.parent_id]) {
                    categoryMap[category.parent_id].subcategories.push(categoryMap[category.id]);
                }
            }
        });

        res.status(200).json({
            success: true,
            categories: rootCategories
        });
    } catch (error) {
        console.error('Error fetching categories for mega menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

/**
 * Get category by ID with all its subcategories
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [categories] = await db.query(`
            SELECT 
                id,
                name,
                description,
                parent_id,
                icon_url,
                display_order,
                show_in_menu,
                (SELECT COUNT(*) FROM products WHERE category = categories.name) as product_count
            FROM categories
            WHERE id = ?
        `, [id]);

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Get all subcategories
        const [subcategories] = await db.query(`
            SELECT 
                id,
                name,
                description,
                parent_id,
                icon_url,
                display_order,
                (SELECT COUNT(*) FROM products WHERE category = categories.name) as product_count
            FROM categories
            WHERE parent_id = ?
            ORDER BY display_order ASC
        `, [id]);

        const category = {
            ...categories[0],
            subcategories
        };

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

/**
 * Get all root categories (for main navigation)
 */
const getRootCategories = async (req, res) => {
    try {
        const [categories] = await db.query(`
            SELECT 
                id,
                name,
                description,
                icon_url,
                display_order,
                (SELECT COUNT(*) FROM products WHERE category = categories.name) as product_count
            FROM categories
            WHERE parent_id IS NULL AND show_in_menu = TRUE
            ORDER BY display_order ASC
        `);

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching root categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

module.exports = {
    getCategoriesForMegaMenu,
    getCategoryById,
    getRootCategories
};
