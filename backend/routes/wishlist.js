<<<<<<< HEAD
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist
} = require("../controllers/wishlistController");

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /wishlist
 * @desc    Get all wishlist items
 * @access  Private
 */
router.get("/", getWishlist);

/**
 * @route   POST /wishlist
 * @desc    Add item to wishlist
 * @access  Private
 */
router.post("/", addToWishlist);

/**
 * @route   DELETE /wishlist/:product_id
 * @desc    Remove item from wishlist
 * @access  Private
 */
router.delete("/:product_id", removeFromWishlist);

/**
 * @route   POST /wishlist/:product_id/move-to-cart
 * @desc    Move item from wishlist to cart
 * @access  Private
 */
router.post("/:product_id/move-to-cart", moveToCart);

/**
 * @route   DELETE /wishlist/clear
 * @desc    Clear entire wishlist
 * @access  Private
 */
router.delete("/clear/all", clearWishlist);

module.exports = router;
=======
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist
} = require("../controllers/wishlistController");

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /wishlist
 * @desc    Get all wishlist items
 * @access  Private
 */
router.get("/", getWishlist);

/**
 * @route   POST /wishlist
 * @desc    Add item to wishlist
 * @access  Private
 */
router.post("/", addToWishlist);

/**
 * @route   DELETE /wishlist/:product_id
 * @desc    Remove item from wishlist
 * @access  Private
 */
router.delete("/:product_id", removeFromWishlist);

/**
 * @route   POST /wishlist/:product_id/move-to-cart
 * @desc    Move item from wishlist to cart
 * @access  Private
 */
router.post("/:product_id/move-to-cart", moveToCart);

/**
 * @route   DELETE /wishlist/clear
 * @desc    Clear entire wishlist
 * @access  Private
 */
router.delete("/clear/all", clearWishlist);

module.exports = router;
>>>>>>> master
