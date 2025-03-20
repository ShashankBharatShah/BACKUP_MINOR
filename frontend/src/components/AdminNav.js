import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import {
  Logout,
  AdminPanelSettings,
  AccountCircle,
  Settings,
  Dashboard,
  PeopleAlt,
  Security,
  LibraryBooks
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const AdminNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/admin/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/admin/profile');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <Dashboard />
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: <PeopleAlt />
    },
    {
      label: 'Resources',
      path: '/admin/resources',
      icon: <LibraryBooks />
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings />
    }
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: theme.palette.error.main,
        mb: 3
      }}
    >
      <Toolbar>
        <AdminPanelSettings sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Admin Panel
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 4 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              component={Link}
              to={item.path}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box>
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.warning.main }}>
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2 }} />
              Admin Profile
            </MenuItem>
            
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Admin Settings
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNav; 