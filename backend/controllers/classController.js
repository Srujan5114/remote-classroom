const ClassSession = require('../models/ClassSession');

// Create a class session (Teacher or Admin)
exports.createClassSession = async (req, res) => {
  try {
    const { course, teacher, title, scheduledTime, duration, meetingLink } = req.body;

    if (!course || !teacher || !title || !scheduledTime || !duration || !meetingLink) {
      return res.status(400).json({ message: 'All class fields are required' });
    }

    const newClass = new ClassSession({
      course,
      teacher,
      title,
      scheduledTime,
      duration: Number(duration),
      meetingLink
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all class sessions (All authenticated users)
exports.getAllClassSessions = async (req, res) => {
  try {
    const classes = await ClassSession.find()
      .populate('course', 'title')
      .populate('teacher', 'name email');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a class session (Teacher or Admin)
exports.updateClassSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledTime, duration, title, meetingLink } = req.body;

    const updatedClass = await ClassSession.findByIdAndUpdate(
      id,
      { scheduledTime, duration, title, meetingLink },
      { new: true }
    ).populate('course', 'title').populate('teacher', 'name email');

    if (!updatedClass) return res.status(404).json({ message: 'Class session not found' });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a class session (Teacher or Admin)
exports.deleteClassSession = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ClassSession.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Class session not found' });
    res.json({ message: 'Class session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
