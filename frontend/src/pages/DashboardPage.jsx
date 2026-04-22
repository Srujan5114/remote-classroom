import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Avatar, Box, Grid, Card, CardContent, Chip, Paper
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    return <Typography sx={{ p: 4 }}>Invalid user data in localStorage</Typography>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const teacherLinks = [
    { path: '/teacher-dashboard', label: 'Teacher Dashboard', icon: <DashboardIcon color="primary" />, desc: 'Manage your classroom' },
    { path: '/courses', label: 'My Courses', icon: <MenuBookIcon color="primary" />, desc: 'View and manage courses' },
    { path: '/schedule-class', label: 'Schedule Class', icon: <EventIcon color="primary" />, desc: 'Create a new class session' },
    { path: '/teacher-classes', label: 'My Classes', icon: <SchoolIcon color="primary" />, desc: 'View all your classes' },
    { path: '/assignments', label: 'Assignments', icon: <AssignmentIcon color="primary" />, desc: 'Create and manage assignments' },
    { path: '/materials', label: 'Materials', icon: <FolderIcon color="primary" />, desc: 'Upload course materials' },
    { path: '/chat', label: 'Class Chat', icon: <ChatIcon color="primary" />, desc: 'Chat with students' },
    { path: '/notifications', label: 'Notifications', icon: <NotificationsIcon color="primary" />, desc: 'View your notifications' },
  ];

  const studentLinks = [
    { path: '/student-dashboard', label: 'Student Dashboard', icon: <DashboardIcon color="secondary" />, desc: 'Your learning overview' },
    { path: '/courses', label: 'My Courses', icon: <MenuBookIcon color="secondary" />, desc: 'View enrolled courses' },
    { path: '/student-classes', label: 'Upcoming Classes', icon: <SchoolIcon color="secondary" />, desc: 'View scheduled classes' },
    { path: '/assignments', label: 'Assignments', icon: <AssignmentIcon color="secondary" />, desc: 'View your assignments' },
    { path: '/materials', label: 'Study Materials', icon: <FolderIcon color="secondary" />, desc: 'Access course materials' },
    { path: '/chat', label: 'Class Chat', icon: <ChatIcon color="secondary" />, desc: 'Chat with classmates' },
    { path: '/notifications', label: 'Notifications', icon: <NotificationsIcon color="secondary" />, desc: 'View your notifications' },
  ];

  const adminLinks = [
    { path: '/admin-dashboard', label: 'Admin Dashboard', icon: '🛡️', desc: 'Full system overview' },
    { path: '/courses', label: 'Manage Courses', icon: '📚', desc: 'Add, edit, delete courses' },
    { path: '/assignments', label: 'Manage Assignments', icon: '📝', desc: 'Create and delete assignments' },
    { path: '/materials', label: 'Manage Materials', icon: '📁', desc: 'Upload and delete materials' },
    { path: '/schedule-class', label: 'Schedule Class', icon: '🗓️', desc: 'Create and delete class sessions' },
    { path: '/teacher-classes', label: 'All Classes', icon: '📅', desc: 'View all class sessions' },
    { path: '/chat', label: 'Class Chat', icon: '💬', desc: 'Chat with all users' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', desc: 'View and send notifications' },
  ];

    const links = isAdmin ? adminLinks : (isTeacher ? teacherLinks : studentLinks);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>{user?.name?.charAt(0) || 'U'}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>Welcome, {user?.name || 'User'}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{user?.role || 'user'}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label={user?.role} color={isTeacher ? 'primary' : 'secondary'} sx={{ textTransform: 'capitalize' }} />
            <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, md: 4 }, mb: 4, background: 'linear-gradient(135deg, rgba(15,76,129,0.16) 0%, rgba(255,122,24,0.18) 100%)' }}>
          <Typography variant="h4" fontWeight={700} mb={1} color="primary">
            {isTeacher ? 'Teacher' : 'Student'} Dashboard
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {isTeacher ? 'Manage your classes, students, assignments and materials.' : 'Access your classes, assignments and study materials.'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700}>0</Typography>
                  <Typography color="text.secondary">Active Courses</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700}>0</Typography>
                  <Typography color="text.secondary">Classes Today</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700}>0</Typography>
                  <Typography color="text.secondary">Assignments</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6" mb={2} color="primary.dark" sx={{ letterSpacing: 0.2 }}>Quick Access</Typography>
        <Grid container spacing={2}>
          {links.map(link => (
            <Grid item xs={12} sm={6} md={3} key={link.path}>
              <Card
                sx={{
                  borderRadius: 3,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                onClick={() => navigate(link.path)}
              >
                <Box sx={{ fontSize: 40, mb: 1 }}>{link.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600} mb={0.5}>{link.label}</Typography>
                <Typography variant="body2" color="text.secondary">{link.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}