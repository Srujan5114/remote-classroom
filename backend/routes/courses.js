const express = require('express');
const router = express.Router();
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Anyone authenticated can view courses
router.get('/', auth, getCourses);

// Only teacher or admin can create a course
router.post('/', auth, authorizeRoles('teacher', 'admin'), createCourse);

// Only teacher (owner) or admin can update a course
router.put('/:id', auth, authorizeRoles('teacher', 'admin'), updateCourse);

// Only teacher (owner) or admin can delete a course
router.delete('/:id', auth, authorizeRoles('teacher', 'admin'), deleteCourse);

module.exports = router;
