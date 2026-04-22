const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const teacher = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const course = new Course({
      title,
      description,
      teacher
    });

    await course.save();
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
