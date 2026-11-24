import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
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
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, DeleteOutline, LockOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { roleLabel } from '../../util/roles';
import { colors } from '../../theme';

// Users of the admin panel (redesign step 5, 2026-11-24). Owner (SUPER_ADMIN) only, like the
// server's /api/admin routes. Roles must match server/src/validations/admin.validation.schema.js.
const ROLES = [
  { value: 'MODERATOR', title: 'Editor', text: 'Stones, gallery, customers and documents.' },
  { value: 'ADMIN', title: 'Admin', text: 'Also website texts, news, projects, enquiries and Publish.' },
  { value: 'SUPER_ADMIN', title: 'Owner', text: 'Everything, also adds and removes users.' },
];
const ROLE_COLOR = { SUPER_ADMIN: colors.goldDark, ADMIN: '#0277bd', MODERATOR: colors.muted };
const EMPTY = { username: '', email: '', password: '', role: 'MODERATOR' };

export default function Users() {
  const { globalState } = useGlobalState();
  const isOwner = globalState.role === 'SUPER_ADMIN';
  const [users, setUsers] = useState(null);
  const [failed, setFailed] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    apiClient
      .get('/api/admin/all')
      .then(({ data }) =>
        setUsers((Array.isArray(data) ? data : data.data || []).sort((a, b) => String(a.username).localeCompare(String(b.username)))),
      )
      .catch(() => setFailed(true));

  useEffect(() => {
    if (isOwner) load();
  }, [isOwner]);

  const me = u => u.email === globalState.email || u.username === globalState.username;

  const add = async () => {
    setSaving(true);
    try {
      await apiClient.post('/api/admin/create', form);
      toast.success(`${form.username} can now log in`);
      setAdding(false);
      setForm(EMPTY);
      load();
    } catch {
      // error toast shown by apiClient; the form stays open to fix it
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const u = toDelete;
    setToDelete(null);
    try {
      await apiClient.delete(`/api/admin/delete/${u.id}`);
      toast.success(`${u.username} removed`);
      load();
    } catch {
      // error toast shown by apiClient
    }
  };

  if (!isOwner) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Users
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 520 }}>
          <LockOutlined sx={{ fontSize: 36, color: colors.gold, mb: 1 }} />
          <Typography sx={{ fontWeight: 600 }}>Only the Owner manages users</Typography>
          <Typography variant="body2" color="text.secondary">
            You are logged in as {roleLabel(globalState.role)}. Ask the Owner to add someone or change a role.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAdding(true)} sx={{ ml: 'auto' }}>
          Add user
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>
        The people who can log in to this panel, and what each of them can change.
      </Typography>

      {failed && <Alert severity="error">The users couldn't be loaded. Please refresh the page.</Alert>}
      {!users && !failed && <CircularProgress />}

      {users && (
        <Paper sx={{ overflow: 'hidden', mb: 3 }}>
          {users.map((u, i) => (
            <Box
              key={u.id}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderTop: i ? `1px solid ${colors.line}` : 'none' }}
            >
              <Avatar sx={{ bgcolor: colors.goldSoft, color: colors.goldDark, fontWeight: 700 }}>{String(u.username || '?')[0].toUpperCase()}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {u.username}
                  </Typography>
                  {me(u) && <Chip size="small" label="You" sx={{ height: 22, fontSize: '0.75rem' }} />}
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {u.email}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={roleLabel(u.role)}
                variant="outlined"
                sx={{ fontWeight: 600, color: ROLE_COLOR[u.role], borderColor: ROLE_COLOR[u.role] }}
              />
              <Tooltip title={me(u) ? "You can't remove yourself" : `Remove ${u.username}`}>
                <span>
                  <IconButton
                    aria-label={`Remove ${u.username}`}
                    disabled={me(u)}
                    onClick={() => setToDelete(u)}
                    sx={{ '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))}
        </Paper>
      )}

      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
        What each role can do
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {ROLES.map(r => (
          <Paper key={r.value} sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 650, color: ROLE_COLOR[r.value] }}>{r.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {r.text}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Dialog open={adding} onClose={() => !saving && setAdding(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add user</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField size="small" label="Name" required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          <TextField
            size="small"
            label="Email (used to log in)"
            type="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <TextField
            size="small"
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            helperText="8–16 characters with a capital letter, a small letter, a number and a symbol. Send it to them yourself."
          />
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 1 }}>Role</Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {ROLES.map(r => {
                const on = form.role === r.value;
                return (
                  <Box
                    key={r.value}
                    role="radio"
                    aria-checked={on}
                    tabIndex={0}
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, role: r.value }))}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: `${on ? 2 : 1}px solid ${on ? colors.gold : colors.line}`,
                      bgcolor: on ? colors.goldSoft : '#fff',
                    }}
                  >
                    <Typography sx={{ fontWeight: 650 }}>{r.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdding(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={add} disabled={saving || !form.username || !form.email || !form.password}>
            {saving ? 'Adding…' : 'Add user'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Remove {toDelete?.username}?</DialogTitle>
        <DialogContent>
          <DialogContentText>They can no longer log in to the admin panel. Their past changes stay. You can add them again later.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
