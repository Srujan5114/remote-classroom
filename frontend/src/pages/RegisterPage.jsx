import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, Alert, CircularProgress, Stack, MenuItem, Select, InputLabel, FormControl, Chip, Divider
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', college: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: { xs: 3, md: 5 } }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1120,
          overflow: 'hidden',
          borderRadius: 5,
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(15, 76, 129, 0.14)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 28px 60px rgba(15, 76, 129, 0.18)'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' }, minHeight: { md: 680 } }}>
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              color: 'white',
              background:
                'linear-gradient(145deg, rgba(255,122,24,0.95) 0%, rgba(15,76,129,0.94) 52%, rgba(12,43,82,0.98) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 4
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <Box sx={{ width: 54, height: 54, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center' }}>
                  <PersonAddAltIcon sx={{ fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
                    Remote Classroom
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Build your classroom workspace
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 420, lineHeight: 1.04, mb: 2 }}>
                Set up a polished learning profile in under a minute.
              </Typography>
              <Typography sx={{ maxWidth: 460, color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.7 }}>
                Teachers, students, and admins get a tailored onboarding flow with a clean interface and simple account setup.
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <Chip icon={<WorkspacePremiumIcon />} label="Professional account setup" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white', justifyContent: 'flex-start' }} />
              <Chip icon={<SupportAgentIcon />} label="Works for teachers and students" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white', justifyContent: 'flex-start' }} />
              <Chip icon={<MenuBookIcon />} label="Built for classroom workflows" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white', justifyContent: 'flex-start' }} />
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center' }}>
            <Stack spacing={3} sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
                  Get started
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                  Create your account
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.2 }}>
                  Choose your role and personalize your profile to match your classroom.
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="College Name"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, py: 1.4 }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Box>

              <Divider />

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Already have an account?{' '}
                <Link to="/" style={{ color: '#0f4c81', textDecoration: 'none', fontWeight: 800 }}>
                  Sign in here
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}