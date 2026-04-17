const Assignment = require('../models/Assignment');

// Get all assignments (optionally by course)
exports.getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = courseId ? { course_id: courseId } : {};
    const assignments = await Assignment.find(filter).populate('course_id', 'title');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

// Create an assignment (Teacher)
exports.createAssignment = async (req, res) => {
  try {
    const { course_id, title, description, deadline } = req.body;
    const assignment = new Assignment({ course_id, title, description, deadline });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

// Submit assignment (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, file_url } = req.body;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    // Check if already submitted
    const alreadySubmitted = assignment.submissions.find(
      s => s.student_id.toString() === student_id
    );
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'Already submitted' });
    }
    assignment.submissions.push({ student_id, file_url, submitted_at: new Date() });
    await assignment.save();
    res.json({ message: 'Submitted successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

// Get submissions for an assignment (Teacher)
exports.getSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment.submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
