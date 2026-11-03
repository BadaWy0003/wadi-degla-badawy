import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { canManageNews } from '../../util/news';

// One-time import of the stone details spreadsheet (ADMIN/SUPER_ADMIN only).
// Safe to press again: the server only fills products that have no details yet.
export default function ImportDetailsButton() {
  const { globalState } = useGlobalState();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!canManageNews(globalState.role)) return null;

  const close = () => {
    if (busy) return;
    setOpen(false);
    setResult(null);
    setError('');
  };

  const runImport = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await apiClient.post('/api/storage/admin/details/import');
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setOpen(true)} sx={{ mr: 1 }}>
        Import stone details
      </Button>
      <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
        <DialogTitle>Import stone details</DialogTitle>
        <DialogContent>
          {!result && (
            <Typography>
              This adds the descriptions, other names, origin, colour and uses from the stone details spreadsheet (12 languages). Stones that already
              have website details are not changed.
            </Typography>
          )}
          {result && (
            <Alert severity="success">
              Imported: {result.imported}. Already had details (not changed): {result.skippedExisting}. Product no longer exists:{' '}
              {result.skippedMissing}.{result.imported > 0 && ' Press "Publish to website" on the News or Projects page to show them on the site.'}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={busy}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button variant="contained" onClick={runImport} disabled={busy}>
              {busy ? 'Importing…' : 'Import'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
