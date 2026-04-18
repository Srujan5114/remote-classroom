const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// Get messages (optionally filtered by ?courseId=)
router.get('/', auth, chatController.getMessages);

// Send a message
router.post('/', auth, chatController.sendMessage);

module.exports = router;
