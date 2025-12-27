const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {createOrder} = require("../controllers/checkoutController");

router.use(verifyToken);

router.post('/create-order', createOrder);
module.exports = router;