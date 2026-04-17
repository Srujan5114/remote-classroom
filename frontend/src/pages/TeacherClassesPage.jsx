import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClasses, updateClass } from '../services/api';
import '../App.css';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [liveClass, setLiveClass] = useState(null);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let parsedUser = null;
    try {
      parsedUser = JSON.parse(localStorage.getItem('user'));
    } catch (error) {}
    setUser(parsedUser);

    const fetchMyClasses = async () => {
      try {
        if (!parsedUser || !parsedUser.id) return;
        const response = await getClasses();
        const myClasses = response.data.filter(cls => {
          const teacherId = cls.teacher?._id || cls.teacher?.id;
          return teacherId === parsedUser.id || teacherId === parsedUser._id;
        });
        setClasses(myClasses);
      } catch (error) {
        console.error('FETCH ERROR:', error);
      }
    };
    fetchMyClasses();
  }, []);

  const handleStartClass = (classId, meetingLink) => {
    setLiveClass(classId);
    window.open(meetingLink, '_blank');
  };

  const handleEndClass = () => {
    setLiveClass(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEditClick = (cls) => {
    setEditingId(cls._id);
    setSaveMsg('');
    // Format scheduledTime for datetime-local input
    const dt = new Date(cls.scheduledTime);
    const formatted = dt.toISOString().slice(0, 16);
    setEditForm({
      title: cls.title,
      scheduledTime: formatted,
      duration: cls.duration,
      meetingLink: cls.meetingLink || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (classId) => {
    try {
      setSaving(true);
      setSaveMsg('');
      const updated = await updateClass(classId, editForm);
      // Update local state
      setClasses(prev => prev.map(c => c._id === classId ? updated.data : c));
      setEditingId(null);
      setSaveMsg('Class updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setSaveMsg('');
  };

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-brand">Remote<span>Classroom</span></span>
        <div className="navbar-links">
          <Link to="/teacher-dashboard"><button>Dashboard</button></Link>
          <Link to="/schedule"><button>Schedule Class</button></Link>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>My Scheduled Classes</h1>
          <Link to="/schedule"><button className="btn btn-blue">+ Schedule New Class</button></Link>
        </div>

        {/* Success/Error message */}
        {saveMsg && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            background: saveMsg.includes('success') ? '#d3f9d8' : '#ffe3e3',
            color: saveMsg.includes('success') ? '#2b8a3e' : '#c92a2a',
            border: `1px solid ${saveMsg.includes('success') ? '#b2f2bb' : '#ffb3b3'}`
          }}>
            {saveMsg}
          </div>
        )}

        {!user ? (
          <div className="card"><p style={{ color: '#e63946' }}>Please login first.</p></div>
        ) : classes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#888', fontSize: '16px', marginBottom: '16px' }}>No classes scheduled yet.</p>
            <Link to="/schedule"><button className="btn btn-blue">Schedule Your First Class</button></Link>
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls._id}
              className="card"
              style={{
                marginBottom: '16px',
                border: liveClass === cls._id ? '2px solid #2dc653' : '1px solid #e9ecef',
                background: liveClass === cls._id ? '#f0fff4' : 'white'
              }}
            >
              {editingId === cls._id ? (
                /* ===== EDIT MODE ===== */
                <div>
                  <h3 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>Edit Class</h3>
                  <div className="form-group">
                    <label>Class Title</label>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      name="scheduledTime"
                      value={editForm.scheduledTime}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Meeting Link</label>
                    <input
                      name="meetingLink"
                      value={editForm.meetingLink}
                      onChange={handleEditChange}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button
                      className="btn btn-green"
                      onClick={() => handleEditSave(cls._id)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="btn btn-red" onClick={handleEditCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ===== VIEW MODE ===== */
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, color: '#1a1a2e' }}>{cls.title}</h3>
                      <span className={`badge ${liveClass === cls._id ? 'badge-green' : 'badge-orange'}`}>
                        {liveClass === cls._id ? 'LIVE' : 'Scheduled'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 6px 0', color: '#555', fontSize: '14px' }}>
                      <strong>Course:</strong> {cls.course?.title}
                    </p>
                    <p style={{ margin: '0 0 6px 0', color: '#555', fontSize: '14px' }}>
                      <strong>Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}
                    </p>
                    <p style={{ margin: '0 0 6px 0', color: '#555', fontSize: '14px' }}>
                      <strong>Duration:</strong> {cls.duration} minutes
                    </p>
                    {cls.meetingLink && (
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        <strong>Meeting Link:</strong>{' '}
                        <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4361ee' }}>
                          {cls.meetingLink}
                        </a>
                      </p>
                    )}
                  </div>
                  <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {liveClass === cls._id ? (
                      <button onClick={() => handleEndClass()} className="btn btn-red">
                        End Class
                      </button>
                    ) : (
                      <button onClick={() => handleStartClass(cls._id, cls.meetingLink)} className="btn btn-green">
                        Start Class
                      </button>
                    )}
                    <button
                      onClick={() => handleEditClick(cls)}
                      className="btn"
                      style={{ background: '#4361ee', color: 'white' }}
                    >
                      Edit Timings
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
