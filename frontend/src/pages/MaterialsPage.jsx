import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', fileType: 'pdf', courseId: '' });
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTeacher = user.role === 'teacher' || user.role === 'admin';

  const fetchMaterials = async () => {
    try {
      const coursesRes = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allMaterials = [];
      for (const course of coursesRes.data) {
        try {
          const res = await axios.get(`http://localhost:5000/api/materials/course/${course._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allMaterials.push(...res.data);
        } catch {}
      }
      setMaterials(allMaterials);
      setCourses(coursesRes.data);
    } catch (err) {
      setError('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/materials', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ title: '', description: '', fileUrl: '', fileType: 'pdf', courseId: '' });
      fetchMaterials();
    } catch (err) {
      setError('Failed to upload material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterials();
    } catch (err) {
      setError('Failed to delete material');
    }
  };

  const fileTypeIcon = (type) => {
    const icons = { pdf: '📝', video: '🎥', image: '🖼️', link: '🔗', doc: '📄' };
    return icons[type] || '📂';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '2rem', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Study Materials</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{isTeacher ? 'Upload and manage course materials' : 'Access your course materials'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {isTeacher && (
              <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                {showForm ? 'Cancel' : '+ Upload Material'}
              </button>
            )}
            <button onClick={() => window.history.back()} style={{ padding: '0.7rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Back</button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: '#ff6b6b' }}>{error}</div>}

        {showForm && (
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Upload New Material</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Title *</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Course *</label>
                  <select value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} required
                    style={{ width: '100%', padding: '0.8rem', background: '#302b63', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>File URL / Link *</label>
                <input value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} required placeholder="https://drive.google.com/..."
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>File Type</label>
                  <select value={formData.fileType} onChange={e => setFormData({...formData, fileType: e.target.value})}
                    style={{ width: '100%', padding: '0.8rem', background: '#302b63', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="doc">Document</option>
                    <option value="link">Link</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Description</label>
                  <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Optional description"
                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button type="submit" style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Upload Material</button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>Loading materials...</div>
        ) : materials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No materials uploaded yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {materials.map(m => (
              <div key={m._id} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem', textAlign: 'center' }}>{fileTypeIcon(m.fileType)}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>{m.title}</h3>
                {m.description && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '0.8rem' }}>{m.description}</p>}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.4)', borderRadius: '20px', fontSize: '0.75rem', color: '#a78bfa', textTransform: 'uppercase' }}>{m.fileType}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '6px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Open</a>
                  {isTeacher && (
                    <button onClick={() => handleDelete(m._id)} style={{ padding: '0.5rem 1rem', background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
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

export default MaterialsPage;
