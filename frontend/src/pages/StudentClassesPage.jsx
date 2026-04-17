import React, { useEffect, useState } from 'react';
import { getClasses, markAttendance } from '../services/api';

export default function StudentClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markedClasses, setMarkedClasses] = useState([]);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Invalid user');
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('FETCH CLASSES ERROR:', error);
    }
  };

  const handleJoinClass = async (classId, meetingLink) => {
    if (!user || !user.id) {
      alert('❌ Please login first');
      return;
    }

    if (markedClasses.includes(classId)) {
      alert('⚠️ Attendance already marked for this class');
      window.open(meetingLink, '_blank');
      return;
    }

    setLoading(true);

    try {
      // Mark attendance with YOUR model fields (session, student)
      await markAttendance({
        session: classId,
        student: user.id
      });

      // Add to marked list
      setMarkedClasses([...markedClasses, classId]);

      // Open meeting
      window.open(meetingLink, '_blank');

      alert('✅ Attendance marked successfully! Joining class...');
    } catch (error) {
      console.error('ATTENDANCE ERROR:', error);
      if (error.response?.data?.message?.includes('already marked')) {
        alert('⚠️ Attendance already marked for this session');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Failed to mark attendance'));
      }
      // Still open meeting even if attendance fails
      window.open(meetingLink, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📺 Available Classes</h1>

      {user && (
        <div style={{ background: '#e7f3ff', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ margin: '0' }}>👤 Welcome, <strong>{user.name}</strong> ({user.role})</p>
        </div>
      )}

      {classes.length === 0 ? (
        <p style={{ color: '#666' }}>No classes scheduled yet</p>
      ) : (
        <div>
          {classes.map((cls) => (
            <div
              key={cls._id}
              style={{
                border: markedClasses.includes(cls._id) ? '2px solid green' : '1px solid #ddd',
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                background: markedClasses.includes(cls._id) ? '#f0fff4' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{cls.title}</h3>
                  <p><strong>📚 Course:</strong> {cls.course?.title || 'N/A'}</p>
                  <p><strong>👨‍🏫 Teacher:</strong> {cls.teacher?.name || 'N/A'}</p>
                  <p><strong>🕐 Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}</p>
                  <p><strong>⏱️ Duration:</strong> {cls.duration} minutes</p>
                  <p><strong>📍 Status:</strong> <span style={{ color: cls.status === 'live' ? 'green' : 'orange' }}>{cls.status}</span></p>
                </div>
                <button
                  onClick={() => handleJoinClass(cls._id, cls.meetingLink)}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: markedClasses.includes(cls._id) ? '#28a745' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginLeft: '20px'
                  }}
                >
                  {loading ? '⏳ Joining...' : markedClasses.includes(cls._id) ? '✅ Attended' : '📺 Join & Mark'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}