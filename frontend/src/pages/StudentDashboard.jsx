import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, getClasses, getStudentAttendance } from '../services/api';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(0);
  
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
      // Fetch courses
      const coursesRes = await getCourses();
      setCourses(coursesRes.data);

      // Fetch upcoming classes
      const classesRes = await getClasses();
      const now = new Date();
      const upcoming = classesRes.data.filter(cls =>
        new Date(cls.scheduledTime) > now
      );
      setUpcomingClasses(upcoming.slice(0, 3));
      
      // Fetch attendance
      const attendRes = await getStudentAttendance(user.id);
      setAttendance(attendRes.data);

      // Calculate attendance %
      if (classesRes.data.length > 0) {
        const percent = Math.round((attendRes.data.length / classesRes.data.length) * 100);
        setAttendancePercent(percent);
      }
    } catch (error) {
      console.error('FETCH ERROR:', error);
    }
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '150px',
    textAlign: 'center'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', background: '#f5f6fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#007bff', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Student Dashboard</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Welcome back, {user?.name}</p>
        <p style={{ margin: '2px 0 0 0', opacity: 0.7, fontSize: '14px' }}>{user?.email} | {user?.college}</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, borderTop: '4px solid #007bff' }}>
          <h2 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{courses.length}</h2>
          <p style={{ margin: 0, color: '#666' }}>Total Courses</p>
        </div>
        <div style={{ ...cardStyle, borderTop: '4px solid #28a745' }}>
          <h2 style={{ margin: '0 0 5px 0', color: '#28a745' }}>{attendance.length}</h2>
          <p style={{ margin: 0, color: '#666' }}>Classes Attended</p>
        </div>
        <div style={{ ...cardStyle, borderTop: '4px solid #ffc107' }}>
          <h2 style={{ margin: '0 0 5px 0', color: '#ffc107' }}>{upcomingClasses.length}</h2>
          <p style={{ margin: 0, color: '#666' }}>Upcoming Classes</p>
        </div>
        <div style={{ ...cardStyle, borderTop: '4px solid #dc3545' }}>
          <h2 style={{ margin: '0 0 5px 0', color: attendancePercent >= 75 ? '#28a745' : '#dc3545' }}>{attendancePercent}%</h2>
          <p style={{ margin: 0, color: '#666' }}>Attendance</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Upcoming Classes */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Upcoming Classes</h3>
            <Link to="/student-classes" style={{ color: '#007bff', fontSize: '14px' }}>View All</Link>
          </div>
          {upcomingClasses.length === 0 ? (
            <p style={{ color: '#666' }}>No upcoming classes</p>
          ) : (
            upcomingClasses.map(cls => (
              <div key={cls._id} style={{ borderLeft: '4px solid #007bff', padding: '10px', marginBottom: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{cls.title}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>Course: {cls.course?.title}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#007bff' }}>{new Date(cls.scheduledTime).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {/* Attendance History */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Attendance History</h3>
            <span style={{ background: attendancePercent >= 75 ? '#28a745' : '#dc3545', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '13px' }}>{attendancePercent}%</span>
          </div>

          {/* Progress Bar */}
          <div style={{ background: '#e9ecef', borderRadius: '10px', height: '10px', marginBottom: '15px' }}>
            <div style={{ background: attendancePercent >= 75 ? '#28a745' : '#dc3545', width: `${attendancePercent}%`, height: '10px', borderRadius: '10px', transition: 'width 0.5s' }} />
          </div>

          {attendance.length === 0 ? (
            <p style={{ color: '#666' }}>No attendance records yet</p>
          ) : (
            attendance.slice(0, 4).map((att, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>{att.session?.title || 'Class'}</p>
                <span style={{ background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>Present</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Courses */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>My Courses</h3>
          <Link to="/courses" style={{ color: '#007bff', fontSize: '14px' }}>View All</Link>
        </div>
        {courses.length === 0 ? (
          <p style={{ color: '#666' }}>No courses available</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {courses.slice(0, 4).map(course => (
              <div key={course._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: '#f8f9fa' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{course.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{course.description?.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/student-classes">
            <button style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Join Live Class</button>
          </Link>
          <Link to="/courses">
            <button style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Browse Courses</button>
          </Link>
        </div>
      </div>

    </div>
  );
}
