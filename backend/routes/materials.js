const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const materialController = require('../controllers/materialController');

// Get all materials (all authenticated users)
router.get('/course/:courseId', auth, materialController.getMaterials);

// Upload a material (teacher or admin only)
router.post('/', auth, authorizeRoles('teacher', 'admin'), materialController.createMaterial);

// Delete a material (teacher or admin only)
router.delete('/:id', auth, authorizeRoles('teacher', 'admin'), materialController.deleteMaterial);

module.exports = router;
