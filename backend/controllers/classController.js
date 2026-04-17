const ClassSession = require('../models/ClassSession');

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

exports.updateClassSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledTime, duration, title, meetingLink } = req.body;

    const updatedClass = await ClassSession.findByIdAndUpdate(
      id,
      { scheduledTime, duration, title, meetingLink },
      { new: true }
    ).populate('course', 'title').populate('teacher', 'name email');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
