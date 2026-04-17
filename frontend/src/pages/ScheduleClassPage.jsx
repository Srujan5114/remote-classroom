import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createClass } from '../services/api';
import '../App.css';

export default function ScheduleClassPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course: '',
    title: '',
    scheduledTime: '',
    duration: '',
    meetingLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const payload = { ...form, teacher: user?.id };
      await createClass(payload);
      setSuccess('Class scheduled successfully!');
      setForm({ course: '', title: '', scheduledTime: '', duration: '', meetingLink: '' });
      setTimeout(() => navigate('/teacher-classes'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule class.');
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
          <Link to="/teacher-dashboard"><button>Dashboard</button></Link>
          <Link to="/teacher-classes"><button>My Classes</button></Link>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-container">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 className="page-title">Schedule a Class</h1>

          <div className="form-card">
            {success && (
              <div style={{ background: '#d3f9d8', color: '#2b8a3e', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #b2f2bb' }}>
                {success}
              </div>
            )}
            {error && (
              <div className="auth-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course</label>
                <select name="course" value={form.course} onChange={handleChange} required>
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Class Title</label>
                <input
                  name="title"
                  placeholder="Enter class title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={form.scheduledTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  placeholder="e.g. 60"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Meeting Link (Google Meet / Zoom)</label>
                <input
                  name="meetingLink"
                  placeholder="https://meet.google.com/..."
                  value={form.meetingLink}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Scheduling...' : 'Schedule Class'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
