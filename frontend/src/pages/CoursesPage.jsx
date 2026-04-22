import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCourse, getCourses, updateCourse, deleteCourse } from '../services/api';
import '../App.css';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  // Admin has all teacher + student privileges
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await updateCourse(editId, form);
        setEditId(null);
      } else {
        await createCourse(form);
      }
      setForm({ title: '', description: '' });
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditId(course._id);
    setForm({ title: course.title, description: course.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>Remote Classroom</h1>
        <nav>
          {user?.role === 'teacher' && <Link to="/teacher-dashboard">Dashboard</Link>}
          {user?.role === 'student' && <Link to="/student-dashboard">Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="content">
        <div className="page-header">
          <h2>Courses</h2>
          {isTeacherOrAdmin && (
            <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', description: '' }); }}>
              {showForm ? 'Cancel' : '+ Add Course'}
            </button>
          )}
        </div>

        {showForm && isTeacherOrAdmin && (
          <form onSubmit={handleSubmit} className="course-form">
            <h3>{editId ? 'Edit Course' : 'Create New Course'}</h3>
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Course Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update Course' : 'Create Course'}
            </button>
          </form>
        )}

        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                {course.teacher && (
                  <p className="course-teacher">Teacher: {course.teacher.name || course.teacher.email}</p>
                )}
                {isTeacherOrAdmin && (
                  <div className="course-actions">
                    <button onClick={() => handleEdit(course)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(course._id)} className="btn-delete">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
