const express = require('express');
const router = express.Router();
const { createCourse, getCourses } = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.post('/', auth, createCourse);
router.get('/', getCourses);

module.exports = router;
