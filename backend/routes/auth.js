const express = require('express');
const router = express.Router();
const {
	register,
	login,
	getProfile,
	updateProfile
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;