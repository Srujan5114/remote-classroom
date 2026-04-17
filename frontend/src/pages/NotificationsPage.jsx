import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? {...n, read: true} : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({...n, read: true})));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const typeIcon = (type) => {
    const icons = { info: 'ℹ️', assignment: '📝', class: '🏫', grade: '🏆', chat: '💬', attendance: '✅' };
    return icons[type] || '🔔';
  };

  const typeColor = (type) => {
    const colors = { info: '#60a5fa', assignment: '#a78bfa', class: '#34d399', grade: '#fbbf24', chat: '#f472b6', attendance: '#6ee7b7' };
    return colors[type] || '#94a3b8';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '2rem', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ marginLeft: '0.8rem', padding: '0.2rem 0.7rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>{unreadCount}</span>
              )}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Stay updated with your class activities</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{ padding: '0.7rem 1.5rem', background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.4)', borderRadius: '8px', color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>Mark All Read</button>
            )}
            <button onClick={() => window.history.back()} style={{ padding: '0.7rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Back</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔔</div>
            <h3 style={{ marginBottom: '0.5rem' }}>All caught up!</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>No notifications yet. We'll notify you when something happens.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {notifications.map(n => (
              <div key={n._id} onClick={() => !n.read && markAsRead(n._id)}
                style={{ background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(102,126,234,0.08)', border: `1px solid ${n.read ? 'rgba(255,255,255,0.08)' : 'rgba(102,126,234,0.25)'}`, borderRadius: '12px', padding: '1.2rem 1.5rem', cursor: n.read ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{typeIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: n.read ? 400 : 600, color: n.read ? 'rgba(255,255,255,0.7)' : '#fff' }}>{n.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: typeColor(n.type), display: 'inline-block' }}></span>}
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>{n.message}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                  style={{ padding: '0.3rem 0.6rem', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '6px', color: 'rgba(255,100,100,0.7)', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
