const { response } = require("express");
const db = require("../db");


exports.getCart = async (request, response) => {

    try {

        const userId = request.user.id;
        const [cartItems] = await db.execute('SELECT * FROM cart WHERE user_id =? ORDER BY created_at DESC', [userId]);
        return response.status(200).json({ cartItems });

    } catch (error) {
        console.error('Get cart error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }

}


exports.addToCart = async (request, response) => {

    try {

        const userId = request.user.id;
        const { product_id, title, price, image, category, quantity = 1 } = request.body;

        if (!product_id || !title || !price) {
            return response.status(400).json({ message: "Product ID, tittle, and price are required" });

        }

        const [existingItem] = await db.execute('SELECT * FROM cart WHERE user_id =? AND product_id=?', [userId, product_id]);

        if (existingItem.length > 0) {
            await db.execute(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id =? AND product_id=?', [quantity, userId, product_id]
            );
        } else {
            await db.execute('INSERT INTO cart (user_id, product_id, title, price, image, category, quantity) VALUES (?,?,?,?,?,?,?)',
                [userId, product_id, title, price, image, category, quantity]
            );
        }

        return response.status(200).json({ message: "Item added to cart successfully" });

    } catch (error) {
        console.error('Added to cart error:', error);
        return response.status(200).json({ message: "Internal server error" });
    }

}

exports.updateCartItem = async (request, response) => {

    try {
        const userId = request.user.id;

        const { product_id, quantity } = request.body;
        if (!product_id || quantity === undefined) {
            return response.status(400).json({ message: "Product ID and quantity are required" })
        }
        if (quantity <= 0) {
            await db.execute('DELETE FROM cart WHERE user_id =? AND product_id=?', [userId, product_id]);
        } else {
            await db.execute('UPDATE cart SET quantity =? WHERE user_id =? AND product_id=?', [quantity, userId, product_id]);
        }

        return response.status(200).json({ message: "Cart updated successfully" });

    } catch (error) {
        console.error('Update cart error:', error);
        return response.status(500).json({ message: "Interval server error" });
    }

}


exports.removeFromCart = async (request, response) => {

    try {
        const userId = request.user.id;
        const { product_id } = request.params;

        await db.execute('DELETE FROM cart WHERE user_id=? AND product_id=?', [userId, product_id]);

        return response.status(200).json({ message: "Item removed from cart successfully" })

    } catch (error) {
        console.log('Remove from cart error:', error);
        return response.status(500).json({ message: "Interval server error" });
    }

}


exports.clearCart = async (request, response) => {
    try {
        const userId = request.user.id;
        await db.execute('DELETE FROM cart WHERE user_id=?', [userId]);
        return response.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error('Clear cart error', error);
        return response.status(500).json({ message: "interval server error" });
    }
}