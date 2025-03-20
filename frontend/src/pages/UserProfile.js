import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: '',
      email: '',
      age: '',
      gender: '',
      occupation: '',
      emergencyContact: '',
      bio: '',
      avatar: null,
      preferences: {
        reminderEnabled: true,
        reminderTime: '09:00',
        theme: 'light'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  }, [profileData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert changes by reloading from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setNotification({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success'
    });
  };

  const handleChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4, pt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'medium',
            color: 'primary.main'
          }}
        >
          User Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your personal information and preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={profileData.avatar}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
              </Avatar>
              {isEditing && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 0,
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <PhotoCameraIcon sx={{ color: 'white' }} />
                </IconButton>
              )}
            </Box>
            <Typography variant="h6" gutterBottom>
              {profileData.name || 'Your Name'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {profileData.email || 'your.email@example.com'}
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={handleChange('name')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange('email')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={profileData.age}
                  onChange={handleChange('age')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  value={profileData.gender}
                  onChange={handleChange('gender')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={profileData.occupation}
                  onChange={handleChange('occupation')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={profileData.emergencyContact}
                  onChange={handleChange('emergencyContact')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={profileData.bio}
                  onChange={handleChange('bio')}
                  disabled={!isEditing}
                  placeholder="Tell us a bit about yourself..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Assessment History Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Assessments
                      </Typography>
                      <Typography variant="h4">
                        {JSON.parse(localStorage.getItem('assessmentHistory') || '[]').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Last Assessment
                      </Typography>
                      <Typography variant="body1">
                        {(() => {
                          const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
                          if (history.length === 0) return 'No assessments yet';
                          const lastDate = new Date(history[history.length - 1].date);
                          return lastDate.toLocaleDateString();
                        })()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default UserProfile; 