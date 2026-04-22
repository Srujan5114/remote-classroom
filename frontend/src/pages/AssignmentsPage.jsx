import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, CircularProgress, Stack, Alert, Chip, IconButton
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', courseId: '' });
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTeacher = user.role === 'teacher' || user.role === 'admin';

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    if (isTeacher) fetchCourses();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/assignments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ title: '', description: '', dueDate: '', courseId: '' });
      fetchAssignments();
    } catch (err) {
      setError('Failed to create assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAssignments();
    } catch (err) {
      setError('Failed to delete assignment');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ fontSize: 28 }} /> Assignments
          </Typography>
          <Box>
            {isTeacher && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
                color="secondary"
                sx={{ mr: 2 }}
              >
                New Assignment
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
          Assignment Board
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Assignment Form Dialog */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                select
                label="Course"
                value={formData.courseId}
                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                required
                fullWidth
              >
                <MenuItem value="">Select Course</MenuItem>
                {courses.map(c => (
                  <MenuItem key={c._id} value={c._id}>{c.name || c.title}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Create Assignment
            </Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <CircularProgress />
            <Typography mt={2}>Loading assignments...</Typography>
          </Box>
        ) : assignments.length === 0 ? (
          <Paper sx={{ textAlign: 'center', p: 6, mt: 4 }}>
            <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography color="text.secondary" fontSize={16}>No assignments yet</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {assignments.map(a => (
              <Grid item xs={12} key={a._id}>
                <Card sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>{a.title}</Typography>
                        {a.description && (
                          <Typography color="text.secondary" sx={{ mb: 1 }}>{a.description}</Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {a.course && (
                            <Chip label={a.course.name || a.course.title || 'Course'} color="secondary" size="small" />
                          )}
                          <Chip
                            label={`Due: ${new Date(a.dueDate).toLocaleDateString()}`}
                            color={new Date(a.dueDate) < new Date() ? 'error' : 'success'}
                            size="small"
                          />
                        </Stack>
                      </Box>
                      {isTeacher && (
                        <IconButton onClick={() => handleDelete(a._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AssignmentsPage;