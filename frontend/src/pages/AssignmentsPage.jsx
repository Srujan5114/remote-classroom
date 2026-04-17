import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', courseId: '' });
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTeacher = user.role === 'teacher';

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    if (isTeacher) fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/assignments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ title: '', description: '', dueDate: '', courseId: '' });
      fetchAssignments();
    } catch (err) {
      setError('Failed to create assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAssignments();
    } catch (err) {
      setError('Failed to delete assignment');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '2rem', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Assignments</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{isTeacher ? 'Manage your assignments' : 'View your assignments'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {isTeacher && (
              <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                {showForm ? 'Cancel' : '+ New Assignment'}
              </button>
            )}
            <button onClick={() => window.history.back()} style={{ padding: '0.7rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
              Back
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: '#ff6b6b' }}>{error}</div>}

        {showForm && (
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Create New Assignment</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Title *</label>
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Due Date *</label>
                  <input type="datetime-local" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required
                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', colorScheme: 'dark', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Course *</label>
                  <select value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} required
                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id} style={{ background: '#302b63' }}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Create Assignment</button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No assignments yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assignments.map(a => (
              <div key={a._id} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{a.title}</h3>
                    {a.description && <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.8rem', lineHeight: 1.5 }}>{a.description}</p>}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {a.course && <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.4)', borderRadius: '20px', fontSize: '0.8rem', color: '#a78bfa' }}>{a.course.name || 'Course'}</span>}
                      <span style={{ padding: '0.3rem 0.8rem', background: new Date(a.dueDate) < new Date() ? 'rgba(255,100,100,0.2)' : 'rgba(100,200,100,0.2)', border: `1px solid ${new Date(a.dueDate) < new Date() ? 'rgba(255,100,100,0.4)' : 'rgba(100,200,100,0.4)'}`, borderRadius: '20px', fontSize: '0.8rem', color: new Date(a.dueDate) < new Date() ? '#ff6b6b' : '#6bffa0' }}>
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {isTeacher && (
                    <button onClick={() => handleDelete(a._id)} style={{ padding: '0.4rem 0.9rem', background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer', marginLeft: '1rem', fontSize: '0.85rem' }}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
