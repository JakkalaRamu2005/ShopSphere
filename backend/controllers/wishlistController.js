const db = require("../db");

/**
 * Get all wishlist items for the authenticated user
 */
exports.getWishlist = async (request, response) => {
    try {
        const userId = request.user.id;

        const [wishlistItems] = await db.execute(
            'SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        return response.status(200).json({
            success: true,
            wishlistItems: wishlistItems,
            message: "Wishlist retrieved successfully"
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * Add item to wishlist
 */
exports.addToWishlist = async (request, response) => {
    try {
        const userId = request.user.id;
        const { product_id, title, price, image, category } = request.body;

        // Validate required fields
        if (!product_id || !title || !price) {
            return response.status(400).json({
                success: false,
                message: "Product ID, title, and price are required"
            });
        }

        // Check if item already exists in wishlist
        const [existing] = await db.execute(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existing.length > 0) {
            return response.status(400).json({
                success: false,
                message: "Item already in wishlist"
            });
        }

        // Add to wishlist
        await db.execute(
            'INSERT INTO wishlist (user_id, product_id, title, price, image, category) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, product_id, title, price, image || null, category || null]
        );

        return response.status(201).json({
            success: true,
            message: "Item added to wishlist successfully"
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * Remove item from wishlist
 */
exports.removeFromWishlist = async (request, response) => {
    try {
        const userId = request.user.id;
        const { product_id } = request.params;

        if (!product_id) {
            return response.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const [result] = await db.execute(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (result.affectedRows === 0) {
            return response.status(404).json({
                success: false,
                message: "Item not found in wishlist"
            });
        }

        return response.status(200).json({
            success: true,
            message: "Item removed from wishlist successfully"
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * Move item from wishlist to cart
 */
exports.moveToCart = async (request, response) => {
    try {
        const userId = request.user.id;
        const { product_id } = request.params;

        if (!product_id) {
            return response.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Get item from wishlist
        const [wishlistItem] = await db.execute(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (wishlistItem.length === 0) {
            return response.status(404).json({
                success: false,
                message: "Item not found in wishlist"
            });
        }

        const item = wishlistItem[0];

        // Check if item already exists in cart
        const [existingCartItem] = await db.execute(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existingCartItem.length > 0) {
            // Update quantity if already in cart
            await db.execute(
                'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?',
                [userId, product_id]
            );
        } else {
            // Add to cart
            await db.execute(
                'INSERT INTO cart (user_id, product_id, title, price, image, category, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, product_id, item.title, item.price, item.image, item.category, 1]
            );
        }

        // Remove from wishlist
        await db.execute(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        return response.status(200).json({
            success: true,
            message: "Item moved to cart successfully"
        });

    } catch (error) {
        console.error('Move to cart error:', error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * Clear entire wishlist
 */
exports.clearWishlist = async (request, response) => {
    try {
        const userId = request.user.id;

        await db.execute('DELETE FROM wishlist WHERE user_id = ?', [userId]);

        return response.status(200).json({
            success: true,
            message: "Wishlist cleared successfully"
        });

    } catch (error) {
        console.error('Clear wishlist error:', error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
