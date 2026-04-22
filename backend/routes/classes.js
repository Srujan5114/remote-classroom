const express = require('express');
const router = express.Router();
const {
  createClassSession,
  getAllClassSessions,
  updateClassSession,
  deleteClassSession
} = require('../controllers/classController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// All authenticated users can view class sessions
router.get('/', auth, getAllClassSessions);

// Only teacher or admin can create a class session
router.post('/', auth, authorizeRoles('teacher', 'admin'), createClassSession);

// Only teacher or admin can update a class session
router.put('/:id', auth, authorizeRoles('teacher', 'admin'), updateClassSession);

// Only admin can delete a class session
router.delete('/:id', auth, authorizeRoles('teacher', 'admin'), deleteClassSession);

module.exports = router;
