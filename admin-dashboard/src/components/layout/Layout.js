import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import { Dashboard as DashboardIcon, Inventory, Collections, Group, People, DriveFolderUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../GlobalStateContext'; // Ensure this exists
import apiClient from '../../util/client';


const drawerWidth = 280;

export default function Layout() {
  const navigate = useNavigate();
  const { globalState,setGlobalState } = useGlobalState();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
    { text: 'Gallery', icon: <Collections />, path: '/gallery' },
    { text: 'Users', icon: <Group />, path: '/users' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Documents', icon: <DriveFolderUpload />, path: '/documents' },
  ];

  const handleLogout = async () => {
    try {
      await apiClient.post(`/api/auth/logout`);

      console.log('Logout successful');

      // Reset global state
      setGlobalState({
        isLoggedIn: false,
        userName: '',
        email: '',
        role: '',
      });

      // Navigate to the login page
      navigate('/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      localStorage.removeItem('auth_token');
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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: '3rem',
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
            }}
          >
            Welcome back <strong>{globalState.username}</strong>!
          </Typography>

          <Button variant="contained" color="secondary" onClick={() => handleLogout()}>
            Logout
          </Button>

        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            padding: '8px',
            mt: 8,
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map(item => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
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
          p: 4,
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
