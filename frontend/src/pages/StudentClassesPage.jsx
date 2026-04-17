import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClasses, markAttendance } from '../services/api';
import '../App.css';

export default function StudentClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markedClasses, setMarkedClasses] = useState([]);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {}

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await getClasses();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinAndAttend = async (cls) => {
    if (cls.meetingLink) {
      window.open(cls.meetingLink, '_blank');
    }
    if (!markedClasses.includes(cls._id)) {
      try {
        setLoading(true);
        await markAttendance({ sessionId: cls._id, studentId: user?.id });
        setMarkedClasses(prev => [...prev, cls._id]);
      } catch (err) {
        console.error('Attendance error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const now = new Date();
  const upcoming = classes.filter(c => new Date(c.scheduledTime) > now);
  const past = classes.filter(c => new Date(c.scheduledTime) <= now);

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-brand">Remote<span>Classroom</span></span>
        <div className="navbar-links">
          <Link to="/student-dashboard"><button>Dashboard</button></Link>
          <Link to="/courses"><button>Courses</button></Link>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-container">
        <h1 className="page-title">My Classes</h1>

        {/* Upcoming Classes */}
        <h2 style={{ fontSize: '18px', color: '#1a1a2e', marginBottom: '14px' }}>Upcoming Classes</h2>
        {upcoming.length === 0 ? (
          <div className="card" style={{ marginBottom: '24px', textAlign: 'center', padding: '30px' }}>
            <p style={{ color: '#888' }}>No upcoming classes.</p>
          </div>
        ) : (
          upcoming.map(cls => (
            <div key={cls._id} className="card" style={{ marginBottom: '14px', borderLeft: '4px solid #4361ee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', color: '#1a1a2e' }}>{cls.title}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#555' }}>
                    <strong>Course:</strong> {cls.course?.title}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#555' }}>
                    <strong>Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                    <strong>Duration:</strong> {cls.duration} minutes
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  {markedClasses.includes(cls._id) ? (
                    <span className="badge badge-green">Attendance Marked</span>
                  ) : (
                    <button
                      className="btn btn-blue"
                      onClick={() => handleJoinAndAttend(cls)}
                      disabled={loading}
                    >
                      {loading ? 'Joining...' : 'Join & Mark Attendance'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Past Classes */}
        <h2 style={{ fontSize: '18px', color: '#1a1a2e', margin: '24px 0 14px 0' }}>Past Classes</h2>
        {past.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: '#888' }}>No past classes.</p>
          </div>
        ) : (
          past.map(cls => (
            <div key={cls._id} className="card" style={{ marginBottom: '14px', borderLeft: '4px solid #adb5bd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', color: '#666' }}>{cls.title}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#888' }}>
                    <strong>Course:</strong> {cls.course?.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                    <strong>Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}
                  </p>
                </div>
                <span className="badge badge-blue">Completed</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
