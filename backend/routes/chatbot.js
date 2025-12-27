const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatbotController');

// POST /chatbot/message - Send message to chatbot
router.post('/message', chatWithBot);

module.exports = router;
