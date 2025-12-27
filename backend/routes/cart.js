const express = require('express');
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    getCart, addToCart, updateCartItem, removeFromCart, clearCart
} = require("../controllers/cartController");


router.use(verifyToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:product_id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;