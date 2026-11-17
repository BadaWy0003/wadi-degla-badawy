import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, Button, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Inventory, Collections, Group, People, DriveFolderUpload, Newspaper, Apartment, Web } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../GlobalStateContext'; // Ensure this exists
import apiClient from '../../util/client';
import { canManageNews } from '../../util/news';


const drawerWidth = 280;

export default function Layout() {
  const navigate = useNavigate();
  const { globalState,setGlobalState } = useGlobalState();
  // Phones and small tablets: the menu hides behind a ☰ button and the page uses the full width.
  // From 900 px (md) up, the layout is unchanged (menu always open on the left).
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md'));
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
    { text: 'Gallery', icon: <Collections />, path: '/gallery' },
    // Website, News and Projects: Admins and Super Admins only (the server enforces the same rule)
    ...(canManageNews(globalState.role)
      ? [
          { text: 'Website', icon: <Web />, path: '/website' },
          { text: 'News', icon: <Newspaper />, path: '/news' },
          { text: 'Projects', icon: <Apartment />, path: '/projects' },
        ]
      : []),
    { text: 'Users', icon: <Group />, path: '/users' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Documents', icon: <DriveFolderUpload />, path: '/documents' },
  ];

  const handleLogout = async () => {
    try {
      // Ends this admin's sessions on every device (server refuses older tokens).
      await apiClient.post(`/api/auth/admin/logout`);
    } catch {
      // Already expired or offline: still log out here.
    } finally {
      localStorage.removeItem('auth_token');
      setGlobalState({
        isLoggedIn: false,
        userName: '',
        email: '',
        role: '',
      });
      navigate('/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
          {small && (
            <IconButton aria-label="Open menu" edge="start" onClick={() => setMenuOpen(true)} sx={{ color: '#6a7b83' }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: small ? '1.6rem' : '3rem',
              flexGrow: small ? 1 : 0,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(45deg, #ad9571 30%, #6a7b83 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Wadi Degla
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              color: '#6a7b83',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Welcome back <strong>{globalState.username}</strong>!
          </Typography>

          <Button variant="contained" color="secondary" size={small ? 'small' : 'medium'} onClick={() => handleLogout()}>
            Logout
          </Button>

        </Toolbar>
      </AppBar>

      <Drawer
        variant={small ? 'temporary' : 'permanent'}
        open={small ? menuOpen : true}
        onClose={() => setMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: small ? 0 : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: small ? 260 : drawerWidth,
            boxSizing: 'border-box',
            padding: '8px',
            mt: small ? 0 : 8,
          },
        }}
      >
        {/* spacer: the menu starts below the top bar */}
        <Toolbar />
        <List>
          {menuItems.map(item => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                // a Website page with unsaved changes (BlockEditor.js) asks first
                if (window.wdUnsavedChanges && !window.confirm('You have unsaved changes. Leave without saving?')) return;
                window.wdUnsavedChanges = false;
                navigate(item.path);
                setMenuOpen(false);
              }}
              sx={{
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateX(8px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'primary.main',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0, // lets wide tables scroll inside their own box instead of widening the page
          p: { xs: 2, md: 4 },
          backgroundColor: 'background.default',
          borderRadius: '24px 0 0 0',
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
