const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  deadline: Date,
  submissions: [
    {
      student_id: mongoose.Schema.Types.ObjectId,
      file_url: String,
      submitted_at: Date
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);