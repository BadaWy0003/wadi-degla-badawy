import { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import apiClient from '../../util/client';

// Add a country (country = {}) or rename one (country = an existing country).
// onSaved(country) receives the saved country, so a form can select it right away.
export default function CountryDialog({ country, onClose, onSaved }) {
  const [name, setName] = useState({ en: '', ar: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const editing = !!country?.id;

  useEffect(() => {
    if (!country) return;
    setName({ en: country.name?.en || '', ar: country.name?.ar || '' });
    setError('');
  }, [country]);

  const save = async () => {
    if (name.en.trim().length < 2) return setError('Please write the English name.');
    setSaving(true);
    setError('');
    try {
      const { data } = editing
        ? await apiClient.put(`/api/projects/admin/countries/${country.id}`, { name })
        : await apiClient.post('/api/projects/admin/countries', { name });
      onSaved(data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!country} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>{editing ? 'Rename country' : 'Add country'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          autoFocus
          label="Country (English)"
          placeholder="e.g. Saudi Arabia"
          value={name.en}
          onChange={e => setName(n => ({ ...n, en: e.target.value }))}
          inputProps={{ maxLength: 60 }}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          fullWidth
          label="الدولة (Arabic, optional)"
          value={name.ar}
          onChange={e => setName(n => ({ ...n, ar: e.target.value }))}
          inputProps={{ maxLength: 60, dir: 'rtl' }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
