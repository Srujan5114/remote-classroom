import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClasses } from '../services/api';
import '../App.css';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [liveClass, setLiveClass] = useState(null);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        if (!user || !user.id) return;
        const response = await getClasses();
        const myClasses = response.data.filter(cls => {
          const teacherId = cls.teacher?._id || cls.teacher?.id;
          return teacherId === user.id || teacherId === user._id;
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
                <div style={{ marginLeft: '20px' }}>
                  {liveClass === cls._id ? (
                    <button
                      onClick={() => handleEndClass()}
                      className="btn btn-red"
                    >
                      End Class
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartClass(cls._id, cls.meetingLink)}
                      className="btn btn-green"
                    >
                      Start Class
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
