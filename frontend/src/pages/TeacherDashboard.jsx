import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, getClasses } from '../services/api';
import '../App.css';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesRes = await getCourses();
      setCourses(coursesRes.data);
      const classesRes = await getClasses();
      setClasses(classesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const upcomingClasses = classes.filter(c => new Date(c.scheduledTime) > new Date());

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-brand">Remote<span>Classroom</span></span>
        <div className="navbar-links">
          <Link to="/courses"><button>My Courses</button></Link>
          <Link to="/teacher-classes"><button>My Classes</button></Link>
          <Link to="/schedule"><button>Schedule Class</button></Link>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-container">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: 'white', padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
          <h1 style={{ margin: 0, fontSize: '26px' }}>Teacher Dashboard</h1>
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
            <h2 style={{ color: '#2dc653' }}>{classes.length}</h2>
            <p>Classes Scheduled</p>
          </div>
          <div className="stat-card" style={{ borderTopColor: '#f77f00' }}>
            <h2 style={{ color: '#f77f00' }}>{upcomingClasses.length}</h2>
            <p>Upcoming Classes</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Upcoming Classes */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>Upcoming Classes</h3>
              <Link to="/teacher-classes" style={{ color: '#4361ee', fontSize: '14px', fontWeight: 600 }}>View All</Link>
            </div>
            {upcomingClasses.length === 0 ? (
              <p style={{ color: '#888' }}>No upcoming classes scheduled.</p>
            ) : (
              upcomingClasses.slice(0, 3).map(cls => (
                <div key={cls._id} style={{ borderLeft: '4px solid #4361ee', padding: '10px 14px', marginBottom: '10px', background: '#f8f9ff', borderRadius: '6px' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{cls.title}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>Course: {cls.course?.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4361ee' }}>{new Date(cls.scheduledTime).toLocaleString()}</p>
                  {cls.meetLink && (
                    <a href={cls.meetLink} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#2dc653', fontWeight: 600 }}>Join Meet</a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* My Courses */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>My Courses</h3>
              <Link to="/courses" style={{ color: '#4361ee', fontSize: '14px', fontWeight: 600 }}>View All</Link>
            </div>
            {courses.length === 0 ? (
              <p style={{ color: '#888' }}>No courses yet.</p>
            ) : (
              courses.slice(0, 4).map(course => (
                <div key={course._id} style={{ padding: '10px', marginBottom: '8px', background: '#f0f2f5', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{course.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{course.description?.slice(0, 60)}...</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/schedule"><button className="btn btn-blue">+ Schedule Class</button></Link>
            <Link to="/courses"><button className="btn btn-green">My Courses</button></Link>
            <Link to="/teacher-classes"><button className="btn btn-orange">View All Classes</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
