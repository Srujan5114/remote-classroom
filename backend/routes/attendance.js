const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceBySession
} = require('../controllers/attendanceController');

router.post('/', markAttendance);
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/session/:sessionId', getAttendanceBySession);

module.exports = router;