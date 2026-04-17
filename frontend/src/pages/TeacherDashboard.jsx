import React from 'react';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Teacher Dashboard</h1>
      <p>Manage courses, schedule classes, upload materials, and handle assignments.</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/courses">
          <button>My Courses</button>
        </Link>

        <button style={{ marginLeft: '10px' }}>Schedule Class</button>
        <button style={{ marginLeft: '10px' }}>Upload Materials</button>
        <button style={{ marginLeft: '10px' }}>Assignments</button>
      </div>
    </div>
  );
}