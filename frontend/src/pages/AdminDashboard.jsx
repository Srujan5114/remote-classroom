import React from 'react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

export default function DashboardPage() {
  try {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      return <h2 style={{ padding: '20px' }}>Please login first</h2>;
    }

    if (user.role === 'student') return <StudentDashboard />;
    if (user.role === 'teacher') return <TeacherDashboard />;
    if (user.role === 'admin') return <AdminDashboard />;

    return <h2 style={{ padding: '20px' }}>Unknown user role</h2>;
  } catch (error) {
    return <h2 style={{ padding: '20px' }}>Dashboard error. Please login again.</h2>;
  }
}