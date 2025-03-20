import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Psychology,
  Email,
  Phone,
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';
import styled from '@emotion/styled';

const FooterWrapper = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 80px 0 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(0,0,0,0) 0%,
      ${props => props.theme.palette.divider} 50%,
      rgba(0,0,0,0) 100%
    );
  }
`;

const SocialButton = styled(IconButton)`
  background: ${props => props.theme.palette.action.hover};
  margin-right: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.palette.primary.main};
    color: white;
    transform: translateY(-3px);
  }
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.palette.text.secondary};
  text-decoration: none;
  display: block;
  padding: 6px 0;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.palette.primary.main};
    transform: translateX(5px);
  }
`;

const NewsletterBox = styled(Box)`
  background: ${props => props.theme.palette.background.default};
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Footer = () => {
  const theme = useTheme();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const resources = [
    { name: 'Mental Health Guide', path: '/guide' },
    { name: 'Crisis Support', path: '/crisis' },
    { name: 'Find a Therapist', path: '/therapists' },
    { name: 'Self-Help Tools', path: '/tools' },
  ];

  const contact = [
    { icon: <Email />, text: 'support@mindfulme.com' },
    { icon: <Phone />, text: '+1 (800) 123-4567' },
    { icon: <LocationOn />, text: '123 Wellness Street, CA 94105' },
  ];

  return (
    <FooterWrapper theme={theme}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                MindfulMe
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3, pr: { md: 8 } }}
            >
              Empowering individuals through mental health awareness, support, and personalized guidance for a balanced life.
            </Typography>
            <Box sx={{ mb: 4 }}>
              <SocialButton theme={theme}>
                <Facebook />
              </SocialButton>
              <SocialButton theme={theme}>
                <Twitter />
              </SocialButton>
              <SocialButton theme={theme}>
                <Instagram />
              </SocialButton>
              <SocialButton theme={theme}>
                <LinkedIn />
              </SocialButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Links
            </Typography>
            {quickLinks.map((link) => (
              <FooterLink 
                key={link.name} 
                to={link.path}
                theme={theme}
              >
                {link.name}
              </FooterLink>
            ))}
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Resources
            </Typography>
            {resources.map((link) => (
              <FooterLink 
                key={link.name} 
                to={link.path}
                theme={theme}
              >
                {link.name}
              </FooterLink>
            ))}
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <NewsletterBox theme={theme}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Stay Connected
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Subscribe to our newsletter for mental health tips, resources, and updates.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Enter your email"
                  size="small"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      pr: 0,
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: '50px',
                          px: 3,
                          py: 1,
                          minWidth: 'auto',
                        }}
                      >
                        <ArrowForward />
                      </Button>
                    ),
                  }}
                />
              </Box>
            </NewsletterBox>

            <Box sx={{ mt: 4 }}>
              {contact.map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2,
                    color: 'text.secondary',
                  }}
                >
                  <Box sx={{ 
                    mr: 2,
                    color: 'primary.main',
                    display: 'flex',
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2">
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography variant="body2" color="text.secondary">
            {new Date().getFullYear()} MindfulMe. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <FooterLink 
              to="/privacy" 
              theme={theme}
              sx={{ 
                fontSize: '0.875rem',
                transform: 'none !important',
                display: 'inline',
              }}
            >
              Privacy Policy
            </FooterLink>
            <FooterLink 
              to="/terms" 
              theme={theme}
              sx={{ 
                fontSize: '0.875rem',
                transform: 'none !important',
                display: 'inline',
              }}
            >
              Terms of Service
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
