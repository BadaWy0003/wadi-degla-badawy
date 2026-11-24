import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  SpaceDashboardOutlined,
  Inventory2Outlined,
  PhotoLibraryOutlined,
  MarkEmailUnreadOutlined,
  WebOutlined,
  NewspaperOutlined,
  ApartmentOutlined,
  AdminPanelSettingsOutlined,
  StorefrontOutlined,
  DescriptionOutlined,
  Logout,
} from '@mui/icons-material';
import { useGlobalState } from '../GlobalStateContext';
import apiClient from '../../util/client';
import { canManageNews } from '../../util/news';
import { roleLabel } from '../../util/roles';
import { colors } from '../../theme';
import { PublishProvider, PublishButton } from '../publish/PublishStatus';

// The frame of every page (redesign step 1, 2026-11-24): a slim top bar (logo, Publish button,
// user menu) and the menu grouped by task. Phones and small tablets (< 900 px): the menu hides
// behind ☰.
const drawerWidth = 248;

const isActive = (path, pathname) => (path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`));

export default function Layout() {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(null);
  const location = useLocation();
  const isAdmin = canManageNews(globalState.role);

  // How many enquiries are new (menu badge): checked on every page change, and when the
  // Enquiries page changes a status.
  const [newEnquiries, setNewEnquiries] = useState(0);
  useEffect(() => {
    if (!isAdmin) return undefined;
    const load = () =>
      apiClient
        .get('/api/enquiries/admin/count-new')
        .then(({ data }) => setNewEnquiries(data.data.count || 0))
        .catch(() => {});
    load();
    window.addEventListener('wd:enquiries-changed', load);
    return () => window.removeEventListener('wd:enquiries-changed', load);
  }, [isAdmin, location.pathname]);

  // Enquiries, Website, News and Projects: Admins and Owners only (the server enforces the same rule)
  const groups = [
    { items: [{ text: 'Dashboard', icon: <SpaceDashboardOutlined />, path: '/' }] },
    {
      title: 'Catalogue',
      items: [
        { text: 'Stones', icon: <Inventory2Outlined />, path: '/products' },
        { text: 'Gallery', icon: <PhotoLibraryOutlined />, path: '/gallery' },
      ],
    },
    isAdmin && {
      title: 'Website',
      items: [
        { text: 'Pages & texts', icon: <WebOutlined />, path: '/website' },
        { text: 'News', icon: <NewspaperOutlined />, path: '/news' },
        { text: 'Projects', icon: <ApartmentOutlined />, path: '/projects' },
      ],
    },
    {
      title: 'Sales',
      items: [
        isAdmin && { text: 'Enquiries', icon: <MarkEmailUnreadOutlined />, path: '/enquiries', count: newEnquiries },
        { text: 'Customers', icon: <StorefrontOutlined />, path: '/customers' },
        { text: 'Documents', icon: <DescriptionOutlined />, path: '/documents' },
      ].filter(Boolean),
    },
    { title: 'Settings', items: [{ text: 'Users', icon: <AdminPanelSettingsOutlined />, path: '/users' }] },
  ].filter(Boolean);

  const go = path => {
    // a Website page with unsaved changes (BlockEditor.js) asks first
    if (window.wdUnsavedChanges && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    window.wdUnsavedChanges = false;
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    setUserMenu(null);
    try {
      // Ends this admin's sessions on every device (server refuses older tokens).
      await apiClient.post(`/api/auth/admin/logout`);
    } catch {
      // Already expired or offline: still log out here.
    } finally {
      localStorage.removeItem('auth_token');
      setGlobalState({ isLoggedIn: false, userName: '', email: '', role: '' });
      navigate('/login');
      window.scrollTo({ top: 0 });
    }
  };

  const name = globalState.username || '';
  const menu = (
    <Box sx={{ py: 1 }}>
      {groups.map((g, gi) => (
        <List
          key={g.title || gi}
          dense
          subheader={
            g.title ? (
              <ListSubheader
                disableSticky
                sx={{
                  bgcolor: 'transparent',
                  lineHeight: '32px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  pl: 3,
                }}
              >
                {g.title}
              </ListSubheader>
            ) : null
          }
          sx={{ px: 1.5, py: 0.5 }}
        >
          {g.items.map(item => {
            const active = isActive(item.path, location.pathname);
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => go(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.25,
                  py: 0.9,
                  color: 'text.primary',
                  '& .MuiListItemIcon-root': { color: active ? 'primary.main' : 'text.secondary', minWidth: 36 },
                  '&.Mui-selected': { bgcolor: colors.goldSoft, color: colors.goldDark, '&:hover': { bgcolor: colors.goldSoft } },
                  '&:hover': { bgcolor: colors.lightGray },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 650 : 500, fontSize: '0.93rem' }} />
                {item.count > 0 && (
                  <Chip label={item.count > 99 ? '99+' : item.count} size="small" color="error" sx={{ height: 20, fontSize: '0.72rem' }} />
                )}
              </ListItemButton>
            );
          })}
        </List>
      ))}
    </Box>
  );

  return (
    <PublishProvider enabled={isAdmin}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: t => t.zIndex.drawer + 1 }}>
          <Toolbar sx={{ gap: 1.5, minHeight: { xs: 60, md: 64 } }}>
            {small && (
              <IconButton aria-label="Open menu" edge="start" onClick={() => setMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              onClick={() => go('/')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer', width: small ? 'auto' : drawerWidth - 24, flexShrink: 0 }}
            >
              <Box component="img" src="/favicon.svg" alt="" sx={{ height: 26 }} />
              <Box sx={{ lineHeight: 1.1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>Wadi Degla</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Admin
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
            {isAdmin && <PublishButton compact={small} />}
            <IconButton aria-label="Account" onClick={e => setUserMenu(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: colors.goldSoft, color: colors.goldDark, fontWeight: 700, fontSize: '0.95rem' }}>
                {name.slice(0, 1).toUpperCase() || '?'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenu}
              open={!!userMenu}
              onClose={() => setUserMenu(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography sx={{ fontWeight: 650 }}>{name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {roleLabel(globalState.role)}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Log out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={small ? 'temporary' : 'permanent'}
          open={small ? menuOpen : true}
          onClose={() => setMenuOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ width: small ? 0 : drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        >
          {/* spacer: on computers the menu starts below the top bar */}
          {!small && <Toolbar sx={{ minHeight: { md: 64 } }} />}
          {small && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 3, py: 2 }}>
              <Box component="img" src="/favicon.svg" alt="" sx={{ height: 24 }} />
              <Typography sx={{ fontWeight: 700 }}>Wadi Degla</Typography>
            </Box>
          )}
          {menu}
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, minWidth: 0, px: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 }, pt: { xs: 'calc(60px + 16px)', md: 'calc(64px + 32px)' } }}
        >
          <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </PublishProvider>
  );
}
