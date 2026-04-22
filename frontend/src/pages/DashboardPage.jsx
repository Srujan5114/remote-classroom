import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignments, getClasses, getCourses } from '../services/api';
import {
  AppBar, Toolbar, Typography, Button, Avatar, Box, Grid, Card, CardContent, Chip, Paper, Stack
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    classesToday: 0,
    assignments: 0
  });
  let user = null;
  let userParseError = false;
  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    userParseError = true;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [coursesResult, classesResult, assignmentsResult] = await Promise.allSettled([
          getCourses(),
          getClasses(),
          getAssignments()
        ]);

        const courses = coursesResult.status === 'fulfilled' && Array.isArray(coursesResult.value?.data)
          ? coursesResult.value.data
          : [];

        const classes = classesResult.status === 'fulfilled' && Array.isArray(classesResult.value?.data)
          ? classesResult.value.data
          : [];

        const assignments = assignmentsResult.status === 'fulfilled' && Array.isArray(assignmentsResult.value?.data)
          ? assignmentsResult.value.data
          : [];

        const now = new Date();
        const classesToday = classes.filter((cls) => {
          if (!cls?.scheduledTime) return false;
          const scheduled = new Date(cls.scheduledTime);
          return (
            scheduled.getFullYear() === now.getFullYear()
            && scheduled.getMonth() === now.getMonth()
            && scheduled.getDate() === now.getDate()
          );
        }).length;

        setStats({
          courses: courses.length,
          classesToday,
          assignments: assignments.length
        });
      } catch (error) {
        setStats({ courses: 0, classesToday: 0, assignments: 0 });
      }
    };

    loadStats();
  }, []);

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
    { path: '/profile', label: 'Edit Profile', icon: <ManageAccountsIcon color="primary" />, desc: 'Update your account details' },
  ];

  const studentLinks = [
    { path: '/student-dashboard', label: 'Student Dashboard', icon: <DashboardIcon color="secondary" />, desc: 'Your learning overview' },
    { path: '/courses', label: 'My Courses', icon: <MenuBookIcon color="secondary" />, desc: 'View enrolled courses' },
    { path: '/student-classes', label: 'Upcoming Classes', icon: <SchoolIcon color="secondary" />, desc: 'View scheduled classes' },
    { path: '/assignments', label: 'Assignments', icon: <AssignmentIcon color="secondary" />, desc: 'View your assignments' },
    { path: '/materials', label: 'Study Materials', icon: <FolderIcon color="secondary" />, desc: 'Access course materials' },
    { path: '/chat', label: 'Class Chat', icon: <ChatIcon color="secondary" />, desc: 'Chat with classmates' },
    { path: '/notifications', label: 'Notifications', icon: <NotificationsIcon color="secondary" />, desc: 'View your notifications' },
    { path: '/profile', label: 'Edit Profile', icon: <ManageAccountsIcon color="secondary" />, desc: 'Update your account details' },
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
    { path: '/profile', label: 'Edit Profile', icon: <ManageAccountsIcon color="primary" />, desc: 'Update your account details' },
  ];

    const links = isAdmin ? adminLinks : (isTeacher ? teacherLinks : studentLinks);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary" elevation={0} sx={{ backdropFilter: 'blur(14px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.light', width: 44, height: 44 }}>
              <AccountCircleIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1}>Welcome, {user?.name || 'User'}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)', textTransform: 'capitalize' }}>{user?.role || 'user'}</Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip label={user?.role} color={isTeacher ? 'primary' : 'secondary'} sx={{ textTransform: 'capitalize', bgcolor: 'rgba(17, 28, 42, 0.75)', color: 'text.primary' }} />
            <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ borderColor: 'rgba(94, 182, 230, 0.45)', color: 'text.primary' }}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {userParseError && (
          <Typography sx={{ mb: 2 }} color="warning.main">
            Invalid user data in localStorage
          </Typography>
        )}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            p: { xs: 3, md: 5 },
            mb: 4,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(15,76,129,0.18) 0%, rgba(255,122,24,0.18) 100%)',
            border: '1px solid rgba(15, 76, 129, 0.12)'
          }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
              Dashboard overview
            </Typography>
            <Typography variant="h3" fontWeight={800} mb={1} color="primary.dark" sx={{ lineHeight: 1.05 }}>
              {isTeacher ? 'Teacher' : 'Student'} Dashboard
            </Typography>
            <Typography color="text.secondary" mb={3} sx={{ fontSize: 16, lineHeight: 1.7 }}>
              {isTeacher ? 'Manage your classes, students, assignments and materials from a single polished workspace.' : 'Track your classes, assignments and study materials in a clean, modern learning hub.'}
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, background: 'rgba(17, 28, 42, 0.82)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={800} color="primary.main">{stats.courses}</Typography>
                  <Typography color="text.secondary">Active Courses</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, background: 'rgba(17, 28, 42, 0.82)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={800} color="success.main">{stats.classesToday}</Typography>
                  <Typography color="text.secondary">Classes Today</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, background: 'rgba(17, 28, 42, 0.82)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={800} color="secondary.main">{stats.assignments}</Typography>
                  <Typography color="text.secondary">Assignments</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary.dark" sx={{ letterSpacing: 0.2, fontWeight: 800 }}>Quick Access</Typography>
          <Chip label="Fast navigation" variant="outlined" sx={{ bgcolor: 'rgba(17, 28, 42, 0.75)', color: 'text.primary' }} />
        </Stack>
        <Grid container spacing={2.5}>
          {links.map(link => (
            <Grid item xs={12} sm={6} md={3} key={link.path}>
              <Card
                sx={{
                  borderRadius: 4,
                  p: 2.5,
                  cursor: 'pointer',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  '&:hover': { boxShadow: 10, transform: 'translateY(-6px)' },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 176,
                  background: 'rgba(17, 28, 42, 0.86)'
                }}
                onClick={() => navigate(link.path)}
              >
                <Box sx={{ fontSize: 42, mb: 1 }}>{link.icon}</Box>
                <Typography variant="subtitle1" fontWeight={800} mb={0.5}>{link.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>{link.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}