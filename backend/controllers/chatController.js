const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = courseId ? { course: courseId } : {};
    const messages = await Chat.find(filter)
      .populate('sender', 'name role')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { course, sender, senderName, senderRole, message } = req.body;
    const chat = new Chat({ course, sender, senderName, senderRole, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
