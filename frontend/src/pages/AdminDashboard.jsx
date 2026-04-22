import React, { useEffect, useState } from 'react';
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
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import { getCourses, getClasses } from '../services/api';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Replace with your actual API calls for users, courses, and classes
      const coursesRes = await getCourses();
      setCourses(coursesRes.data);
      const classesRes = await getClasses();
      setClasses(classesRes.data);
      // Simulate users fetch (replace with real API call)
      setUsers(JSON.parse(localStorage.getItem('allUsers')) || []);
    } catch (err) {
      // handle error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Remote<Typography component="span" variant="h6" color="secondary" sx={{ fontWeight: 700 }}>Classroom Admin</Typography>
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: 4,
            borderRadius: 3,
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #0c2b52 0%, #0f4c81 52%, #ff7a18 145%)'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.12)',
              top: -100,
              right: -70
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, position: 'relative' }}>Admin Dashboard</Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, position: 'relative' }}>Welcome back. Manage courses, classes, and users from one place.</Typography>
        </Paper>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderTop: '5px solid #0f4c81', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <GroupIcon sx={{ color: '#0f4c81', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#0f4c81', fontWeight: 800 }}>{users.length}</Typography>
                    <Typography variant="body2">Total Users</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderTop: '5px solid #2aa74a', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <SchoolIcon sx={{ color: '#2aa74a', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#2aa74a', fontWeight: 800 }}>{courses.length}</Typography>
                    <Typography variant="body2">Total Courses</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderTop: '5px solid #ff7a18', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ClassIcon sx={{ color: '#ff7a18', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#ff7a18', fontWeight: 800 }}>{classes.length}</Typography>
                    <Typography variant="body2">Total Classes</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 4, background: 'linear-gradient(180deg, rgba(20, 30, 45, 0.95) 0%, rgba(14, 22, 34, 0.95) 100%)' }}>
          <Typography variant="h6" sx={{ color: 'primary.light', fontWeight: 800, mb: 1.5 }}>Management Center</Typography>
          <Typography color="text.secondary">Use this area to expand admin tools such as user approvals, course moderation, and class monitoring.</Typography>
        </Paper>
      </Box>
    </Box>
  );
}