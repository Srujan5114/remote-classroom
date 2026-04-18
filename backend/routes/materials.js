const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const materialController = require('../controllers/materialController');

// Get all materials (optionally filtered by ?courseId=)
router.get('/course/:courseId', auth, materialController.getMaterials);

// Upload / create a material
router.post('/', auth, materialController.createMaterial);

// Delete a material
router.delete('/:id', auth, materialController.deleteMaterial);

module.exports = router;
