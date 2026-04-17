import React, { useEffect, useState } from 'react';
import { getClasses } from '../services/api';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [liveClass, setLiveClass] = useState(null);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Invalid user');
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        if (!user || !user.id) {
          console.log('❌ No user logged in');
          return;
        }

        const response = await getClasses();
        console.log('✅ All classes fetched:', response.data);
        setAllClasses(response.data);

        console.log('👤 Current teacher user.id:', user.id);
        console.log('👤 Current teacher user._id:', user._id);

        // Try both user.id and user._id
        const myClasses = response.data.filter(cls => {
          const teacherId = cls.teacher._id || cls.teacher.id;
          const matches = teacherId === user.id || teacherId === user._id;
          console.log(`📌 Class "${cls.title}" - Teacher ID: ${teacherId}, User ID: ${user.id}, Match: ${matches}`);
          return matches;
        });

        console.log('🎯 Filtered my classes:', myClasses);
        setClasses(myClasses);
      } catch (error) {
        console.error('❌ FETCH ERROR:', error);
      }
    };

    fetchMyClasses();
  }, []);

  const handleStartClass = (classId, meetingLink) => {
    setLiveClass(classId);
    window.open(meetingLink, '_blank');
    alert('✅ Class started! Joining meeting room...');
  };

  const handleEndClass = (classId) => {
    setLiveClass(null);
    alert('✅ Class ended');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>👨‍🏫 My Scheduled Classes</h1>

      {user && (
        <div style={{ background: '#fff3cd', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ margin: '0' }}>👤 <strong>{user.name}</strong> (Teacher)</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>ID: {user.id}</p>
        </div>
      )}

      <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
        <p><strong>Debug Info:</strong></p>
        <p>Total classes in system: {allClasses.length}</p>
        <p>Your classes: {classes.length}</p>
        <p>User logged in: {user ? 'Yes' : 'No'}</p>
      </div>

      {!user ? (
        <p style={{ color: 'red' }}>❌ Please login first</p>
      ) : classes.length === 0 ? (
        <div>
          <p style={{ color: '#666' }}>No classes scheduled yet. <a href="/schedule-class">Schedule now</a></p>
          {allClasses.length > 0 && (
            <div style={{ background: '#ffe6e6', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
              <p><strong>⚠️ Note:</strong> There are {allClasses.length} classes in the system, but none match your teacher ID.</p>
              <p>Check the console (F12) to see the comparison details.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {classes.map((cls) => (
            <div
              key={cls._id}
              style={{
                border: liveClass === cls._id ? '3px solid #28a745' : '1px solid #ddd',
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                background: liveClass === cls._id ? '#f0fff4' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{cls.title}</h3>
                  <p><strong>📚 Course:</strong> {cls.course?.title}</p>
                  <p><strong>🕐 Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}</p>
                  <p><strong>⏱️ Duration:</strong> {cls.duration} minutes</p>
                  <p>
                    <strong>📍 Status:</strong> 
                    <span 
                      style={{ 
                        marginLeft: '10px',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        background: liveClass === cls._id ? '#28a745' : '#ffc107',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {liveClass === cls._id ? '🔴 LIVE' : '⏱️ Scheduled'}
                    </span>
                  </p>
                  <p><strong>🔗 Meeting Link:</strong></p>
                  <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', wordBreak: 'break-all'}}>
                    {cls.meetingLink}
                  </a>
                </div>
                <div style={{ marginLeft: '20px' }}>
                  {liveClass === cls._id ? (
                    <button
                      onClick={() => handleEndClass(cls._id)}
                      style={{
                        padding: '12px 24px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      🛑 End Class
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartClass(cls._id, cls.meetingLink)}
                      style={{
                        padding: '12px 24px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      ▶️ Start Class
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}