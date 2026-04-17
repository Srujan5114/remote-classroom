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

    return res.status(201).json({
      message: 'Class scheduled successfully',
      classSession: newClass
    });
  } catch (error) {
    console.error('CREATE CLASS ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllClassSessions = async (req, res) => {
  try {
    const classes = await ClassSession.find()
      .populate('course', 'title')
      .populate('teacher', 'name email role')
      .sort({ scheduledTime: 1 });

    return res.status(200).json(classes);
  } catch (error) {
    console.error('GET CLASSES ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};