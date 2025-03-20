import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Alert,
  Link
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings
} from '@mui/icons-material';
import styled from '@emotion/styled';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${props => `linear-gradient(45deg, ${alpha(props.theme.palette.primary.main, 0.1)}, ${alpha(props.theme.palette.secondary.main, 0.1)})`};
`;

const LoginCard = styled(Paper)`
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.theme.palette.error.main}, 
      ${props => props.theme.palette.warning.main}
    );
  }
`;

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/admin/login', {
        email,
        password
      });

      // Check if we have both token and admin data
      const { token, admin: adminData } = response.data;
      if (!token || !adminData) {
        throw new Error('Invalid response from server');
      }

      // Use auth context to manage admin state
      login({ ...adminData, role: 'admin' }, token);

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer maxWidth="lg" theme={theme}>
      <LoginCard theme={theme}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2,
            color: theme.palette.error.main
          }}
        >
          Admin Login
        </Typography>

        <Typography 
          variant="body1" 
          align="center" 
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          <AdminPanelSettings sx={{ fontSize: 40, mb: 1, color: theme.palette.warning.main }} />
          <br />
          Access restricted to authorized administrators only
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Admin Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            color="error"
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              mb: 3,
              borderRadius: '8px'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In as Admin'}
          </Button>

          <Typography align="center" variant="body2">
            Need an admin account?{' '}
            <Link component={RouterLink} to="/admin/signup" color="error">
              Register as Admin
            </Link>
          </Typography>

          <Typography align="center" variant="body2" sx={{ mt: 2 }}>
            <Link component={RouterLink} to="/login" color="primary">
              Back to User Login
            </Link>
          </Typography>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin; 