import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Inventory,
  Collections,
  Group,
  People,
  DriveFolderUpload,
  MarkEmailUnread,
  Apartment,
  CheckCircle,
  WarningAmber,
  ChevronRight,
} from '@mui/icons-material';
import { useGlobalState } from '../GlobalStateContext';
import apiClient from '../../util/client';
import PublishPanel from '../publish/PublishPanel';

// Admin panel home page: what needs attention (from GET /api/overview/admin,
// server/src/services/overview.service.js). Admins and Super Admins also see the enquiries,
// the website's publish state, projects and news; moderators the stone checks.

const fmtDate = ms => (ms ? new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');

function StatCard({ icon, value, label, sub, onClick, highlight }) {
  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderColor: highlight ? 'error.main' : 'divider',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <Box sx={{ color: highlight ? 'error.main' : 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="body2">{label}</Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

const QUICK_LINKS = [
  { title: 'Products', icon: <Inventory />, path: '/products' },
  { title: 'Gallery', icon: <Collections />, path: '/gallery' },
  { title: 'Users', icon: <Group />, path: '/users' },
  { title: 'Customers', icon: <People />, path: '/customers' },
  { title: 'Documents', icon: <DriveFolderUpload />, path: '/documents' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { globalState } = useGlobalState();
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    apiClient
      .get('/api/overview/admin')
      .then(({ data: res }) => setData(res.data))
      .catch(() => setFailed(true));
  }, []);

  const stats = data?.stats || {};
  const items = data?.items || [];
  const important = items.filter(i => i.level === 'important');

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
        Welcome back{globalState.username ? `, ${globalState.username}` : ''}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {!data
          ? ' '
          : important.length
            ? `${important.length} thing${important.length === 1 ? '' : 's'} on the website need${important.length === 1 ? 's' : ''} attention.`
            : 'Everything important on the website is in place.'}
      </Typography>

      {failed && (
        <Alert severity="error" sx={{ mb: 2 }}>
          The overview couldn't be loaded. Please refresh the page.
        </Alert>
      )}
      {!data && !failed && <CircularProgress />}

      {data && (
        <>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, mb: 3 }}>
            {data.enquiries && (
              <StatCard
                icon={<MarkEmailUnread fontSize="large" />}
                value={data.enquiries.newCount}
                label={data.enquiries.newCount === 1 ? 'New enquiry' : 'New enquiries'}
                highlight={data.enquiries.newCount > 0}
                onClick={() => navigate('/enquiries')}
              />
            )}
            <StatCard
              icon={<Inventory fontSize="large" />}
              value={stats.stones}
              label="Stones on the website"
              sub={stats.hiddenStones ? `${stats.hiddenStones} hidden` : undefined}
              onClick={() => navigate('/products')}
            />
            {data.isAdmin && (
              <StatCard icon={<Apartment fontSize="large" />} value={stats.projects} label="Projects" onClick={() => navigate('/projects')} />
            )}
            <StatCard
              icon={<Collections fontSize="large" />}
              value={stats.galleryPhotos}
              label="Gallery photos"
              onClick={() => navigate('/gallery')}
            />
          </Box>

          {data.isAdmin && <PublishPanel />}

          <Box
            sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: data.enquiries ? '3fr 2fr' : '1fr' }, mt: 2, alignItems: 'start' }}
          >
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Needs attention
              </Typography>
              {items.length === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', py: 1 }}>
                  <CheckCircle /> <Typography>All good. Nothing is missing.</Typography>
                </Box>
              )}
              {items.map(i => (
                <Box
                  key={i.id}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.25, borderTop: '1px solid', borderColor: 'divider' }}
                >
                  <Chip
                    size="small"
                    label={i.count}
                    color={i.level === 'important' ? 'warning' : 'default'}
                    sx={{ minWidth: 40, fontWeight: 700, mt: 0.25 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: i.level === 'important' ? 600 : 400 }}>
                      {i.label}
                    </Typography>
                    {i.names?.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {i.names.join(', ')}
                        {i.count > i.names.length ? ` and ${i.count - i.names.length} more` : ''}
                      </Typography>
                    )}
                  </Box>
                  <Button size="small" endIcon={<ChevronRight />} onClick={() => navigate(i.path)} sx={{ flexShrink: 0 }}>
                    Open
                  </Button>
                </Box>
              ))}
            </Paper>

            {data.enquiries && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Latest new enquiries
                  </Typography>
                  <Button size="small" onClick={() => navigate('/enquiries')}>
                    See all
                  </Button>
                </Box>
                {data.enquiries.recent.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No new enquiries. Well done!
                  </Typography>
                )}
                {data.enquiries.recent.map(e => (
                  <Box
                    key={e.id}
                    onClick={() => navigate('/enquiries')}
                    sx={{ py: 1.25, borderTop: '1px solid', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} dir="auto">
                        {e.name}
                      </Typography>
                      {e.emailSent === false && <WarningAmber color="warning" sx={{ fontSize: 16 }} />}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {[{ sample: 'Sample request', quote: 'Quote request' }[e.kind] || 'Contact form', e.product, e.country, fmtDate(e.createdAt)]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </>
      )}

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 4, mb: 1 }}>
        Quick links
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {QUICK_LINKS.map(l => (
          <Button key={l.path} variant="outlined" startIcon={l.icon} onClick={() => navigate(l.path)}>
            {l.title}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
