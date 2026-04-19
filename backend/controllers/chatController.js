const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const messages = await Chat.find({ course: courseId })
      .populate('sender', 'name role email')
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(messages);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { course, message } = req.body;

    if (!course || !message || !message.trim()) {
      return res.status(400).json({ message: 'Course and message are required' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chat = new Chat({
      course,
      sender: req.user.id || req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: message.trim()
    });

    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('sender', 'name role email');

    const io = req.app.get('io');
    if (io) {
      io.to(course.toString()).emit('receiveMessage', populatedChat);
    }

    res.status(201).json(populatedChat);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
