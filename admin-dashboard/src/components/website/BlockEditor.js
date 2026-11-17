import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import Field from './Field';
import PublishPanel from '../publish/PublishPanel';
import {
  buildSaveBody,
  checkAny,
  fieldId,
  nameNewItems,
  initialValues,
  loadBlock,
  loadVersions,
  restoreVersion,
  saveBlock,
  timeAgo,
} from '../../util/website';

// The founding year field also shows the years it gives (the website counts them itself).
const yearsNote = (f, value) =>
  f.name === 'foundedYear' && Number(value) > 1900 ? (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
      This year the website shows <b>{new Date().getFullYear() - Number(value)} years</b> in business.
    </Typography>
  ) : null;

const changedCount = v => Object.keys(v?.texts || {}).length + Object.keys(v?.data || {}).length;

function HistoryDialog({ id, open, onClose, onRestored, current }) {
  const [versions, setVersions] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setVersions(null);
    loadVersions(id)
      .then(setVersions)
      .catch(() => setVersions([]));
  }, [id, open]);

  const restore = async v => {
    const what = v.original ? "the website's original (every change on this page undone)" : `the version saved ${timeAgo(v.savedAt)}`;
    if (!window.confirm(`Put back ${what}? The current version is kept in the history too.`)) return;
    setBusy(true);
    try {
      await restoreVersion(id, v.id);
      toast.success('The earlier version is back. Publish to put it on the website.');
      onRestored();
      onClose();
    } catch {
      // error toast shown by apiClient
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>History</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Every save keeps the version before it (the last 30). Click one to put it back, then publish. Publishing adds no line here: the
          Publish panel shows when the website was last updated.
        </Typography>
        {current?.updatedAt ? (
          <Alert severity="info" icon={false} sx={{ mb: 1 }}>
            <b>Now:</b> saved {new Date(current.updatedAt).toLocaleString()}
            {current.updatedBy ? ` by ${current.updatedBy}` : ''} · {changedCount(current)} changed item
            {changedCount(current) === 1 ? '' : 's'}
          </Alert>
        ) : (
          <Alert severity="info" icon={false} sx={{ mb: 1 }}>
            <b>Now:</b> the website's original (nothing saved yet).
          </Alert>
        )}
        {!versions && <CircularProgress size={24} />}
        {versions && !versions.length && <Typography>No earlier versions yet: nothing has been saved on this page.</Typography>}
        <List dense>
          {(versions || []).map(v => (
            <ListItemButton key={v.id} disabled={busy} onClick={() => restore(v)}>
              <ListItemText
                primary={v.original ? "The website's original" : `${new Date(v.savedAt).toLocaleString()}${v.savedBy ? ` · ${v.savedBy}` : ''}`}
                secondary={
                  v.original ? 'Before any change on this page · click to restore' : `${v.changedFields} changed item${v.changedFields === 1 ? '' : 's'} · click to restore`
                }
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// One website page (block) as a form: its sections in page order, every field with its
// original and "Reset to original"; Save stores only what differs from the original.
export default function BlockEditor() {
  const { id } = useParams();
  const [state, setState] = useState(null); // { block, saved, defaults }
  const [values, setValues] = useState({});
  const [savedValues, setSavedValues] = useState({});
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fields = useMemo(() => (state ? state.block.sections.flatMap(s => s.fields) : []), [state]);

  const load = useCallback(async () => {
    try {
      const data = await loadBlock(id);
      const flds = data.block.sections.flatMap(s => s.fields);
      const v = initialValues(flds, data.saved, data.defaults);
      setState(data);
      setValues(v);
      setSavedValues(v);
      setShowErrors(false);
    } catch {
      setFailed(true);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = JSON.stringify(values) !== JSON.stringify(savedValues);

  // Warn before leaving with unsaved changes: closing the tab (beforeunload), the side menu
  // (Layout.js checks window.wdUnsavedChanges) and the back button below.
  useEffect(() => {
    window.wdUnsavedChanges = dirty;
    if (!dirty) return undefined;
    const warn = e => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      window.removeEventListener('beforeunload', warn);
      window.wdUnsavedChanges = false;
    };
  }, [dirty]);
  const navigate = useNavigate();
  const goBack = () => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    window.wdUnsavedChanges = false;
    navigate('/website');
  };

  const save = async () => {
    const problems = fields.filter(f => checkAny(f, values[fieldId(f)]));
    if (problems.length) {
      setShowErrors(true);
      toast.error(`Please check: ${problems.map(f => f.label).join(', ')}`);
      return;
    }
    setSaving(true);
    try {
      await saveBlock(id, buildSaveBody(fields, nameNewItems(fields, values), state.defaults));
      toast.success('Saved. Press "Publish to website" to put the changes on the live site.');
      await load();
      setRefreshKey(k => k + 1);
    } catch {
      // error toast shown by apiClient
    }
    setSaving(false);
  };

  if (failed) return <Alert severity="error">This page couldn't be loaded. Please refresh.</Alert>;
  if (!state) return <CircularProgress />;
  const { block, defaults } = state;

  return (
    <Box>
      <Button onClick={goBack} startIcon={<ArrowBackIcon />} sx={{ mb: 1 }}>
        All website pages
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: 260 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
            {block.title}
          </Typography>
          <Typography color="text.secondary">{block.description}</Typography>
        </Box>
        <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => setHistoryOpen(true)}>
          History
        </Button>
      </Box>

      <PublishPanel refreshKey={refreshKey} />

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mt: 2 }}>
        {/* sections list (wide screens) */}
        <Paper variant="outlined" sx={{ position: 'sticky', top: 96, width: 220, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
          <List dense>
            {block.sections.map(s => (
              <ListItemButton key={s.id} component="a" href={`#sec-${s.id}`}>
                <ListItemText primary={s.title} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Box sx={{ flexGrow: 1, minWidth: 0, display: 'grid', gap: 2, pb: 12 }}>
          {block.sections.map(s => (
            <Paper key={s.id} id={`sec-${s.id}`} variant="outlined" sx={{ p: { xs: 2, md: 3 }, scrollMarginTop: 96 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {s.title}
              </Typography>
              {s.help && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {s.help}
                </Typography>
              )}
              {s.fields.map(f => (
                <Field
                  key={fieldId(f)}
                  field={f}
                  value={values[fieldId(f)]}
                  defaults={defaults}
                  showErrors={showErrors}
                  onChange={v => setValues(old => ({ ...old, [fieldId(f)]: v }))}
                  extra={yearsNote(f, values[fieldId(f)])}
                />
              ))}
            </Paper>
          ))}
        </Box>
      </Box>

      {/* save bar, always visible */}
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          left: { xs: 16, md: 296 },
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          zIndex: 10,
        }}
      >
        <Typography sx={{ flexGrow: 1 }} color={dirty ? 'primary' : 'text.secondary'}>
          {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
        </Typography>
        {dirty && (
          <Button onClick={() => setValues(savedValues)} disabled={saving}>
            Discard
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          disabled={!dirty || saving}
          onClick={save}
        >
          Save changes
        </Button>
      </Paper>

      <HistoryDialog id={id} open={historyOpen} onClose={() => setHistoryOpen(false)} onRestored={load} current={state.saved} />
    </Box>
  );
}
