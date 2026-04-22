import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    return <h2 style={{ padding: '20px' }}>Invalid user data in localStorage</h2>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const teacherLinks = [
    { path: '/teacher-dashboard', label: 'Teacher Dashboard', icon: '🏫', desc: 'Manage your classroom' },
    { path: '/courses', label: 'My Courses', icon: '📚', desc: 'View and manage courses' },
    { path: '/schedule-class', label: 'Schedule Class', icon: '🗓️', desc: 'Create a new class session' },
    { path: '/teacher-classes', label: 'My Classes', icon: '🎬', desc: 'View all your classes' },
    { path: '/assignments', label: 'Assignments', icon: '📝', desc: 'Create and manage assignments' },
    { path: '/materials', label: 'Materials', icon: '📂', desc: 'Upload course materials' },
    { path: '/chat', label: 'Class Chat', icon: '💬', desc: 'Chat with students' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', desc: 'View your notifications' },
  ];

  const studentLinks = [
    { path: '/student-dashboard', label: 'Student Dashboard', icon: '🏠', desc: 'Your learning overview' },
    { path: '/courses', label: 'My Courses', icon: '📚', desc: 'View enrolled courses' },
    { path: '/student-classes', label: 'Upcoming Classes', icon: '🎬', desc: 'View scheduled classes' },
    { path: '/assignments', label: 'Assignments', icon: '📝', desc: 'View your assignments' },
    { path: '/materials', label: 'Study Materials', icon: '📂', desc: 'Access course materials' },
    { path: '/chat', label: 'Class Chat', icon: '💬', desc: 'Chat with classmates' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', desc: 'View your notifications' },
  ];

  const adminLinks = [
    { path: '/admin-dashboard', label: 'Admin Dashboard', icon: '🛡️', desc: 'Full system overview' },
    { path: '/courses', label: 'Manage Courses', icon: '📚', desc: 'Add, edit, delete courses' },
    { path: '/assignments', label: 'Manage Assignments', icon: '📝', desc: 'Create and delete assignments' },
    { path: '/materials', label: 'Manage Materials', icon: '📁', desc: 'Upload and delete materials' },
    { path: '/schedule-class', label: 'Schedule Class', icon: '🗓️', desc: 'Create and delete class sessions' },
    { path: '/teacher-classes', label: 'All Classes', icon: '📅', desc: 'View all class sessions' },
    { path: '/chat', label: 'Class Chat', icon: '💬', desc: 'Chat with all users' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', desc: 'View and send notifications' },
  ];

    const links = isAdmin ? adminLinks : (isTeacher ? teacherLinks : studentLinks);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Segoe UI, sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700 }}>{user?.name?.charAt(0) || 'U'}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Welcome, {user?.name || 'User'}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user?.role || 'user'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ padding: '0.3rem 0.8rem', background: isTeacher ? 'rgba(102,126,234,0.2)' : 'rgba(52,211,153,0.2)', border: `1px solid ${isTeacher ? 'rgba(102,126,234,0.4)' : 'rgba(52,211,153,0.4)'}`, borderRadius: '20px', fontSize: '0.8rem', color: isTeacher ? '#a78bfa' : '#6ee7b7', textTransform: 'capitalize' }}>{user?.role}</span>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1.2rem', background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)', borderRadius: '8px', color: '#ff6b6b', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))', backdropFilter: 'blur(10px)', border: '1px solid rgba(102,126,234,0.2)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {isTeacher ? '🏫' : '🏠'} {isTeacher ? 'Teacher' : 'Student'} Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            {isTeacher ? 'Manage your classes, students, assignments and materials.' : 'Access your classes, assignments and study materials.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', minWidth: '120px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>0</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Active Courses</div>
            </div>
            <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', minWidth: '120px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>0</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Classes Today</div>
            </div>
            <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', minWidth: '120px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>0</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Assignments</div>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {links.map(link => (
            <div key={link.path} onClick={() => navigate(link.path)}
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.25s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(102,126,234,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.7rem' }}>{link.icon}</div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '1rem' }}>{link.label}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: 0 }}>{link.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
