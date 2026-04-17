import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCourse, getCourses } from '../services/api';
import '../App.css';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

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
      await createCourse(form);
      setForm({ title: '', description: '' });
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-brand">Remote<span>Classroom</span></span>
        <div className="navbar-links">
          {user?.role === 'teacher' && <Link to="/teacher-dashboard"><button>Dashboard</button></Link>}
          {user?.role === 'student' && <Link to="/student-dashboard"><button>Dashboard</button></Link>}
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Courses</h1>
          {user?.role === 'teacher' && (
            <button className="btn btn-blue" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Course'}
            </button>
          )}
        </div>

        {/* Add Course Form */}
        {showForm && (
          <div className="form-card" style={{ marginBottom: '28px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1a1a2e' }}>Create New Course</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  name="title"
                  placeholder="Enter course title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter course description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#888', fontSize: '16px' }}>No courses available yet.</p>
            {user?.role === 'teacher' && (
              <button className="btn btn-blue" style={{ marginTop: '16px' }} onClick={() => setShowForm(true)}>Create First Course</button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {courses.map(course => (
              <div key={course._id} className="card" style={{ cursor: 'default' }}>
                <div style={{ borderLeft: '4px solid #4361ee', paddingLeft: '12px', marginBottom: '12px' }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#1a1a2e' }}>{course.title}</h3>
                </div>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                  {course.description || 'No description provided.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
