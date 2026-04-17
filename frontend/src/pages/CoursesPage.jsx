import React, { useEffect, useState } from 'react';
import { createCourse, getCourses } from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  console.log('USER FROM LOCALSTORAGE:', user);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (error) {
      console.error('GET COURSES ERROR:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('CURRENT USER:', user);

      await createCourse({
        ...form,
        teacher: user?.id
      });

      setForm({
        title: '',
        description: ''
      });

      fetchCourses();
    } catch (error) {
      console.error('CREATE COURSE ERROR:', error);
      console.log('Backend message:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Courses</h1>

      {user?.role === 'teacher' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            name="title"
            placeholder="Course Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <br /><br />

          <textarea
            name="description"
            placeholder="Course Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <br /><br />

          <button type="submit">Create Course</button>
        </form>
      )}

      <h2>Available Courses</h2>

      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course._id} style={{ marginBottom: '15px' }}>
              <strong>{course.title}</strong><br />
              {course.description}<br />
              Teacher: {course.teacher?.name || 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}