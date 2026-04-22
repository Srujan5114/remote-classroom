const express = require('express');
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions
} = require('../controllers/assignmentController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// All authenticated users can view assignments
router.get('/', auth, getAssignments);

// Only teacher or admin can create an assignment
router.post('/', auth, authorizeRoles('teacher', 'admin'), createAssignment);

// Only teacher or admin can delete an assignment
router.delete('/:id', auth, authorizeRoles('teacher', 'admin'), deleteAssignment);

// Students (and admin) can submit an assignment
router.post('/:id/submit', auth, authorizeRoles('student', 'admin'), submitAssignment);

// Teacher or admin can view submissions
router.get('/:id/submissions', auth, authorizeRoles('teacher', 'admin'), getSubmissions);

module.exports = router;
