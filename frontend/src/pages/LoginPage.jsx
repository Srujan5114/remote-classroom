import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import {
  Box, Button, TextField, Typography, Paper, Alert, CircularProgress, Stack, Chip, Divider
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ForumIcon from '@mui/icons-material/Forum';
import SchoolIcon from '@mui/icons-material/School';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: { xs: 3, md: 5 }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1120,
          overflow: 'hidden',
          borderRadius: 5,
          background: 'rgba(12, 19, 30, 0.84)',
          border: '1px solid rgba(94, 182, 230, 0.2)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 28px 60px rgba(0, 0, 0, 0.35)'
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            minHeight: { md: 640 }
          }}
        >
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              color: 'white',
              background:
                'linear-gradient(140deg, rgba(9,23,38,0.98) 0%, rgba(10,79,122,0.95) 50%, rgba(255,159,67,0.86) 132%)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 4
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <Box sx={{ width: 54, height: 54, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
                    Remote Classroom
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Modern learning, smoother collaboration
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 420, lineHeight: 1.04, mb: 2 }}>
                A cleaner way to manage classes, assignments, and student progress.
              </Typography>
              <Typography sx={{ maxWidth: 460, color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.7 }}>
                Sign in to a polished workspace built for teachers and students to move fast, stay organized, and stay connected.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Chip icon={<AutoGraphIcon />} label="Insightful dashboards" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
              <Chip icon={<ForumIcon />} label="Instant class chat" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
              <Chip icon={<SchoolIcon />} label="Responsive for every device" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
            </Stack>
          </Box>

          <Box
            sx={{
              p: { xs: 4, md: 6 },
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(15,24,37,0.9) 0%, rgba(11,18,28,0.95) 100%)',
              borderLeft: '1px solid rgba(94, 182, 230, 0.14)'
            }}
          >
            <Stack spacing={3} sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
                  Welcome back
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                  Sign in to continue
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.2 }}>
                  Pick up where you left off and access your teaching or learning dashboard.
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
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
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>

              <Divider />

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#7fcdf3', textDecoration: 'none', fontWeight: 800 }}>
                  Create one now
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}