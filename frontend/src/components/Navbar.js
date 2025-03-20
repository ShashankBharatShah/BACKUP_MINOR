import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  Badge,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Assessment,
  LibraryBooks,
  Forum,
  Timeline,
  Psychology,
  AccountCircle,
  Login,
  Notifications,
  Logout,
  Settings,
  ImageSearch
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)`
  background: ${props => props.transparent 
    ? 'rgba(255, 255, 255, 0.01)' 
    : 'rgba(255, 255, 255, 0.8)'};
  box-shadow: ${props => props.transparent 
    ? 'none' 
    : '0 4px 20px rgba(0, 0, 0, 0.08)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid ${props => props.transparent 
    ? 'transparent' 
    : 'rgba(0, 0, 0, 0.05)'};
`;

const NavButton = styled(Button)`
  position: relative;
  text-transform: none;
  font-weight: 500;
  padding: 8px 16px;
  color: ${props => props.transparent
    ? 'white'
    : props.active 
      ? props.theme.palette.primary.main 
      : props.theme.palette.text.primary};
  opacity: ${props => props.active ? 1 : 0.85};
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.active ? '24px' : '0'};
    height: 3px;
    background: ${props => props.transparent 
      ? 'white' 
      : props.theme.palette.primary.main};
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  &:hover {
    opacity: 1;
    &::after {
      width: 24px;
    }
  }
`;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 280px;
    background: ${props => props.theme.palette.background.paper};
    padding: 24px 16px;
  }
`;

const DrawerItem = styled(ListItem)`
  border-radius: 12px;
  margin-bottom: 8px;
  padding: 12px 16px;
  color: ${props => props.active ? props.theme.palette.primary.main : props.theme.palette.text.primary};
  background: ${props => props.active ? alpha(props.theme.palette.primary.main, 0.1) : 'transparent'};

  &:hover {
    background: ${props => props.active 
      ? alpha(props.theme.palette.primary.main, 0.15)
      : alpha(props.theme.palette.primary.main, 0.05)};
  }

  .MuiListItemIcon-root {
    min-width: 42px;
  }
`;

const UserAvatar = styled(Avatar)`
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    background: ${props => props.theme.palette.secondary.main};
    color: white;
    font-weight: 600;
  }
`;

const pages = [
  { name: 'Home', path: '/home', icon: <Home /> },
  { name: 'Assessment', path: '/assessment', icon: <Assessment /> },
  { name: 'Resources', path: '/resources', icon: <LibraryBooks /> },
  { name: 'Community', path: '/community', icon: <Forum /> },
  { name: 'Progress', path: '/progress', icon: <Timeline /> },
  { name: 'Text from Image', path: '/ocr', icon: <ImageSearch /> },
];

const settings = [
  { name: 'Profile', action: 'profile', icon: <AccountCircle /> },
  { name: 'Logout', action: 'logout', icon: <Logout /> }
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  const handleMenuAction = (action) => {
    handleCloseUserMenu();
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const renderMobileDrawer = () => (
    <StyledDrawer
      anchor="left"
      open={isDrawerOpen}
      onClose={handleDrawerToggle}
      theme={theme}
    >
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', px: 2 }}>
        <Psychology sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          MindfulMe
        </Typography>
      </Box>
      <List>
        {pages.map((page) => (
          <DrawerItem
            button
            component={Link}
            to={page.path}
            key={page.name}
            active={isActive(page.path)}
            onClick={handleDrawerToggle}
            theme={theme}
          >
            <ListItemIcon sx={{ 
              color: isActive(page.path) ? 'primary.main' : 'text.primary',
              minWidth: '40px'
            }}>
              {page.icon}
            </ListItemIcon>
            <ListItemText 
              primary={page.name}
              primaryTypographyProps={{
                fontWeight: isActive(page.path) ? 600 : 500
              }}
            />
          </DrawerItem>
        ))}
      </List>
    </StyledDrawer>
  );

  return (
    <StyledAppBar 
      position="fixed" 
      transparent={!isScrolled && isHomePage}
      theme={theme}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color={!isScrolled && isHomePage ? "inherit" : "default"}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Psychology sx={{ 
            mr: 1, 
            fontSize: 32, 
            color: !isScrolled && isHomePage ? 'white' : 'primary.main',
            transition: 'color 0.3s ease' 
          }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              color: !isScrolled && isHomePage ? 'white' : 'text.primary',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
          >
            MindfulMe
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {pages.map((page) => (
                <NavButton
                  key={page.name}
                  component={Link}
                  to={page.path}
                  active={isActive(page.path)}
                  transparent={!isScrolled && isHomePage}
                >
                  {page.name}
                </NavButton>
              ))}
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notifications */}
            <IconButton 
              sx={{ 
                color: !isScrolled && isHomePage ? 'white' : 'text.primary',
                transition: 'color 0.3s ease'
              }}
            >
              <StyledBadge badgeContent={3}>
                <Notifications />
              </StyledBadge>
            </IconButton>

            {/* User Menu */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <UserAvatar src={user?.photoURL}>
                  {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </UserAvatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  onClick={() => handleMenuAction(setting.action)}
                  sx={{ 
                    gap: 1.5,
                    minWidth: 150,
                    py: 1
                  }}
                >
                  {setting.icon}
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
