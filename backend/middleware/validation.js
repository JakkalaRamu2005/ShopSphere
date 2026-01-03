const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Provides reusable validation rules for different routes
 */

// Helper function to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errors.array().map(err => ({
                    field: err.path || err.param,
                    message: err.msg,
                    value: err.value,
                })),
            },
        });
    }
    next();
};

// Auth Validations
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long')
        .escape(),
    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    validate,
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate,
];

const phoneLoginValidation = [
    body('phone')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    validate,
];

// Product Validations
const createProductValidation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters')
        .escape(),
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .escape(),
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    validate,
];

const updateProductValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid product ID'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters')
        .escape(),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    validate,
];

// Order Validations
const createOrderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*.productId')
        .isInt({ min: 1 })
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('shippingAddress')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Shipping address is required'),
    body('totalAmount')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a positive number'),
    validate,
];

// Review Validations
const createReviewValidation = [
    body('productId')
        .isInt({ min: 1 })
        .withMessage('Invalid product ID'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Comment must be between 10 and 500 characters')
        .escape(),
    validate,
];

// Address Validations
const addressValidation = [
    body('street')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Street address is required')
        .escape(),
    body('city')
        .trim()
        .isLength({ min: 2 })
        .withMessage('City is required')
        .escape(),
    body('state')
        .trim()
        .isLength({ min: 2 })
        .withMessage('State is required')
        .escape(),
    body('zipCode')
        .matches(/^[0-9]{6}$/)
        .withMessage('ZIP code must be 6 digits'),
    body('country')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Country is required')
        .escape(),
    body('phone')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    validate,
];

// Cart Validations
const addToCartValidation = [
    body('productId')
        .isInt({ min: 1 })
        .withMessage('Invalid product ID'),
    body('quantity')
        .isInt({ min: 1, max: 99 })
        .withMessage('Quantity must be between 1 and 99'),
    validate,
];

// Coupon Validations
const applyCouponValidation = [
    body('code')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters')
        .toUpperCase(),
    body('cartTotal')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Cart total must be a positive number'),
    validate,
];

// ID Parameter Validation
const idParamValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid ID parameter'),
    validate,
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    phoneLoginValidation,
    createProductValidation,
    updateProductValidation,
    createOrderValidation,
    createReviewValidation,
    addressValidation,
    addToCartValidation,
    applyCouponValidation,
    idParamValidation,
};
