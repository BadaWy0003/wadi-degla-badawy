import { useState } from 'react';
import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import apiClient from '../../util/client';

// Small copies ("thumbs") of the stone photos make the website's product lists and guide pages
// much lighter. New uploads get one automatically; this button makes them for older photos
// (15 per request, repeated until none is missing). Originals are never changed.
// Shown only while some photos miss a small copy: `thumb` (640 px) or, since 2026-11-18,
// `mini` (320 px, for the small cards and swatches).
export default function SmallPhotosButton({ products, onDone }) {
  const missing = (products || []).reduce((n, p) => n + (p.finishes || []).filter(f => f?.link && (!f.thumb || !f.mini)).length, 0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  if (!missing && !progress) return null;

  const run = async () => {
    setRunning(true);
    setError('');
    let made = 0;
    let failed = 0;
    try {
      for (;;) {
        const { data } = await apiClient.post('/api/storage/admin/thumbs');
        made += data.data.done;
        failed += data.data.failed;
        setProgress({ made, failed, remaining: data.data.remaining });
        if (!data.data.remaining || !data.data.done) break;
      }
      onDone?.();
    } catch (e) {
      setError(
        e?.response?.status === 403 ? 'Only an Admin or Super Admin can do this.' : e?.response?.data?.message || 'Something went wrong. Try again.',
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <Box sx={{ my: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Small photos for the website
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {missing} photo{missing === 1 ? '' : 's'} have no small copy yet. Small copies make the website's product lists load faster. Your original
        photos are not changed. Takes a few minutes; keep this page open. Then click "Publish to website" (Website page).
      </Typography>
      <Button variant="contained" onClick={run} disabled={running || !missing}>
        {running ? 'Working…' : 'Create small photos'}
      </Button>
      {running && <LinearProgress sx={{ mt: 1 }} />}
      {progress && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Done: {progress.made} · Failed: {progress.failed} · Still missing: {progress.remaining}
        </Typography>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
