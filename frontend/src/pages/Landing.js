import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  useTheme,
  alpha,
  Grid,
  Link
} from '@mui/material';
import styled from '@emotion/styled';
import { Psychology, Favorite, Timeline, Group } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const LandingContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 40px 20px;
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDEyMHYzMEgwem0yNDAgMGgxMjB2MzBIMjQwem00ODAgMGgxMjB2MzBINzIwem05NjAgMGgxMjB2MzBIMTY4MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=');
    opacity: 0.1;
    animation: pulse 3s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.1; }
    50% { opacity: 0.2; }
    100% { opacity: 0.1; }
  }
`;

const ContentGrid = styled(Grid)`
  position: relative;
  z-index: 1;
`;

const LandingCard = styled(Paper)`
  padding: 48px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.theme.palette.primary.main}, 
      ${props => props.theme.palette.secondary.main}
    );
  }
`;

const FeatureIcon = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: ${props => alpha(props.theme.palette.primary.main, 0.1)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: ${props => props.theme.palette.primary.main};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: ${props => alpha(props.theme.palette.primary.main, 0.15)};
  }
`;

const StyledButton = styled(Button)`
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 32 }} />,
      title: 'AI-Powered Analysis',
      description: 'Advanced sentiment analysis to understand your emotional patterns'
    },
    {
      icon: <Timeline sx={{ fontSize: 32 }} />,
      title: 'Track Progress',
      description: 'Visualize your journey with interactive insights and charts'
    },
    {
      icon: <Group sx={{ fontSize: 32 }} />,
      title: 'Community Support',
      description: 'Connect with others and share experiences in a safe space'
    },
    {
      icon: <Favorite sx={{ fontSize: 32 }} />,
      title: 'Mental Wellness',
      description: 'Access professional resources and guided support'
    }
  ];

  return (
    <LandingContainer maxWidth={false} theme={theme}>
      <Container maxWidth="lg">
        <ContentGrid container spacing={8} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ color: 'white', pr: { md: 8 } }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                Your Mental Health Journey Starts Here
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 6,
                  opacity: 0.9,
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Take control of your emotional well-being with our AI-powered platform. Join thousands of others on their path to better mental health.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 8 }}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ mb: 4 }}>
                      <FeatureIcon theme={theme}>
                        {feature.icon}
                      </FeatureIcon>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Content - Auth Card */}
          <Grid item xs={12} md={5}>
            <LandingCard theme={theme}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mb: 4,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Join MindfulMe Today
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem'
                }}
              >
                Start your journey to better mental health. Join our supportive community today.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <StyledButton
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`
                  }}
                >
                  Get Started
                </StyledButton>
                
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  Sign In
                </StyledButton>
              </Box>
            </LandingCard>
          </Grid>
        </ContentGrid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ mt: 3 }}>
            Are you an administrator?{' '}
            <Link component={RouterLink} to="/admin/login" color="error">
              Admin Access
            </Link>
          </Typography>
        </Box>
      </Container>
    </LandingContainer>
  );
};

export default Landing;
