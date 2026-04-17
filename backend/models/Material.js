const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['notes', 'presentation', 'assignment', 'other'], default: 'notes' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
