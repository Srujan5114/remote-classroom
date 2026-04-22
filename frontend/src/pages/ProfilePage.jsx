import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { getMyProfile, updateMyProfile } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    password: '',
    confirmPassword: ''
  });
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        const user = response.data.user;

        setForm((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          college: user.college || ''
        }));
        setRole(user.role || '');
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password && form.password !== form.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        college: form.college
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const response = await updateMyProfile(payload);
      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setRole(updatedUser.role || role);
      setForm((prev) => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 980,
          overflow: 'hidden',
          borderRadius: 5,
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(15, 76, 129, 0.14)',
          boxShadow: '0 26px 58px rgba(15, 76, 129, 0.16)',
          backdropFilter: 'blur(18px)'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' } }}>
          <Box
            sx={{
              p: { xs: 4, md: 5 },
              color: 'white',
              background: 'linear-gradient(150deg, #0f4c81 0%, #0c2b52 58%, #ff7a18 140%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 4
            }}
          >
            <Box>
              <Chip label={role || 'user'} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white', mb: 2, textTransform: 'capitalize' }} />
              <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.05, mb: 2 }}>
                Keep your profile polished and up to date.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.7 }}>
                Update the details shown across your dashboards and keep your account ready for class.
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', color: 'rgba(255,255,255,0.92)' }}>
                <AccountCircleIcon />
                <Typography>Personal details</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', color: 'rgba(255,255,255,0.92)' }}>
                <EditNoteIcon />
                <Typography>Account visibility</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', color: 'rgba(255,255,255,0.92)' }}>
                <SecurityIcon />
                <Typography>Password controls</Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 4, md: 5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
                  Account settings
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  Edit Profile
                </Typography>
              </Box>
              <Chip label="Secure" color="success" variant="outlined" />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="College"
                name="college"
                value={form.college}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary', fontWeight: 800 }}>
                Change Password (optional)
              </Typography>
              <TextField
                label="New Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/dashboard')}
                  fullWidth
                >
                  Back to Dashboard
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
