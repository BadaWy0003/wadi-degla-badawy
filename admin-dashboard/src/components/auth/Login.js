import { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { Box, TextField, Button, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../util/client';

export default function Login() {
  const { setGlobalState } = useGlobalState(); // Access global state for user data
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { data } = await apiClient.post(`/api/auth/admin/login`, { email: formData.email, password: formData.password });

        localStorage.setItem('auth_token', data.token);

        // The login answer has no role; ask for the full profile (same call as on page load)
        // so role-based menus (e.g. News for Admins) are right without a refresh.
        let profile = {};
        try {
          profile = (await apiClient.get(`/api/auth/admin/check-auth`)).data;
        } catch {
          // fall back to the login answer
        }

        // Update global state
        setGlobalState({
          isLoggedIn: true,
          ...data,
          ...profile,
        });

        setMessage('Login successful!');
        navigate('/'); // Redirect to homepage
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Login failed. Please try again.' });
        setMessage('');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
