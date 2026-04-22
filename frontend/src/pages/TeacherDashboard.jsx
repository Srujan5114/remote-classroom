import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getCourses, getClasses } from '../services/api';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesRes = await getCourses();
      setCourses(coursesRes.data);
      const classesRes = await getClasses();
      setClasses(classesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const upcomingClasses = classes.filter(c => new Date(c.scheduledTime) > new Date());

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Remote<Typography component="span" variant="h6" color="secondary" sx={{ fontWeight: 700 }}>Classroom</Typography>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/courses">My Courses</Button>
          <Button color="inherit" component={RouterLink} to="/teacher-classes">My Classes</Button>
          <Button color="inherit" component={RouterLink} to="/schedule">Schedule Class</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(130deg, #0d3e6a 0%, #0f4c81 52%, #ff7a18 145%)', color: 'white' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Teacher Dashboard</Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>Welcome back, {user?.name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>{user?.email} &bull; {user?.college}</Typography>
        </Paper>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderTop: '5px solid', borderColor: 'primary.main', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <SchoolIcon sx={{ color: 'primary.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>{courses.length}</Typography>
                    <Typography variant="body2">Total Courses</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderTop: '5px solid', borderColor: 'success.main', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ClassIcon sx={{ color: 'success.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>{classes.length}</Typography>
                    <Typography variant="body2">Classes Scheduled</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderTop: '5px solid', borderColor: 'warning.main', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <EventIcon sx={{ color: 'warning.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: 'warning.main', fontWeight: 700 }}>{upcomingClasses.length}</Typography>
                    <Typography variant="body2">Upcoming Classes</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Upcoming Classes */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700 }}>Upcoming Classes</Typography>
                <Button component={RouterLink} to="/teacher-classes" endIcon={<ArrowForwardIosIcon fontSize="small" />} sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }} size="small">View All</Button>
              </Stack>
              {upcomingClasses.length === 0 ? (
                <Typography color="text.secondary">No upcoming classes scheduled.</Typography>
              ) : (
                upcomingClasses.slice(0, 3).map(cls => (
                  <Paper key={cls._id} elevation={0} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', p: 2, mb: 2, bgcolor: '#f8f9ff', borderRadius: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{cls.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Course: {cls.course?.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main' }}>{new Date(cls.scheduledTime).toLocaleString()}</Typography>
                    {cls.meetLink && (
                        <Button href={cls.meetLink} target="_blank" rel="noreferrer" size="small" startIcon={<MeetingRoomIcon />} sx={{ color: 'success.main', fontWeight: 600, textTransform: 'none', mt: 1 }}>
                        Join Meet
                      </Button>
                    )}
                  </Paper>
                ))
              )}
            </Paper>
          </Grid>

          {/* My Courses */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700 }}>My Courses</Typography>
                <Button component={RouterLink} to="/courses" endIcon={<ArrowForwardIosIcon fontSize="small" />} sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }} size="small">View All</Button>
              </Stack>
              {courses.length === 0 ? (
                <Typography color="text.secondary">No courses yet.</Typography>
              ) : (
                courses.slice(0, 4).map(course => (
                  <Paper key={course._id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f0f2f5', borderRadius: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{course.description?.slice(0, 60)}...</Typography>
                  </Paper>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={RouterLink} to="/schedule" variant="contained" color="primary" sx={{ fontWeight: 600, textTransform: 'none' }}>+ Schedule Class</Button>
            <Button component={RouterLink} to="/courses" variant="contained" color="success" sx={{ fontWeight: 600, textTransform: 'none' }}>My Courses</Button>
            <Button component={RouterLink} to="/teacher-classes" variant="contained" color="warning" sx={{ fontWeight: 600, textTransform: 'none' }}>View All Classes</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}