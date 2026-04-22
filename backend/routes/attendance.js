const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceBySession
} = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Teacher or admin marks attendance
router.post('/', auth, authorizeRoles('teacher', 'admin'), markAttendance);

// Student can view their own attendance; admin can view all
router.get('/student/:studentId', auth, getAttendanceByStudent);

// Teacher or admin can view attendance for a session
router.get('/session/:sessionId', auth, authorizeRoles('teacher', 'admin'), getAttendanceBySession);

module.exports = router;
