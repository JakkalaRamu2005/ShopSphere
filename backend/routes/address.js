const express = require('express');
const router = express.Router();
const {
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require('../controllers/addressController');
const verifyToken = require('../middleware/verifyToken');

// All routes require authentication
router.use(verifyToken);

// Get all addresses
router.get('/', getUserAddresses);

// Add new address
router.post('/', addAddress);

// Update address
router.put('/:id', updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

// Set default address
router.put('/:id/default', setDefaultAddress);

module.exports = router;
