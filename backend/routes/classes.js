const express = require('express');
const router = express.Router();
const {
  createClassSession,
  getAllClassSessions
} = require('../controllers/classController');

router.post('/', createClassSession);
router.get('/', getAllClassSessions);

module.exports = router;