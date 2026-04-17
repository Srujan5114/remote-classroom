const mongoose = require('mongoose');

const classSessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    scheduledTime: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    meetingLink: {
      type: String,
      required: true,
      trim: true
    },
    recordingUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed'],
      default: 'scheduled'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassSession', classSessionSchema);