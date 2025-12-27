const db = require("../db");

/**
 * Get all orders for the authenticated user
 * Returns orders with their items, sorted by most recent first
 */
exports.getUserOrders = async (request, response) => {
    try {
        const userId = request.user.id;

        // Fetch all orders for the user
        const [orders] = await db.execute(
            `SELECT 
                id, 
                total_amount, 
                shipping_address, 
                payment_method, 
                order_status, 
                created_at, 
                updated_at 
            FROM orders 
            WHERE user_id = ? 
            ORDER BY created_at DESC`,
            [userId]
        );

        // If no orders found
        if (orders.length === 0) {
            return response.status(200).json({
                success: true,
                orders: []
            });
        }

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await db.execute(
                    `SELECT 
                        product_id, 
                        title, 
                        price, 
                        quantity, 
                        image 
                    FROM order_items 
                    WHERE order_id = ?`,
                    [order.id]
                );

                return {
                    ...order,
                    // shipping_address is already an object from MySQL JSON type
                    shipping_address: order.shipping_address,
                    items: items
                };
            })
        );

        return response.status(200).json({
            success: true,
            orders: ordersWithItems
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        return response.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

/**
 * Get a specific order by ID
 * Only returns the order if it belongs to the authenticated user
 */
exports.getOrderById = async (request, response) => {
    try {
        const userId = request.user.id;
        const { orderId } = request.params;

        // Validate order ID
        if (!orderId) {
            return response.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Fetch the order
        const [orders] = await db.execute(
            `SELECT 
                id, 
                total_amount, 
                shipping_address, 
                payment_method, 
                order_status, 
                created_at, 
                updated_at 
            FROM orders 
            WHERE id = ? AND user_id = ?`,
            [orderId, userId]
        );

        // Check if order exists
        if (orders.length === 0) {
            return response.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const order = orders[0];

        // Fetch order items
        const [items] = await db.execute(
            `SELECT 
                product_id, 
                title, 
                price, 
                quantity, 
                image 
            FROM order_items 
            WHERE order_id = ?`,
            [orderId]
        );

        // Construct the response
        const orderDetails = {
            ...order,
            // shipping_address is already an object from MySQL JSON type
            shipping_address: order.shipping_address,
            items: items
        };

        return response.status(200).json({
            success: true,
            order: orderDetails
        });

    } catch (error) {
        console.error('Get order by ID error:', error);
        return response.status(500).json({
            success: false,
            message: "Failed to fetch order details"
        });
    }
};

/**
 * Get order statistics for the user
 * Returns total orders, total spent, and status breakdown
 */
exports.getOrderStats = async (request, response) => {
    try {
        const userId = request.user.id;

        // Get total orders and total amount spent
        const [stats] = await db.execute(
            `SELECT 
                COUNT(*) as total_orders,
                COALESCE(SUM(total_amount), 0) as total_spent
            FROM orders 
            WHERE user_id = ?`,
            [userId]
        );

        // Get order count by status
        const [statusBreakdown] = await db.execute(
            `SELECT 
                order_status,
                COUNT(*) as count
            FROM orders 
            WHERE user_id = ?
            GROUP BY order_status`,
            [userId]
        );

        return response.status(200).json({
            success: true,
            stats: {
                ...stats[0],
                statusBreakdown: statusBreakdown
            }
        });

    } catch (error) {
        console.error('Get order stats error:', error);
        return response.status(500).json({
            success: false,
            message: "Failed to fetch order statistics"
        });
    }
};

/**
 * Cancel an order
 * Users can only cancel orders that are in 'pending' or 'processing' status
 */
exports.cancelOrder = async (request, response) => {
    try {
        const userId = request.user.id;
        const { orderId } = request.params;

        // Validate order ID
        if (!orderId) {
            return response.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Fetch the order to check ownership and status
        const [orders] = await db.execute(
            'SELECT id, order_status FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (orders.length === 0) {
            return response.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const order = orders[0];

        // Check if order can be cancelled
        const cancellableStatuses = ['pending', 'processing'];
        if (!cancellableStatuses.includes(order.order_status)) {
            return response.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.order_status}. Only pending or processing orders can be cancelled.`
            });
        }

        // Update order status to cancelled
        await db.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            ['cancelled', orderId]
        );

        return response.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        return response.status(500).json({
            success: false,
            message: "Failed to cancel order"
        });
    }
};
