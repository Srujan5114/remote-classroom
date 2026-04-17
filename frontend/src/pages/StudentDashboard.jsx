import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, getClasses, getStudentAttendance } from '../services/api';
import '../App.css';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const coursesRes = await getCourses();
      setCourses(coursesRes.data);
      const classesRes = await getClasses();
      const now = new Date();
      const upcoming = classesRes.data.filter(cls => new Date(cls.scheduledTime) > now);
      setUpcomingClasses(upcoming.slice(0, 3));
      const attendRes = await getStudentAttendance(user.id);
      setAttendance(attendRes.data);
      if (classesRes.data.length > 0) {
        const percent = Math.round((attendRes.data.length / classesRes.data.length) * 100);
        setAttendancePercent(percent);
      }
    } catch (error) {
      console.error('FETCH ERROR:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-brand">Remote<span>Classroom</span></span>
        <div className="navbar-links">
          <Link to="/student-classes"><button>My Classes</button></Link>
          <Link to="/courses"><button>Courses</button></Link>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-container">
        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: 'white', padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
          <h1 style={{ margin: 0, fontSize: '26px' }}>Student Dashboard</h1>
          <p style={{ margin: '6px 0 0 0', opacity: 0.85 }}>Welcome back, {user?.name}</p>
          <p style={{ margin: '3px 0 0 0', opacity: 0.6, fontSize: '13px' }}>{user?.email} &bull; {user?.college}</p>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards">
          <div className="stat-card">
            <h2 style={{ color: '#4361ee' }}>{courses.length}</h2>
            <p>Total Courses</p>
          </div>
          <div className="stat-card" style={{ borderTopColor: '#2dc653' }}>
            <h2 style={{ color: '#2dc653' }}>{attendance.length}</h2>
            <p>Classes Attended</p>
          </div>
          <div className="stat-card" style={{ borderTopColor: '#f77f00' }}>
            <h2 style={{ color: '#f77f00' }}>{upcomingClasses.length}</h2>
            <p>Upcoming Classes</p>
          </div>
          <div className="stat-card" style={{ borderTopColor: attendancePercent >= 75 ? '#2dc653' : '#e63946' }}>
            <h2 style={{ color: attendancePercent >= 75 ? '#2dc653' : '#e63946' }}>{attendancePercent}%</h2>
            <p>Attendance</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Upcoming Classes */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>Upcoming Classes</h3>
              <Link to="/student-classes" style={{ color: '#4361ee', fontSize: '14px', fontWeight: 600 }}>View All</Link>
            </div>
            {upcomingClasses.length === 0 ? (
              <p style={{ color: '#888' }}>No upcoming classes</p>
            ) : (
              upcomingClasses.map(cls => (
                <div key={cls._id} style={{ borderLeft: '4px solid #4361ee', padding: '10px 14px', marginBottom: '10px', background: '#f8f9ff', borderRadius: '6px' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{cls.title}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>Course: {cls.course?.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4361ee' }}>{new Date(cls.scheduledTime).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Attendance History */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>Attendance History</h3>
              <span className={`badge ${attendancePercent >= 75 ? 'badge-green' : 'badge-red'}`}>{attendancePercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${attendancePercent}%`, background: attendancePercent >= 75 ? '#2dc653' : '#e63946' }} />
            </div>
            {attendance.length === 0 ? (
              <p style={{ color: '#888', marginTop: '12px' }}>No attendance records yet</p>
            ) : (
              attendance.slice(0, 4).map((att, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f5' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>{att.session?.title || 'Class'}</p>
                  <span className="badge badge-green">Present</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Courses */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#1a1a2e' }}>My Courses</h3>
            <Link to="/courses" style={{ color: '#4361ee', fontSize: '14px', fontWeight: 600 }}>View All</Link>
          </div>
          {courses.length === 0 ? (
            <p style={{ color: '#888' }}>No courses available</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {courses.slice(0, 4).map(course => (
                <div key={course._id} style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '14px', background: '#f8f9ff' }}>
                  <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#1a1a2e' }}>{course.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{course.description?.slice(0, 60)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/student-classes"><button className="btn btn-blue">Join Live Class</button></Link>
            <Link to="/courses"><button className="btn btn-green">Browse Courses</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
