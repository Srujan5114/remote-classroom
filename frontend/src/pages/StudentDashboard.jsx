import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, getClasses, getStudentAttendance } from '../services/api';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, Grid, Card, CardContent, Stack, Avatar
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const coursesRes = await getCourses();
      setCourses(coursesRes.data);
      const classesRes = await getClasses();
      const now = new Date();
      const upcoming = classesRes.data.filter(cls => new Date(cls.scheduledTime) > now);
      setUpcomingClasses(upcoming.slice(0, 3));
      const attendRes = await getStudentAttendance(user.id);
      setAttendance(attendRes.data);
      if (classesRes.data.length > 0) {
        const percent = Math.round((attendRes.data.length / classesRes.data.length) * 100);
        setAttendancePercent(percent);
      }
    } catch (error) {
      // Optionally handle error
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
            <SchoolIcon sx={{ fontSize: 28 }} /> Student Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/student-classes">My Classes</Button>
            <Button color="inherit" component={Link} to="/courses">Courses</Button>
            <Button color="inherit" component={Link} to="/profile">Edit Profile</Button>
            <Button color="error" variant="outlined" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Header Banner */}
        <Paper sx={{ background: 'linear-gradient(130deg, #0d3e6a 0%, #0f4c81 54%, #ff7a18 140%)', color: 'white', p: 4, borderRadius: 3, mb: 4 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
              <AccountCircleIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>Welcome back, {user?.name}</Typography>
              <Typography color="rgba(255,255,255,0.85)" fontSize={15}>{user?.email} &bull; {user?.college}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Stat Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderTop: '4px solid', borderColor: 'primary.main', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon color="primary" />
                  <Typography variant="h5" fontWeight={700}>{courses.length}</Typography>
                </Stack>
                <Typography color="text.secondary">Total Courses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderTop: '4px solid', borderColor: 'success.main', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                  <Typography variant="h5" fontWeight={700}>{attendance.length}</Typography>
                </Stack>
                <Typography color="text.secondary">Classes Attended</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderTop: '4px solid', borderColor: 'warning.main', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="h5" fontWeight={700}>{upcomingClasses.length}</Typography>
                </Stack>
                <Typography color="text.secondary">Upcoming Classes</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderTop: `4px solid ${attendancePercent >= 75 ? '#2dc653' : '#e63946'}`, borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsIcon sx={{ color: attendancePercent >= 75 ? '#2dc653' : '#e63946' }} />
                  <Typography variant="h5" fontWeight={700}>{attendancePercent}%</Typography>
                </Stack>
                <Typography color="text.secondary">Attendance</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Classes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700}>Upcoming Classes</Typography>
                  <Button component={Link} to="/student-classes" size="small" color="primary">View All</Button>
                </Stack>
                {upcomingClasses.length === 0 ? (
                  <Typography color="text.secondary">No upcoming classes</Typography>
                ) : (
                  <Stack spacing={2}>
                    {upcomingClasses.map(cls => (
                      <Paper key={cls._id} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', p: 2, bgcolor: 'rgba(17, 28, 42, 0.78)' }}>
                        <Typography fontWeight={600}>{cls.title}</Typography>
                        <Typography color="text.secondary" fontSize={13}>
                          {new Date(cls.scheduledTime).toLocaleString()}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Courses List */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>My Courses</Typography>
                {courses.length === 0 ? (
                  <Typography color="text.secondary">No courses enrolled</Typography>
                ) : (
                  <Stack spacing={2}>
                    {courses.map(course => (
                      <Paper key={course._id} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', p: 2, bgcolor: 'rgba(17, 28, 42, 0.78)' }}>
                        <Typography fontWeight={600}>{course.title}</Typography>
                        <Typography color="text.secondary" fontSize={13}>
                          {course.description || 'No description'}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}