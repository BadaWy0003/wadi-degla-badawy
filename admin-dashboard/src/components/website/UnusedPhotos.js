import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import apiClient from '../../util/client';

const API = '/api/storage/admin/unused-photos';
const BATCH = 300; // the server moves at most 300 per call

const mb = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const errorText = e =>
  e?.response?.status === 403 ? 'Only an Admin or Super Admin can do this.' : e?.response?.data?.message || 'Something went wrong. Try again.';

// "Unused photos" on the Website page: photos uploaded earlier that no product, gallery photo,
// news article, project or website page uses any more. They go to a bin first (kept 30 days,
// can be put back), so they stop costing Storage without any risk of losing a photo by mistake.
export default function UnusedPhotos() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const load = async () => {
    setError('');
    setInfo(null);
    try {
      const { data } = await apiClient.get(API);
      setInfo(data.data);
    } catch (e) {
      setError(errorText(e));
    }
  };

  const openDialog = () => {
    setOpen(true);
    setDone('');
    load();
  };

  const clean = async () => {
    setBusy(true);
    setError('');
    let moved = 0;
    let deleted = 0;
    try {
      const paths = info.files.map(f => f.path);
      for (let i = 0; i < paths.length; i += BATCH) {
        const { data } = await apiClient.post(`${API}/clean`, { paths: paths.slice(i, i + BATCH) });
        moved += data.data.moved;
        deleted += data.data.deletedFromBin;
      }
      setDone(
        `${moved} photo${moved === 1 ? '' : 's'} moved to the bin.` +
          (deleted ? ` ${deleted} older photo${deleted === 1 ? '' : 's'} (more than 30 days in the bin) deleted for good.` : ''),
      );
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
      load();
    }
  };

  const restore = async () => {
    setBusy(true);
    setError('');
    try {
      const { data } = await apiClient.post(`${API}/restore`);
      setDone(`${data.data.restored} photo${data.data.restored === 1 ? '' : 's'} put back.`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
      load();
    }
  };

  const files = info?.files || [];

  return (
    <>
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 320px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Unused photos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find photos that were uploaded but are not used anywhere any more, and remove them to save storage cost. They go to a bin first
              and can be put back for 30 days.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<CleaningServicesIcon />} onClick={openDialog}>
            Find unused photos
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => !busy && setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Unused photos</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {done && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {done}
            </Alert>
          )}
          {!info && !error && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography>Checking every photo… this can take up to a minute.</Typography>
            </Box>
          )}
          {info && (
            <>
              {info.blocked && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {info.blocked}
                </Alert>
              )}
              <Typography sx={{ mb: 1 }}>
                {files.length
                  ? `${files.length} of ${info.totalFiles} photos are not used anywhere (${mb(info.totalBytes)}).`
                  : `All ${info.totalFiles} photos are in use. Nothing to clean up.`}
              </Typography>
              {info.recentSkipped > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {info.recentSkipped} photo{info.recentSkipped === 1 ? ' was' : 's were'} uploaded in the last 7 days and{' '}
                  {info.recentSkipped === 1 ? 'is' : 'are'} not counted yet.
                </Typography>
              )}
              {info.bin.count > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  In the bin: {info.bin.count} photo{info.bin.count === 1 ? '' : 's'} ({mb(info.bin.bytes)}).
                </Typography>
              )}
              {files.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gap: 1,
                    gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                    maxHeight: 360,
                    overflowY: 'auto',
                  }}
                >
                  {files.map(f => (
                    <Box
                      key={f.path}
                      component="a"
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      title={`${f.path.split('/').pop()} (${mb(f.size)})`}
                      sx={{ display: 'block', aspectRatio: '1', bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}
                    >
                      <img src={f.url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          {info?.bin.count > 0 && (
            <Button onClick={restore} disabled={busy}>
              Put back the {info.bin.count} photo{info.bin.count === 1 ? '' : 's'} in the bin
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setOpen(false)} disabled={busy}>
            Close
          </Button>
          {files.length > 0 && (
            <Button variant="contained" color="error" onClick={clean} disabled={busy || !!info?.blocked}>
              {busy ? <CircularProgress size={20} color="inherit" /> : `Move ${files.length} photo${files.length === 1 ? '' : 's'} to the bin`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
