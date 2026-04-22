import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, Grid, Card, CardContent, TextField, CircularProgress, Stack, Avatar, IconButton, InputAdornment
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
      // Optionally handle error
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      {/* Sidebar */}
      <Box sx={{
        width: 280,
        bgcolor: 'rgba(15,24,37,0.88)',
        backdropFilter: 'blur(6px)',
        borderRight: 1,
        borderColor: 'divider',
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column'
      }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700}>Class Chats</Typography>
          <Typography color="text.secondary" fontSize={13}>Select a course to chat</Typography>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {courses.length === 0 ? (
            <Typography color="text.secondary" align="center" mt={4}>No courses available</Typography>
          ) : (
            <Stack spacing={1}>
              {courses.map((course) => (
                <Card
                  key={course._id}
                  variant={selectedCourse?._id === course._id ? 'elevation' : 'outlined'}
                  sx={{
                    bgcolor: selectedCourse?._id === course._id ? 'secondary.light' : 'background.paper',
                    cursor: 'pointer',
                    borderLeft: selectedCourse?._id === course._id ? '4px solid' : '4px solid transparent',
                    borderColor: selectedCourse?._id === course._id ? 'secondary.main' : 'transparent'
                  }}
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <AccountCircleIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600} fontSize={15}>{course.name}</Typography>
                      <Typography color="text.secondary" fontSize={12}>{course.code || 'Course Chat'}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedCourse ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
            <ChatIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6">Select a course to start chatting</Typography>
            <Typography color="text.secondary">Connect with your classmates and teachers</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(15,24,37,0.92)', backdropFilter: 'blur(4px)' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                <AccountCircleIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{selectedCourse.name}</Typography>
                <Typography color="text.secondary" fontSize={13}>Group Chat</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.default' }}>
              {loading ? (
                <Typography color="text.secondary" align="center" mt={4}>Loading messages...</Typography>
              ) : messages.length === 0 ? (
                <Typography color="text.secondary" align="center" mt={4}>No messages yet. Be the first to say something!</Typography>
              ) : (
                messages.map((msg, idx) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isOwn = senderId === (user._id || user.id);
                  const senderName = msg.sender?.name || msg.senderName || msg.sender || 'User';
                  return (
                    <Box
                      key={msg._id || idx}
                      sx={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 1
                      }}
                    >
                      {!isOwn && (
                        <Avatar sx={{ bgcolor: 'error.light', width: 32, height: 32 }}>
                          <AccountCircleIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                      )}
                      <Box sx={{ maxWidth: '65%' }}>
                        {!isOwn && (
                          <Typography fontSize={12} color="text.secondary" sx={{ mb: 0.5, pl: 0.5 }}>
                            {senderName}
                          </Typography>
                        )}
                        <Paper
                          elevation={3}
                          sx={{
                            p: 1.5,
                            borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            bgcolor: isOwn ? 'primary.main' : 'background.paper',
                            color: isOwn ? '#062033' : 'text.primary'
                          }}
                        >
                          <Typography fontSize={15} sx={{ m: 0 }}>{msg.message || msg.content}</Typography>
                        </Paper>
                        <Typography fontSize={11} color="text.disabled" align={isOwn ? 'right' : 'left'} sx={{ mt: 0.5, px: 0.5 }}>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>
            <Box component="form" onSubmit={sendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', gap: 2 }}>
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedCourse.name}...`}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;