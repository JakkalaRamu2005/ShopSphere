<<<<<<< HEAD
const db = require("../db");
const { sendOrderConfirmationEmail } = require('../services/emailService');
const { incrementCouponUsage } = require('./couponController');

exports.createOrder = async (request, response) => {
    try {
        const userId = request.user.id;
        const { shippingAddress, paymentMethod, cartItems, totalAmount, couponCode, discountAmount } = request.body;

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

        // Insert order into database with coupon info
        const [orderResult] = await db.execute(
            'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, order_status, coupon_code, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, totalAmount, JSON.stringify(normalizedAddress), paymentMethod, 'pending', couponCode || null, discountAmount || 0]
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

        // Increment coupon usage if coupon was used
        if (couponCode) {
            incrementCouponUsage(couponCode).catch(err =>
                console.error('Failed to increment coupon usage:', err)
            );
        }

        // Get user details for email
        const [users] = await db.execute('SELECT name, email FROM users WHERE id = ?', [userId]);
        const user = users[0];

        // Send order confirmation email (don't wait for it)
        if (user && user.email) {
            sendOrderConfirmationEmail(
                user.email,
                user.name || 'Customer',
                orderId,
                totalAmount,
                cartItems
            ).catch(err => console.error('Failed to send order confirmation email:', err));
        }

        return response.status(201).json({
            message: "Order placed successfully",
            orderId: orderId
        });

    } catch (error) {
        console.error('Create order error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};
=======
const db = require("../db");
const { sendOrderConfirmationEmail } = require('../services/emailService');
const { incrementCouponUsage } = require('./couponController');

exports.createOrder = async (request, response) => {
    try {
        const userId = request.user.id;
        const { shippingAddress, paymentMethod, cartItems, totalAmount, couponCode, discountAmount } = request.body;

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

        // Insert order into database with coupon info
        const [orderResult] = await db.execute(
            'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, order_status, coupon_code, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, totalAmount, JSON.stringify(normalizedAddress), paymentMethod, 'pending', couponCode || null, discountAmount || 0]
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

        // Increment coupon usage if coupon was used
        if (couponCode) {
            incrementCouponUsage(couponCode).catch(err =>
                console.error('Failed to increment coupon usage:', err)
            );
        }

        // Get user details for email
        const [users] = await db.execute('SELECT name, email FROM users WHERE id = ?', [userId]);
        const user = users[0];

        // Send order confirmation email (don't wait for it)
        if (user && user.email) {
            sendOrderConfirmationEmail(
                user.email,
                user.name || 'Customer',
                orderId,
                totalAmount,
                cartItems
            ).catch(err => console.error('Failed to send order confirmation email:', err));
        }

        return response.status(201).json({
            message: "Order placed successfully",
            orderId: orderId
        });

    } catch (error) {
        console.error('Create order error:', error);
        return response.status(500).json({ message: "Internal server error" });
    }
};
>>>>>>> master
