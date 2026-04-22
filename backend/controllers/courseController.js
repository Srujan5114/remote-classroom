const Course = require('../models/Course');

// Create a new course (Teacher or Admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const teacher = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const course = new Course({ title, description, teacher });
    await course.save();
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all courses (All roles)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a course (Teacher who owns it or Admin)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Admin can update any course; teacher can only update their own
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a course (Teacher who owns it or Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Admin can delete any course; teacher can only delete their own
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
