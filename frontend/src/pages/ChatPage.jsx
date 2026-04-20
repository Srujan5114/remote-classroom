import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

const ChatPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  const fetchMessages = async (courseId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/chat?courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCourse || !socketRef.current) return;

    socketRef.current.emit('joinRoom', selectedCourse._id);
    fetchMessages(selectedCourse._id);

    const handleReceiveMessage = (data) => {
      if (!data) return;

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id && data._id && msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socketRef.current.off('receiveMessage', handleReceiveMessage);
    socketRef.current.on('receiveMessage', handleReceiveMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage', handleReceiveMessage);
      }
    };
  }, [selectedCourse, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedCourse) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        {
          course: selectedCourse._id,
          message: newMessage.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const savedMessage = res.data;

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id && savedMessage._id && msg._id === savedMessage._id);
        if (exists) return prev;
        return [...prev, savedMessage];
      });

      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#fff'
      }}
    >
      <div
        style={{
          width: '280px',
          background: 'rgba(0,0,0,0.3)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}>Class Chats</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Select a course to chat</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {courses.length === 0 ? (
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
                textAlign: 'center',
                marginTop: '2rem'
              }}
            >
              No courses available
            </p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  background:
                    selectedCourse?._id === course._id
                      ? 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))'
                      : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${
                    selectedCourse?._id === course._id
                      ? 'rgba(102,126,234,0.5)'
                      : 'rgba(255,255,255,0.08)'
                  }`,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 700
                    }}
                  >
                    {course.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{course.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                      {course.code || 'Course Chat'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              width: '100%',
              padding: '0.7rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedCourse ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ fontSize: '4rem' }}>💬</div>
            <h3>Select a course to start chatting</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>
              Connect with your classmates and teachers
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                {selectedCourse.name?.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedCourse.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Group Chat</p>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '2rem' }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                  <p>No messages yet. Be the first to say something!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isOwn = senderId === (user._id || user.id);
                  const senderName = msg.sender?.name || msg.senderName || msg.sender || 'User';

                  return (
                    <div
                      key={msg._id || idx}
                      style={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        gap: '0.7rem',
                        alignItems: 'flex-end'
                      }}
                    >
                      {!isOwn && (
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {(senderName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div style={{ maxWidth: '65%' }}>
                        {!isOwn && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'rgba(255,255,255,0.5)',
                              marginBottom: '0.3rem',
                              paddingLeft: '0.3rem'
                            }}
                          >
                            {senderName}
                          </div>
                        )}

                        <div
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: isOwn
                              ? 'linear-gradient(135deg, #667eea, #764ba2)'
                              : 'rgba(255,255,255,0.1)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        >
                          <p style={{ margin: 0, lineHeight: 1.4, fontSize: '0.9rem' }}>
                            {msg.message || msg.content}
                          </p>
                        </div>

                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.3)',
                            textAlign: isOwn ? 'right' : 'left',
                            marginTop: '0.2rem',
                            paddingLeft: '0.3rem',
                            paddingRight: '0.3rem'
                          }}
                        >
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : ''}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={sendMessage}
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                gap: '0.8rem'
              }}
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedCourse.name}...`}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.2rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '25px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: newMessage.trim()
                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                    : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '25px',
                  color: '#fff',
                  cursor: newMessage.trim() ? 'pointer' : 'default',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;