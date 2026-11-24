import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { articleUrl, canManageNews, formatDate, photoUrl } from '../../util/news';
import NewsForm from './NewsForm';
import PublishPanel from '../publish/PublishPanel';
import { colors } from '../../theme';

export default function News() {
  const { globalState } = useGlobalState();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [importing, setImporting] = useState(false);
  const [menu, setMenu] = useState(null); // {anchor, a}
  const allowed = canManageNews(globalState.role);

  const load = useCallback(async () => {
    try {
      const list = await apiClient.get('/api/news/admin/all');
      setArticles(list.data.data);
      setRefreshKey(k => k + 1);
    } catch {
      // error toast shown by apiClient
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  if (!allowed) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">News can be managed by Admins and Super Admins only.</Alert>
      </Box>
    );
  }

  const act = async request => {
    try {
      await request();
    } catch {
      return; // error toast shown by apiClient
    }
    load();
  };

  const run = request => {
    setMenu(null);
    return act(request);
  };

  const importExisting = async () => {
    setImporting(true);
    await act(() => apiClient.post('/api/news/admin/import'));
    setImporting(false);
  };

  if (loading) return <Box sx={{ p: 3 }}>Loading…</Box>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4">News</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ ml: 'auto' }}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add article
        </Button>
      </Box>

      <PublishPanel refreshKey={refreshKey} />

      {articles.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography sx={{ mb: 2 }}>
            There are no articles in the admin panel yet. The 7 articles currently on the website can be copied here once, then edited like any new
            article.
          </Typography>
          <Button variant="outlined" onClick={importExisting} disabled={importing}>
            {importing ? 'Importing…' : 'Import the 7 existing articles'}
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          {articles.map((a, i) => (
            <Box
              key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setEditing(a);
                setFormOpen(true);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setEditing(a);
                  setFormOpen(true);
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                px: { xs: 1.5, sm: 2 },
                py: 1.25,
                cursor: 'pointer',
                borderTop: i ? `1px solid ${colors.line}` : 'none',
                '&:hover': { bgcolor: '#faf8f4' },
              }}
            >
              <Box
                component="img"
                src={photoUrl(a.thumbnail)}
                alt=""
                sx={{ width: { xs: 64, sm: 88 }, height: { xs: 48, sm: 60 }, objectFit: 'cover', borderRadius: 1.5, flexShrink: 0, opacity: a.hidden ? 0.5 : 1, bgcolor: colors.lightGray }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, lineHeight: 1.35 }}>{a.title.en}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 0.25 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(a.year, a.month)}
                  </Typography>
                  {a.pinned && <Chip size="small" color="primary" icon={<PushPinIcon />} label="Pinned" sx={{ height: 22 }} />}
                  {a.hidden && <Chip size="small" icon={<VisibilityOffIcon />} label="Hidden" sx={{ height: 22 }} />}
                  {!a.title.ar && (
                    <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a5a00', bgcolor: '#fff4e0', borderRadius: 1, px: 0.75 }}>
                      No Arabic
                    </Box>
                  )}
                </Box>
              </Box>
              <IconButton
                aria-label={`More actions for ${a.title.en}`}
                onClick={e => {
                  e.stopPropagation();
                  setMenu({ anchor: e.currentTarget, a });
                }}
                onKeyDown={e => e.stopPropagation()}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}

      <Menu
        anchorEl={menu?.anchor}
        open={!!menu}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menu && [
          <MenuItem
            key="edit"
            onClick={() => {
              setEditing(menu.a);
              setFormOpen(true);
              setMenu(null);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>,
          <MenuItem key="pin" onClick={() => run(() => apiClient.put(`/api/news/admin/${menu.a.id}/pin`, { pinned: !menu.a.pinned }))}>
            <ListItemIcon>{menu.a.pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}</ListItemIcon>
            {menu.a.pinned ? 'Unpin' : 'Pin to the top'}
          </MenuItem>,
          <MenuItem key="hide" onClick={() => run(() => apiClient.put(`/api/news/admin/${menu.a.id}/visibility`, { hidden: !menu.a.hidden }))}>
            <ListItemIcon>{menu.a.hidden ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}</ListItemIcon>
            {menu.a.hidden ? 'Show on website' : 'Hide from website'}
          </MenuItem>,
          <MenuItem key="open" component="a" href={articleUrl(menu.a.slug)} target="_blank" rel="noreferrer" onClick={() => setMenu(null)}>
            <ListItemIcon>
              <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            View on website
          </MenuItem>,
          menu.a.hidden ? (
            <MenuItem
              key="delete"
              sx={{ color: 'error.main' }}
              onClick={() => {
                setToDelete(menu.a);
                setMenu(null);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              Delete permanently
            </MenuItem>
          ) : (
            <MenuItem key="delete-info" disabled sx={{ whiteSpace: 'normal', maxWidth: 260, fontSize: '0.8rem' }}>
              To delete an article, hide it first.
            </MenuItem>
          ),
        ]}
      </Menu>

      <NewsForm
        open={formOpen}
        article={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          load();
        }}
      />

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete permanently?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            “{toDelete?.title.en}” and the photos uploaded for it will be deleted for good. This cannot be undone. To just remove it from the website,
            hiding it is enough.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              const id = toDelete.id;
              setToDelete(null);
              await act(() => apiClient.delete(`/api/news/admin/${id}`));
            }}
          >
            Delete permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
