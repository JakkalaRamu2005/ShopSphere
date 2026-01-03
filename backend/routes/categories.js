const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route   GET /categories/mega-menu
 * @desc    Get all categories with nested structure for mega menu
 * @access  Public
 */
router.get('/mega-menu', categoryController.getCategoriesForMegaMenu);

/**
 * @route   GET /categories/root
 * @desc    Get all root categories (main navigation)
 * @access  Public
 */
router.get('/root', categoryController.getRootCategories);

/**
 * @route   GET /categories/:id
 * @desc    Get category by ID with subcategories
 * @access  Public
 */
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
