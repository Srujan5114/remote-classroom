const Material = require('../models/Material');

exports.getMaterials = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = courseId ? { course: courseId } : {};
    const materials = await Material.find(filter)
      .populate('course', 'title')
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { title, description, fileUrl, fileName, course, uploadedBy, type } = req.body;
    const material = new Material({ title, description, fileUrl, fileName, course, uploadedBy, type });
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await Material.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
