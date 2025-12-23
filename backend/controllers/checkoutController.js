const db = require("../db");

exports.createOrder = async (request, response) => {
    try {
        const userId = request.user.id;
        const { shippingAddress, paymentMethod, cartItems, totalAmount } = request.body;

        // Validate input
        if (!shippingAddress || !paymentMethod || !cartItems || !totalAmount) {
            return response.status(400).json({ message: "All fields are required" });
        }

        // Normalize shipping address format
        const normalizedAddress = {
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phoneNumber,
            address: `${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? ', ' + shippingAddress.addressLine2 : ''}`,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode
        };

        // Insert order into database
        const [orderResult] = await db.execute(
            'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, order_status) VALUES (?, ?, ?, ?, ?)',
            [userId, totalAmount, JSON.stringify(normalizedAddress), paymentMethod, 'pending']
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of cartItems) {
            await db.execute(
                'INSERT INTO order_items (order_id, product_id, title, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.id, item.title, item.price, item.quantity, item.image]
            );
        }

        // Clear user's cart after successful order
        await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

        return response.status(201).json({
            message: "Order placed successfully",
            orderId: orderId
        });

    } catch (error) {
        console.error('Create order error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};