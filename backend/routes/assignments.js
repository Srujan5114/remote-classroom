const express = require('express');
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  submitAssignment,
  getSubmissions
} = require('../controllers/assignmentController');

router.get('/', getAssignments);
router.post('/', createAssignment);
router.post('/:id/submit', submitAssignment);
router.get('/:id/submissions', getSubmissions);

module.exports = router;
