import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getClasses, updateClass } from '../services/api';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import AddIcon from '@mui/icons-material/Add';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [liveClass, setLiveClass] = useState(null);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let parsedUser = null;
    try {
      parsedUser = JSON.parse(localStorage.getItem('user'));
    } catch (error) {}
    setUser(parsedUser);

    const fetchMyClasses = async () => {
      try {
        if (!parsedUser || !parsedUser.id) return;
        const response = await getClasses();
        const myClasses = response.data.filter(cls => {
          const teacherId = cls.teacher?._id || cls.teacher?.id;
          return teacherId === parsedUser.id || teacherId === parsedUser._id;
        });
        setClasses(myClasses);
      } catch (error) {
        console.error('FETCH ERROR:', error);
      }
    };
    fetchMyClasses();
  }, []);

  const handleStartClass = (classId, meetingLink) => {
    setLiveClass(classId);
    if (meetingLink) window.open(meetingLink, '_blank');
  };

  const handleEndClass = () => {
    setLiveClass(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEditClick = (cls) => {
    setEditingId(cls._id);
    setSaveMsg('');
    const dt = new Date(cls.scheduledTime);
    const formatted = dt.toISOString().slice(0, 16);
    setEditForm({
      title: cls.title,
      scheduledTime: formatted,
      duration: cls.duration,
      meetingLink: cls.meetingLink || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (classId) => {
    try {
      setSaving(true);
      setSaveMsg('');
      const updated = await updateClass(classId, editForm);
      setClasses(prev => prev.map(c => c._id === classId ? updated.data : c));
      setEditingId(null);
      setSaveMsg('Class updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setSaveMsg('');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Remote<Typography component="span" variant="h6" color="secondary" sx={{ fontWeight: 700 }}>Classroom</Typography>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/teacher-dashboard">Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/schedule">Schedule Class</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>My Scheduled Classes</Typography>
          <Button component={RouterLink} to="/schedule" variant="contained" color="primary" startIcon={<AddIcon />}>+ Schedule New Class</Button>
        </Stack>

        {saveMsg && (
          <Alert severity={saveMsg.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{saveMsg}</Alert>
        )}

        {!user ? (
          <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
            <Typography color="error">Please login first.</Typography>
          </Paper>
        ) : classes.length === 0 ? (
          <Paper elevation={1} sx={{ textAlign: 'center', p: 4, mb: 2 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>No classes scheduled yet.</Typography>
            <Button component={RouterLink} to="/schedule" variant="contained" color="primary">Schedule Your First Class</Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {classes.map((cls) => (
              <Paper
                key={cls._id}
                elevation={2}
                sx={{
                  border: liveClass === cls._id ? '2px solid #34d399' : '1px solid rgba(94, 182, 230, 0.2)',
                  bgcolor: liveClass === cls._id ? 'rgba(52, 211, 153, 0.12)' : 'background.paper',
                  p: 2
                }}
              >
                {editingId === cls._id ? (
                  // ===== EDIT MODE =====
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Edit Class</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Class Title"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Scheduled Date & Time"
                          type="datetime-local"
                          name="scheduledTime"
                          value={editForm.scheduledTime}
                          onChange={handleEditChange}
                          fullWidth
                          sx={{ mb: 2 }}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Duration (minutes)"
                          type="number"
                          name="duration"
                          value={editForm.duration}
                          onChange={handleEditChange}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Meeting Link"
                          name="meetingLink"
                          value={editForm.meetingLink}
                          onChange={handleEditChange}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleEditSave(cls._id)}
                        disabled={saving}
                      >
                        {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                      </Button>
                      <Button variant="outlined" color="error" onClick={handleEditCancel}>Cancel</Button>
                    </Stack>
                  </Box>
                ) : (
                  // ===== VIEW MODE =====
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                    <Box flex={1}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Typography variant="h6" sx={{ color: 'text.primary', mb: 0 }}>{cls.title}</Typography>
                        <Chip label={liveClass === cls._id ? 'LIVE' : 'Scheduled'} color={liveClass === cls._id ? 'success' : 'warning'} size="small" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary"><strong>Course:</strong> {cls.course?.title}</Typography>
                      <Typography variant="body2" color="text.secondary"><strong>Time:</strong> {new Date(cls.scheduledTime).toLocaleString()}</Typography>
                      <Typography variant="body2" color="text.secondary"><strong>Duration:</strong> {cls.duration} minutes</Typography>
                      {cls.meetingLink && (
                        <Typography variant="body2" color="primary.main"><strong>Meeting Link:</strong> <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#7fcdf3' }}>{cls.meetingLink}</a></Typography>
                      )}
                    </Box>
                    <Stack spacing={1} direction="column" alignItems="flex-end">
                      {liveClass === cls._id ? (
                        <Button onClick={handleEndClass} variant="contained" color="error" startIcon={<StopCircleIcon />}>End Class</Button>
                      ) : (
                        <Button onClick={() => handleStartClass(cls._id, cls.meetingLink)} variant="contained" color="success" startIcon={<PlayCircleFilledWhiteIcon />}>Start Class</Button>
                      )}
                      <Button onClick={() => handleEditClick(cls)} variant="outlined" color="primary" startIcon={<EditIcon />}>Edit Timings</Button>
                    </Stack>
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}