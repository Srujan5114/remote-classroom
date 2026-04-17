const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, teacher } = req.body;

    if (!title || !description || !teacher) {
      return res.status(400).json({ message: 'Title, description, and teacher are required' });
    }

    const course = new Course({
      title,
      description,
      teacher
    });

    await course.save();
    return res.status(201).json(course);
  } catch (error) {
    console.error('CREATE COURSE BACKEND ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    return res.json(courses);
  } catch (error) {
    console.error('GET COURSES BACKEND ERROR:', error);
    return res.status(500).json({ message: error.message });
  }
};