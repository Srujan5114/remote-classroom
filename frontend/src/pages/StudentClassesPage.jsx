import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getClasses, markAttendance } from '../services/api';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import EventIcon from '@mui/icons-material/Event';
import DoneIcon from '@mui/icons-material/Done';
import SchoolIcon from '@mui/icons-material/School';

export default function StudentClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markedClasses, setMarkedClasses] = useState([]);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {}

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await getClasses();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinAndAttend = async (cls) => {
    if (cls.meetingLink) {
      window.open(cls.meetingLink, '_blank');
    }
    if (!markedClasses.includes(cls._id)) {
      try {
        setLoading(true);
        await markAttendance({ sessionId: cls._id, studentId: user?.id });
        setMarkedClasses(prev => [...prev, cls._id]);
      } catch (err) {
        console.error('Attendance error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const now = new Date();
  const upcoming = classes.filter(c => new Date(c.scheduledTime) > now);
  const past = classes.filter(c => new Date(c.scheduledTime) <= now);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Remote<Typography component="span" variant="h6" color="secondary" sx={{ fontWeight: 700 }}>Classroom</Typography>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/student-dashboard">Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/courses">Courses</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, mt: 1 }}>My Classes</Typography>

        {/* Upcoming Classes */}
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>Upcoming Classes</Typography>
        {upcoming.length === 0 ? (
          <Paper elevation={1} sx={{ mb: 3, textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">No upcoming classes.</Typography>
          </Paper>
        ) : (
          <Stack spacing={2} mb={4}>
            {upcoming.map(cls => (
              <Paper key={cls._id} elevation={2} sx={{ borderLeft: '4px solid #4361ee', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>{cls.title}</Typography>
                  <Typography variant="body2" color="text.secondary"><SchoolIcon sx={{ fontSize: 16, mr: 0.5 }} />Course: {cls.course?.title}</Typography>
                  <Typography variant="body2" color="text.secondary"><EventIcon sx={{ fontSize: 16, mr: 0.5 }} />Time: {new Date(cls.scheduledTime).toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Duration: {cls.duration} minutes</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                  {markedClasses.includes(cls._id) ? (
                    <Chip icon={<DoneIcon />} label="Attendance Marked" color="success" size="small" />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleJoinAndAttend(cls)}
                      disabled={loading}
                      sx={{ minWidth: 180, fontWeight: 600 }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Join & Mark Attendance'}
                    </Button>
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>
        )}

        {/* Past Classes */}
        <Typography variant="h6" sx={{ color: 'text.primary', mt: 4, mb: 2 }}>Past Classes</Typography>
        {past.length === 0 ? (
          <Paper elevation={1} sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">No past classes.</Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {past.map(cls => (
              <Paper key={cls._id} elevation={1} sx={{ mb: 2, borderLeft: '4px solid #adb5bd', p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 0.5 }}>{cls.title}</Typography>
                    <Typography variant="body2" color="text.secondary"><strong>Course:</strong> {cls.course?.title}</Typography>
                    <Typography variant="body2" color="text.secondary"><strong>Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}</Typography>
                  </Box>
                  <Chip label="Completed" color="info" size="small" />
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}