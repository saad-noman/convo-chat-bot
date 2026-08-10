const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

// Send a message to the chatbot
router.post('/', chatController.sendMessage);

module.exports = router;