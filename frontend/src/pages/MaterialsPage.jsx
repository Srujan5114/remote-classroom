import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, CircularProgress, Stack, Alert, Chip, IconButton
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';

const fileTypeMuiIcon = (type) => {
  switch (type) {
    case 'pdf': return <PictureAsPdfIcon color="error" fontSize="large" />;
    case 'video': return <VideoLibraryIcon color="secondary" fontSize="large" />;
    case 'image': return <ImageIcon color="primary" fontSize="large" />;
    case 'link': return <LinkIcon color="success" fontSize="large" />;
    case 'doc': return <DescriptionIcon color="info" fontSize="large" />;
    default: return <LibraryBooksIcon color="action" fontSize="large" />;
  }
};

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', fileType: 'pdf', courseId: '' });
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTeacher = user.role === 'teacher' || user.role === 'admin';

  const fetchMaterials = async () => {
    try {
      const coursesRes = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allMaterials = [];
      for (const course of coursesRes.data) {
        try {
          const res = await axios.get(`http://localhost:5000/api/materials/course/${course._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allMaterials.push(...res.data);
        } catch {}
      }
      setMaterials(allMaterials);
      setCourses(coursesRes.data);
    } catch (err) {
      setError('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/materials', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ title: '', description: '', fileUrl: '', fileType: 'pdf', courseId: '' });
      fetchMaterials();
    } catch (err) {
      setError('Failed to upload material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterials();
    } catch (err) {
      setError('Failed to delete material');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LibraryBooksIcon sx={{ fontSize: 28 }} /> Study Materials
          </Typography>
          {isTeacher && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              color="secondary"
            >
              Upload Material
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
          Learning Materials
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Upload Material Dialog */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload New Material</DialogTitle>
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
                select
                label="Course"
                value={formData.courseId}
                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                required
                fullWidth
              >
                <MenuItem value="">Select Course</MenuItem>
                {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.name || c.title}</MenuItem>)}
              </TextField>
              <TextField
                label="File URL / Link"
                value={formData.fileUrl}
                onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                required
                fullWidth
                placeholder="https://drive.google.com/..."
              />
              <TextField
                select
                label="File Type"
                value={formData.fileType}
                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                fullWidth
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="doc">Document</MenuItem>
                <MenuItem value="link">Link</MenuItem>
              </TextField>
              <TextField
                label="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                placeholder="Optional description"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Upload Material
            </Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <CircularProgress />
            <Typography mt={2}>Loading materials...</Typography>
          </Box>
        ) : materials.length === 0 ? (
          <Paper sx={{ textAlign: 'center', p: 6, mt: 4 }}>
            <LibraryBooksIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography color="text.secondary" fontSize={16}>No materials uploaded yet</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {materials.map(m => (
              <Grid item xs={12} sm={6} md={4} key={m._id}>
                <Card sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper', borderTop: '4px solid', borderColor: 'secondary.main', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                      {fileTypeMuiIcon(m.fileType)}
                      <Typography variant="subtitle1" fontWeight={700} align="center">{m.title}</Typography>
                    </Box>
                    {m.description && (
                      <Typography color="text.secondary" fontSize={14} align="center" sx={{ mb: 1 }}>{m.description}</Typography>
                    )}
                    <Stack direction="row" spacing={1} justifyContent="center" mb={1}>
                      <Chip label={m.fileType} color="secondary" size="small" sx={{ textTransform: 'uppercase' }} />
                    </Stack>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, pb: 2 }}>
                    <Button
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Open
                    </Button>
                    {isTeacher && (
                      <IconButton onClick={() => handleDelete(m._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MaterialsPage;