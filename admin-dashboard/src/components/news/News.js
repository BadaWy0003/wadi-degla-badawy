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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
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

export default function News() {
  const { globalState } = useGlobalState();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [importing, setImporting] = useState(false);
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
        <TableContainer component={Paper}>
          {/* Phones: cover, date and Arabic columns hidden (date shown under the title), tighter cells */}
          <Table sx={{ '& td, & th': { px: { xs: 1, sm: 2 } } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Cover</TableCell>
                <TableCell>Title</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Arabic</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map(a => (
                <TableRow key={a.id} sx={a.hidden ? { opacity: 0.6 } : undefined}>
                  <TableCell sx={{ width: 96, display: { xs: 'none', sm: 'table-cell' } }}>
                    <img src={photoUrl(a.thumbnail)} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 4 }} />
                  </TableCell>
                  <TableCell>
                    {a.title.en}
                    {a.pinned && <Chip size="small" color="primary" label="Pinned" sx={{ ml: 1 }} />}
                    {a.hidden && <Chip size="small" label="Hidden from website" sx={{ ml: 1 }} />}
                    <Box component="span" sx={{ display: { xs: 'block', sm: 'none' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                      {formatDate(a.year, a.month)}
                      {a.title.ar ? ' · Arabic ✓' : ''}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{formatDate(a.year, a.month)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {a.title.ar ? (
                      'Yes'
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        English shown
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: { xs: 'normal', sm: 'nowrap' } }}>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditing(a);
                          setFormOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={a.pinned ? 'Unpin' : 'Pin to the top'}>
                      <IconButton color="primary" onClick={() => act(() => apiClient.put(`/api/news/admin/${a.id}/pin`, { pinned: !a.pinned }))}>
                        {a.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={a.hidden ? 'Show on website' : 'Hide from website'}>
                      <IconButton
                        color="primary"
                        onClick={() => act(() => apiClient.put(`/api/news/admin/${a.id}/visibility`, { hidden: !a.hidden }))}
                      >
                        {a.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open on the website (after publishing)">
                      <IconButton component="a" href={articleUrl(a.slug)} target="_blank" rel="noreferrer">
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                    {a.hidden && (
                      <Tooltip title="Delete permanently">
                        <IconButton color="error" onClick={() => setToDelete(a)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
