import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  let user = null;

  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    return <h2 style={{ padding: '20px' }}>Invalid user data in localStorage</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <div style={{ marginTop: '20px' }}>
            <Link to="/courses">
              <button>Go to Courses</button>
            </Link>

            {user.role === 'teacher' && (
              <Link to="/schedule-class">
                <button style={{ marginLeft: '10px' }}>Schedule Class</button>
              </Link>
            )}

            {user.role === 'student' && (
              <Link to="/student-classes">
                <button style={{ marginLeft: '10px' }}>View Classes</button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <p>No logged in user found</p>
      )}
    </div>
  );
}