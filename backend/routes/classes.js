const express = require('express');
const router = express.Router();
const {
  createClassSession,
  getAllClassSessions,
  updateClassSession
} = require('../controllers/classController');

router.post('/', createClassSession);
router.get('/', getAllClassSessions);
router.put('/:id', updateClassSession);

module.exports = router;
