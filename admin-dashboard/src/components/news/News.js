import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { articleUrl, canManageNews, formatDate, photoUrl } from '../../util/news';
import NewsForm from './NewsForm';

const timeAgo = ms => {
  if (!ms) return '';
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return new Date(ms).toLocaleDateString();
};

// A publish was started but GitHub has not reported the new run yet (it takes a few
// seconds), or the run is still going.
const isUpdating = status => {
  if (!status) return false;
  const run = status.run;
  const startedMs = run?.startedAt ? new Date(run.startedAt).getTime() : 0;
  const waitingForRun = status.lastPublishAt && Date.now() - status.lastPublishAt < 10 * 60000 && startedMs < status.lastPublishAt - 5000;
  return !!waitingForRun || (!!run && run.status !== 'completed');
};

// Publish status + button. The website shows saved articles only after a publish
// (a website rebuild of about 5 minutes).
function PublishPanel({ status, onPublish, publishing }) {
  if (!status) return null;
  const run = status.run;
  const running = isUpdating(status);
  const failed = run && run.status === 'completed' && run.conclusion !== 'success';
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 260 }}>
        {!status.configured ? (
          <Alert severity="warning">Publishing is not set up yet (the GitHub key is missing on the server). Saved changes are kept safely.</Alert>
        ) : running ? (
          <Alert severity="info" icon={<CircularProgress size={18} />}>
            The website is being updated{status.lastPublishAt ? ` (started ${timeAgo(status.lastPublishAt)})` : ''}. It takes about 5 minutes.
          </Alert>
        ) : status.unpublishedChanges ? (
          <Alert severity="warning">There are saved changes that are not on the website yet.</Alert>
        ) : failed ? (
          <Alert severity="error">
            The last website update did not finish.{' '}
            <Link href={run.url} target="_blank" rel="noreferrer">
              Details
            </Link>
          </Alert>
        ) : (
          <Alert severity="success">
            The website is up to date{status.lastPublishAt ? ` (last published ${timeAgo(status.lastPublishAt)})` : ''}.
          </Alert>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={publishing ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
        disabled={!status.configured || publishing || running}
        onClick={onPublish}
      >
        Publish to website
      </Button>
    </Paper>
  );
}

export default function News() {
  const { globalState } = useGlobalState();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [importing, setImporting] = useState(false);
  const allowed = canManageNews(globalState.role);

  const load = useCallback(async () => {
    try {
      const [list, st] = await Promise.all([apiClient.get('/api/news/admin/all'), apiClient.get('/api/news/admin/publish')]);
      setArticles(list.data.data);
      setStatus(st.data.data);
    } catch {
      // error toast shown by apiClient
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  // While the website is being rebuilt, refresh the status every 20 seconds.
  useEffect(() => {
    if (!isUpdating(status)) return undefined;
    const timer = setInterval(async () => {
      try {
        const { data } = await apiClient.get('/api/news/admin/publish');
        setStatus(data.data);
      } catch {
        // ignore
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [status]);

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

  const publish = async () => {
    setPublishing(true);
    await act(() => apiClient.post('/api/news/admin/publish'));
    setPublishing(false);
  };

  const importExisting = async () => {
    setImporting(true);
    await act(() => apiClient.post('/api/news/admin/import'));
    setImporting(false);
  };

  if (loading) return <Box sx={{ p: 3 }}>Loading…</Box>;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
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

      <PublishPanel status={status} onPublish={publish} publishing={publishing} />

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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cover</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Arabic</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map(a => (
                <TableRow key={a.id} sx={a.hidden ? { opacity: 0.6 } : undefined}>
                  <TableCell sx={{ width: 96 }}>
                    <img src={photoUrl(a.thumbnail)} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 4 }} />
                  </TableCell>
                  <TableCell>
                    {a.title.en}
                    {a.pinned && <Chip size="small" color="primary" label="Pinned" sx={{ ml: 1 }} />}
                    {a.hidden && <Chip size="small" label="Hidden from website" sx={{ ml: 1 }} />}
                  </TableCell>
                  <TableCell>{formatDate(a.year, a.month)}</TableCell>
                  <TableCell>
                    {a.title.ar ? (
                      'Yes'
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        English shown
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
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
