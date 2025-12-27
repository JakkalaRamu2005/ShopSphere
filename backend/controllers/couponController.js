const db = require('../db');

// Validate and apply coupon
exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || !orderAmount) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code and order amount are required'
            });
        }

        // Fetch coupon
        const [coupons] = await db.execute(
            `SELECT * FROM coupons WHERE code = ? AND is_active = TRUE`,
            [code.toUpperCase()]
        );

        if (coupons.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired coupon code'
            });
        }

        const coupon = coupons[0];

        // Check if coupon is still valid (date)
        const now = new Date();
        if (coupon.valid_until && new Date(coupon.valid_until) < now) {
            return res.status(400).json({
                success: false,
                message: 'This coupon has expired'
            });
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({
                success: false,
                message: 'This coupon has reached its usage limit'
            });
        }

        // Check minimum order amount
        if (orderAmount < coupon.min_order_amount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.min_order_amount} required`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (orderAmount * coupon.discount_value) / 100;
            // Apply max discount if set
            if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                discountAmount = coupon.max_discount_amount;
            }
        } else {
            discountAmount = coupon.discount_value;
        }

        // Ensure discount doesn't exceed order amount
        if (discountAmount > orderAmount) {
            discountAmount = orderAmount;
        }

        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                discountAmount: parseFloat(discountAmount.toFixed(2))
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate coupon'
        });
    }
};

// Get all coupons (Admin)
exports.getAllCoupons = async (req, res) => {
    try {
        const [coupons] = await db.query(
            `SELECT c.*, u.name as created_by_name 
             FROM coupons c
             LEFT JOIN users u ON c.created_by = u.id
             ORDER BY c.created_at DESC`
        );

        res.json({ success: true, coupons });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
    }
};

// Create coupon (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscountAmount,
            usageLimit,
            validUntil
        } = req.body;

        const createdBy = req.user.id;

        if (!code || !discountType || !discountValue) {
            return res.status(400).json({
                success: false,
                message: 'Code, discount type, and discount value are required'
            });
        }

        const [result] = await db.execute(
            `INSERT INTO coupons 
             (code, description, discount_type, discount_value, min_order_amount, 
              max_discount_amount, usage_limit, valid_until, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                code.toUpperCase(),
                description,
                discountType,
                discountValue,
                minOrderAmount || 0,
                maxDiscountAmount || null,
                usageLimit || null,
                validUntil || null,
                createdBy
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            couponId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }
        console.error('Create coupon error:', error);
        res.status(500).json({ success: false, message: 'Failed to create coupon' });
    }
};

// Update coupon (Admin)
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscountAmount,
            usageLimit,
            validUntil,
            isActive
        } = req.body;

        const [result] = await db.execute(
            `UPDATE coupons 
             SET description = ?, discount_type = ?, discount_value = ?,
                 min_order_amount = ?, max_discount_amount = ?, usage_limit = ?,
                 valid_until = ?, is_active = ?
             WHERE id = ?`,
            [
                description,
                discountType,
                discountValue,
                minOrderAmount || 0,
                maxDiscountAmount || null,
                usageLimit || null,
                validUntil || null,
                isActive !== undefined ? isActive : true,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({ success: true, message: 'Coupon updated successfully' });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ success: false, message: 'Failed to update coupon' });
    }
};

// Delete coupon (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM coupons WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete coupon' });
    }
};

// Increment coupon usage (called when order is placed)
exports.incrementCouponUsage = async (code) => {
    try {
        await db.execute(
            'UPDATE coupons SET used_count = used_count + 1 WHERE code = ?',
            [code]
        );
    } catch (error) {
        console.error('Increment coupon usage error:', error);
    }
};
