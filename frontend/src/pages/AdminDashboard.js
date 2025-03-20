import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  PeopleAlt,
  Assessment,
  Settings,
  Security,
  Add,
  Edit,
  Notifications,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    systemHealth: 'Good'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, these would be actual API calls
        const mockStats = {
          totalUsers: 156,
          activeUsers: 89,
          totalResources: 45,
          systemHealth: 'Good'
        };

        const mockActivity = [
          {
            id: 1,
            type: 'user',
            action: 'New user registration',
            timestamp: '2024-03-20T10:30:00',
            severity: 'info'
          },
          {
            id: 2,
            type: 'resource',
            action: 'Resource updated: Meditation Guide',
            timestamp: '2024-03-20T09:15:00',
            severity: 'success'
          },
          {
            id: 3,
            type: 'security',
            action: 'Failed login attempt',
            timestamp: '2024-03-20T08:45:00',
            severity: 'warning'
          }
        ];

        setStats(mockStats);
        setRecentActivity(mockActivity);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardItems = [
    {
      title: 'User Management',
      icon: <PeopleAlt sx={{ fontSize: 40 }} />,
      description: 'Manage user accounts and permissions',
      stats: `${stats.activeUsers} active / ${stats.totalUsers} total users`,
      action: () => navigate('/admin/users'),
      actionText: 'Manage Users'
    },
    {
      title: 'Resources',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      description: 'Manage mental health resources',
      stats: `${stats.totalResources} resources available`,
      action: () => navigate('/admin/resources'),
      actionText: 'Manage Resources'
    },
    {
      title: 'System Settings',
      icon: <Settings sx={{ fontSize: 40 }} />,
      description: 'Configure system parameters',
      stats: `System Health: ${stats.systemHealth}`,
      action: () => navigate('/admin/settings'),
      actionText: 'View Settings'
    },
    {
      title: 'Security',
      icon: <Security sx={{ fontSize: 40 }} />,
      description: 'Monitor system security and logs',
      stats: 'Real-time monitoring active',
      action: () => navigate('/admin/security'),
      actionText: 'View Security'
    }
  ];

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
      default:
        return <Info color="info" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Admin Dashboard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.main,
                        mb: 2
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 2 }}>
                      {item.stats}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={item.action}
                      startIcon={<Edit />}
                      sx={{ mt: 'auto' }}
                    >
                      {item.actionText}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Activity</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Notifications />}
                  size="small"
                >
                  View All
                </Button>
              </Box>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getSeverityIcon(activity.severity)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={new Date(activity.timestamp).toLocaleString()}
                      />
                      <Chip
                        label={activity.type}
                        size="small"
                        color={activity.severity === 'warning' ? 'warning' : 'default'}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard; 