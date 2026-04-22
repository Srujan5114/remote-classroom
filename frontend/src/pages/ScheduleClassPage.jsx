import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { createClass } from '../services/api';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, TextField, MenuItem, CircularProgress, Stack, Alert
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';

export default function ScheduleClassPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course: '',
    title: '',
    scheduledTime: '',
    duration: '',
    meetingLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const payload = { ...form, teacher: user?.id };
      await createClass(payload);
      setSuccess('Class scheduled successfully!');
      setForm({ course: '', title: '', scheduledTime: '', duration: '', meetingLink: '' });
      setTimeout(() => navigate('/teacher-classes'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule class.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ fontSize: 28 }} /> Schedule Class
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/teacher-dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/teacher-classes">My Classes</Button>
            <Button color="error" variant="outlined" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} mb={3} color="primary.dark">Schedule a Class</Typography>
        <Paper sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)' }}>
          <Stack spacing={2}>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  <MenuItem value="">Select a course</MenuItem>
                  {courses.map(c => (
                    <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Class Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Scheduled Time"
                  name="scheduledTime"
                  type="datetime-local"
                  value={form.scheduledTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Meeting Link"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="https://meet.example.com/..."
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={18} color="inherit" />}
                >
                  {loading ? 'Scheduling...' : 'Schedule Class'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}