const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  markedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);