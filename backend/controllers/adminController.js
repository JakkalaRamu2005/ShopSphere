const db = require('../db');
const { sendOrderStatusUpdateEmail } = require('../services/emailService');

// ============================================
// PRODUCT MANAGEMENT
// ============================================

// Get all custom products
const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.*, u.name as created_by_name 
            FROM products p
            LEFT JOIN users u ON p.created_by = u.id
            ORDER BY p.created_at DESC
        `);

        // Parse images JSON for each product
        const productsWithImages = products.map(product => {
            let images = [];
            if (product.images) {
                try {
                    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch (e) {
                    console.error('Error parsing images JSON for product', product.id, e);
                    images = [];
                }
            }
            return {
                ...product,
                images: Array.isArray(images) ? images : []
            };
        });

        res.json({ success: true, products: productsWithImages });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

// Add new product
const addProduct = async (req, res) => {
    try {
        const { title, description, price, category, image, stock } = req.body;
        const createdBy = req.user.id;

        if (!title || !price) {
            return res.status(400).json({
                success: false,
                message: 'Title and price are required'
            });
        }

        // Convert image string to JSON array for images column
        let imagesJson = '[]';
        if (image) {
            // If image is a comma-separated string, split it; otherwise use as single item
            const imageArray = image.includes(',') ? image.split(',').map(url => url.trim()) : [image];
            imagesJson = JSON.stringify(imageArray);
        }

        const [result] = await db.query(
            `INSERT INTO products (title, description, price, category, images, stock, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, price, category, imagesJson, stock || 0, createdBy]
        );

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, image, stock } = req.body;

        // Convert image string to JSON array for images column
        let imagesJson = '[]';
        if (image) {
            // If image is a comma-separated string, split it; otherwise use as single item
            const imageArray = image.includes(',') ? image.split(',').map(url => url.trim()) : [image];
            imagesJson = JSON.stringify(imageArray);
        }

        const [result] = await db.query(
            `UPDATE products 
             SET title = ?, description = ?, price = ?, category = ?, images = ?, stock = ?
             WHERE id = ?`,
            [title, description, price, category, imagesJson, stock, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};

// ============================================
// ORDER MANAGEMENT
// ============================================

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.id, o.user_id, o.total_amount, o.shipping_address, 
                   o.payment_method, o.order_status, o.created_at, o.updated_at,
                   u.name as user_name, u.email as user_email,
                   COUNT(oi.id) as item_count
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id, o.user_id, o.total_amount, o.shipping_address, 
                     o.payment_method, o.order_status, o.created_at, o.updated_at,
                     u.name, u.email
            ORDER BY o.created_at DESC
        `);

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Get current order status and user info before updating
        const [orders] = await db.query(
            `SELECT o.order_status, u.email, u.name 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             WHERE o.id = ?`,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const oldStatus = orders[0].order_status;
        const userEmail = orders[0].email;
        const userName = orders[0].name;

        // Update order status
        const [result] = await db.query(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Send status update email (don't wait for it)
        if (userEmail && oldStatus !== status) {
            sendOrderStatusUpdateEmail(
                userEmail,
                userName || 'Customer',
                id,
                oldStatus,
                status
            ).catch(err => console.error('Failed to send status update email:', err));
        }

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
};

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT id, name, email, role, status, created_at,
                   (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
            FROM users
            ORDER BY created_at DESC
        `);

        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

// Block/Unblock user
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Prevent admin from blocking themselves
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot block yourself'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ success: false, message: 'Failed to update user status' });
    }
};

// ============================================
// ANALYTICS
// ============================================

// Get dashboard analytics
const getAnalytics = async (req, res) => {
    try {
        // Total sales
        const [salesResult] = await db.query(
            'SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM orders'
        );

        // Total orders
        const [ordersResult] = await db.query(
            'SELECT COUNT(*) as total_orders FROM orders'
        );

        // Total users
        const [usersResult] = await db.query(
            'SELECT COUNT(*) as total_users FROM users WHERE role = "user"'
        );

        // Total products
        const [productsResult] = await db.query(
            'SELECT COUNT(*) as total_products FROM products'
        );

        // Recent orders
        const [recentOrders] = await db.query(`
            SELECT o.id, o.total_amount, o.order_status, o.created_at, u.name as user_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        `);

        // Orders by status
        const [ordersByStatus] = await db.query(`
            SELECT order_status, COUNT(*) as count
            FROM orders
            GROUP BY order_status
        `);

        // Sales by month (last 6 months)
        const [salesByMonth] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(total_amount) as revenue,
                COUNT(*) as orders
            FROM orders
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        `);

        // Sales last 30 days (Daily)
        const [salesLast30Days] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                SUM(total_amount) as revenue,
                COUNT(*) as orders
            FROM orders
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
            ORDER BY date ASC
        `);

        // Sales by Category
        const [salesByCategory] = await db.query(`
            SELECT 
                p.category,
                COUNT(oi.id) as count,
                SUM(oi.price * oi.quantity) as revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.category
            ORDER BY revenue DESC
            LIMIT 6
        `);

        res.json({
            success: true,
            analytics: {
                totalSales: parseFloat(salesResult[0].total_sales),
                totalOrders: ordersResult[0].total_orders,
                totalUsers: usersResult[0].total_users,
                totalProducts: productsResult[0].total_products,
                recentOrders,
                ordersByStatus,
                salesByMonth,
                salesLast30Days,
                salesByCategory
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
    }
};

module.exports = {
    // Products
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    // Orders
    getAllOrders,
    updateOrderStatus,
    // Users
    getAllUsers,
    toggleUserStatus,
    // Analytics
    getAnalytics
};
