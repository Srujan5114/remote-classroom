import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import { createCourse, getCourses, updateCourse, deleteCourse } from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await updateCourse(editId, form);
        setEditId(null);
      } else {
        await createCourse(form);
      }
      setForm({ title: '', description: '' });
      setShowForm(false);
      await fetchCourses();
    } catch (err) {
      setError('Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditId(course._id);
    setForm({ title: course.title, description: course.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      await fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <SchoolIcon sx={{ fontSize: 28 }} />
            Remote
            <Box
              component="span"
              sx={{ color: 'secondary.main', fontWeight: 700 }}
            >
              Classroom
            </Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user?.role === 'teacher' && (
              <Button color="inherit" component={Link} to="/teacher-dashboard">
                Dashboard
              </Button>
            )}
            {user?.role === 'student' && (
              <Button color="inherit" component={Link} to="/student-dashboard">
                Dashboard
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin-dashboard">
                Admin Dashboard
              </Button>
            )}
            <Button color="error" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: 'primary.dark' }}
          >
            Courses
          </Typography>
          {isTeacherOrAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm({ title: '', description: '' });
              }}
              color="primary"
            >
              {editId ? 'Edit Course' : 'Add Course'}
            </Button>
          )}
        </Box>

        {/* Add / Edit Course Dialog */}
        <Dialog
          open={showForm && isTeacherOrAdmin}
          onClose={() => {
            setShowForm(false);
            setEditId(null);
            setForm({ title: '', description: '' });
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editId ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Course Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm({ title: '', description: '' });
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {loading
                ? editId
                  ? 'Updating...'
                  : 'Creating...'
                : editId
                ? 'Update Course'
                : 'Create Course'}
            </Button>
          </DialogActions>
        </Dialog>

        {courses.length === 0 ? (
          <Paper sx={{ textAlign: 'center', p: 6, mt: 4 }}>
            <Typography color="text.secondary" fontSize={16}>
              No courses available yet.
            </Typography>
            {isTeacherOrAdmin && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  setShowForm(true);
                  setEditId(null);
                  setForm({ title: '', description: '' });
                }}
              >
                Create First Course
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    height: '100%',
                    background:
                      'linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="primary"
                      gutterBottom
                    >
                      {course.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize={14} sx={{ mb: 1.5 }}>
                      {course.description || 'No description provided.'}
                    </Typography>
                    {course.teacher && (
                      <Typography
                        color="text.secondary"
                        fontSize={13}
                        sx={{ fontStyle: 'italic' }}
                      >
                        Teacher:{' '}
                        {course.teacher.name || course.teacher.email}
                      </Typography>
                    )}
                  </CardContent>

                  {isTeacherOrAdmin && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        px: 2,
                        pb: 2,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(course._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}