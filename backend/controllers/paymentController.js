const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;
        const userId = req.user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.json({
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            },
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        });
    }
};

// Verify Payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order_id
        } = req.body;

        const userId = req.user.id;

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment verified successfully

            // Update order payment status
            await db.query(
                `UPDATE orders 
                 SET payment_status = 'completed',
                     razorpay_order_id = ?,
                     razorpay_payment_id = ?,
                     razorpay_signature = ?
                 WHERE id = ? AND user_id = ?`,
                [razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, userId]
            );

            // Get order details
            const [orders] = await db.query(
                'SELECT * FROM orders WHERE id = ? AND user_id = ?',
                [order_id, userId]
            );

            if (orders.length > 0) {
                const order = orders[0];

                // Insert payment record
                await db.query(
                    `INSERT INTO payments 
                     (user_id, order_id, amount, currency, razorpay_order_id, 
                      razorpay_payment_id, razorpay_signature, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')`,
                    [userId, order_id, order.total_amount, 'INR',
                        razorpay_order_id, razorpay_payment_id, razorpay_signature]
                );
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                orderId: order_id
            });
        } else {
            // Payment verification failed
            await db.query(
                `UPDATE orders SET payment_status = 'failed' WHERE id = ? AND user_id = ?`,
                [order_id, userId]
            );

            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
};

// Get Payment History
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const [payments] = await db.query(
            `SELECT p.*, o.order_status, o.created_at as order_date
             FROM payments p
             JOIN orders o ON p.order_id = o.id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history'
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentHistory
};
