const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const materialController = require('../controllers/materialController');

// Get all materials for a course
router.get('/course/:courseId', auth, materialController.getMaterialsByCourse);

// Upload a material
router.post('/', auth, materialController.uploadMaterial);

// Delete a material
router.delete('/:id', auth, materialController.deleteMaterial);

// Download / get single material
router.get('/:id', auth, materialController.getMaterialById);

module.exports = router;
