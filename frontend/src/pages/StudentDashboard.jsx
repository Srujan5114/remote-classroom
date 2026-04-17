import React from 'react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Dashboard</h1>
      <p>Access your courses, live classes, assignments, and recorded lectures.</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/courses">
          <button>View Courses</button>
        </Link>

        <button style={{ marginLeft: '10px' }}>Join Live Class</button>
        <button style={{ marginLeft: '10px' }}>Assignments</button>
        <button style={{ marginLeft: '10px' }}>Recorded Lectures</button>
      </div>
    </div>
  );
}