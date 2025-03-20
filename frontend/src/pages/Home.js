import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Avatar
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupIcon from '@mui/icons-material/Group';
import styled from '@emotion/styled';

const HeroSection = styled(Box)`
  text-align: center;
  padding: 140px 0;
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDEyMHYzMEgwem0yNDAgMGgxMjB2MzBIMjQwem00ODAgMGgxMjB2MzBINzIwem05NjAgMGgxMjB2MzBIMTY4MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=');
    opacity: 0.15;
    animation: pulse 3s infinite;
  }
  @keyframes pulse {
    0% { opacity: 0.1; }
    50% { opacity: 0.2; }
    100% { opacity: 0.1; }
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

const StatsSection = styled(Box)`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 80px 0;
  margin: 80px 0 0 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2196f3, #1976d2);
  }
`;

const StatCard = styled(Paper)`
  padding: 32px;
  text-align: center;
  background: white;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled(Avatar)`
  background: ${props => props.theme.palette.primary.main};
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
`;

const GradientText = styled(Typography)`
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: 'Sentiment Analysis',
      description: 'Advanced AI-powered analysis to understand your emotional patterns and mental well-being.',
      icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
      path: '/assessment'
    },
    {
      title: 'Progress Tracking',
      description: 'Visualize your journey with interactive charts and personalized insights.',
      icon: <TimelineIcon sx={{ fontSize: 32 }} />,
      path: '/progress'
    },
    {
      title: 'Community Support',
      description: 'Connect with others, share experiences, and grow together in a safe environment.',
      icon: <GroupIcon sx={{ fontSize: 32 }} />,
      path: '/community'
    },
    {
      title: 'Expert Resources',
      description: 'Access professional guidance, coping strategies, and mental health resources.',
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
      path: '/resources'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '85%', label: 'User Satisfaction' },
    { number: '24/7', label: 'Support Available' },
    { number: '50+', label: 'Mental Health Experts' }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <HeroSection>
        <Container maxWidth="md">
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.75rem', md: '4rem' },
              fontWeight: 800,
              marginBottom: 3,
              letterSpacing: '-0.02em',
              color: 'white'
            }}
          >
            Your Mental Health Journey Starts Here
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              marginBottom: 6,
              opacity: 0.95,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: 'white',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Take control of your emotional well-being with our AI-powered sentiment analysis platform
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/assessment')}
              sx={{ 
                py: 2, 
                px: 5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              Start Your Assessment
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/resources')}
              sx={{ 
                py: 2, 
                px: 5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                textTransform: 'none',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Explore Resources
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <FeatureCard onClick={() => navigate(feature.path)}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <IconWrapper>{feature.icon}</IconWrapper>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      color: theme.palette.primary.main
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <StatsSection>
        <Container>
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 700,
              color: theme.palette.primary.main
            }}
          >
            Our Impact
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <StatCard elevation={0}>
                  <GradientText 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </GradientText>
                  <Typography 
                    variant="subtitle1"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StatsSection>
    </Box>
  );
};

export default Home;
