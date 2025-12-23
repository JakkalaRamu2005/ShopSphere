const db = require('../db');

// Get all addresses for user
exports.getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const [addresses] = await db.execute(
            'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [userId]
        );

        res.json({ success: true, addresses });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
    }
};

// Add new address
exports.addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

        // Validate required fields
        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            await db.execute(
                'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
                [userId]
            );
        }

        const [result] = await db.execute(
            `INSERT INTO addresses (user_id, full_name, phone, address_line1, address_line2, city, state, pincode, is_default)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, fullName, phone, addressLine1, addressLine2 || null, city, state, pincode, isDefault || false]
        );

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addressId: result.insertId
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ success: false, message: 'Failed to add address' });
    }
};

// Update address
exports.updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

        // Check if address belongs to user
        const [existing] = await db.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            await db.execute(
                'UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
                [userId, id]
            );
        }

        await db.execute(
            `UPDATE addresses 
             SET full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?, 
                 city = ?, state = ?, pincode = ?, is_default = ?
             WHERE id = ? AND user_id = ?`,
            [fullName, phone, addressLine1, addressLine2 || null, city, state, pincode, isDefault || false, id, userId]
        );

        res.json({ success: true, message: 'Address updated successfully' });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ success: false, message: 'Failed to update address' });
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [result] = await db.execute(
            'DELETE FROM addresses WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete address' });
    }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Check if address belongs to user
        const [existing] = await db.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // Unset all defaults
        await db.execute(
            'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
            [userId]
        );

        // Set new default
        await db.execute(
            'UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        res.json({ success: true, message: 'Default address updated successfully' });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ success: false, message: 'Failed to set default address' });
    }
};
