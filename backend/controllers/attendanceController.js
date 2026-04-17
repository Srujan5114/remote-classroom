const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const { session, student } = req.body;

    if (!session || !student) {
      return res.status(400).json({ message: 'Session and student IDs required' });
    }

    // Check if already marked
    const existing = await Attendance.findOne({ session, student });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this session' });
    }

    const attendance = new Attendance({
      session,
      student,
      status: 'present'
    });

    await attendance.save();

    return res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('MARK ATTENDANCE ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendances = await Attendance.find({ student: studentId })
      .populate('session', 'title scheduledTime')
      .sort({ markedAt: -1 });

    return res.status(200).json(attendances);
  } catch (error) {
    console.error('GET ATTENDANCE ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const attendances = await Attendance.find({ session: sessionId })
      .populate('student', 'name email')
      .sort({ markedAt: -1 });

    return res.status(200).json(attendances);
  } catch (error) {
    console.error('GET SESSION ATTENDANCE ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};