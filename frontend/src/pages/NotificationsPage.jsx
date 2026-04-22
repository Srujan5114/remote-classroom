import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, Grid, Card, CardContent, Chip, IconButton, CircularProgress, Stack, Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      setError('Failed to fetch notifications');
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
      setError('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({...n, read: true})));
    } catch (err) {
      setError('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const typeIcon = (type) => {
    const icons = { info: 'ℹ️', assignment: '📝', class: '🏫', grade: '🏆', chat: '💬', attendance: '✅' };
    return icons[type] || '🔔';
  };

  const typeColor = (type) => {
    const colors = { info: 'info', assignment: 'secondary', class: 'success', grade: 'warning', chat: 'error', attendance: 'success' };
    return colors[type] || 'default';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ fontSize: 28 }} /> Notifications
            {unreadCount > 0 && (
              <Chip label={unreadCount} color="secondary" size="small" sx={{ ml: 2 }} />
            )}
          </Typography>
          {unreadCount > 0 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MarkEmailReadIcon />}
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <CircularProgress />
            <Typography mt={2}>Loading notifications...</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Paper sx={{ textAlign: 'center', p: 6, mt: 4 }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography color="text.secondary" fontSize={16}>No notifications yet</Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {notifications.map(n => (
              <Card
                key={n._id}
                sx={{
                  bgcolor: n.read ? 'background.paper' : 'secondary.light',
                  borderLeft: n.read ? '4px solid #e0e0e0' : '4px solid',
                  borderColor: n.read ? '#e0e0e0' : 'secondary.main',
                  opacity: n.read ? 0.7 : 1,
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => !n.read && markAsRead(n._id)}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ fontSize: 32 }}>{typeIcon(n.type)}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={n.read ? 400 : 700} color={n.read ? 'text.secondary' : 'text.primary'}>
                      {n.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize={14}>
                      {n.message}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip label={n.type} color={typeColor(n.type)} size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton onClick={e => { e.stopPropagation(); deleteNotification(n._id); }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;