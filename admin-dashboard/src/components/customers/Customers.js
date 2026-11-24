import { useEffect, useMemo, useState } from 'react';
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
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Search, Close, Email, WhatsApp, Phone, DeleteOutline, ChevronRight, StorefrontOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { colors } from '../../theme';

// Customers (redesign step 5, 2026-11-24): the buyers' accounts (made on the website's signup
// page, or added here by the Owner). A list with search; a click opens the customer with
// contact buttons, details and the stones they saved. Adding and deleting: Owner only
// (the server's rule).

const digits = s => String(s || '').replace(/[^\d]/g, '');
const initials = name =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
const fmtDate = ts => {
  const ms = ts?._seconds ? ts._seconds * 1000 : typeof ts === 'number' ? ts : null;
  return ms ? new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

const EMPTY = { fullName: '', companyName: '', email: '', phone: '', whatsapp: '', country: '', address: '', port: '', rnc: '', password: '' };
const FIELDS = [
  ['fullName', 'Full name', true, 6],
  ['companyName', 'Company', true, 6],
  ['email', 'Email', true, 6],
  ['country', 'Country', true, 6],
  ['phone', 'Phone (numbers only, with country code)', true, 6],
  ['whatsapp', 'WhatsApp (optional)', false, 6],
  ['address', 'Address (optional)', false, 12],
  ['port', 'Port (optional)', false, 6],
  ['rnc', 'Tax ID / RNC (optional)', false, 6],
];

function Line({ label, value, href }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 0.75, borderBottom: `1px solid ${colors.line}` }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 110, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        component={href ? 'a' : 'p'}
        href={href}
        dir="auto"
        sx={{ wordBreak: 'break-word', color: href ? colors.goldDark : undefined }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function Customers() {
  const { globalState } = useGlobalState();
  const isOwner = globalState.role === 'SUPER_ADMIN';
  const [list, setList] = useState(null);
  const [failed, setFailed] = useState(false);
  const [stones, setStones] = useState({}); // id -> name (for the saved stones)
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    apiClient
      .get('/api/customer/all')
      .then(({ data }) => setList(Array.isArray(data) ? data : data.data || []))
      .catch(() => setFailed(true));

  useEffect(() => {
    load();
    apiClient
      .get('/api/storage/admin/all')
      .then(({ data }) => setStones(Object.fromEntries((data.data || []).map(s => [s.id, s.name]))))
      .catch(() => {});
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (list || [])
      .filter(c => !q || [c.fullName, c.companyName, c.email, c.country, c.phone, c.port].join(' ').toLowerCase().includes(q))
      .sort((a, b) => String(a.companyName || a.fullName).localeCompare(String(b.companyName || b.fullName)));
  }, [list, query]);

  const add = async () => {
    const missing = FIELDS.filter(([k, , req]) => req && !String(form[k]).trim()).map(([, label]) => label.split(' (')[0]);
    if (missing.length || !form.password) {
      toast.error(`Please fill in: ${[...missing, !form.password && 'Password'].filter(Boolean).join(', ')}`);
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/api/customer/create', { ...form, phone: digits(form.phone), whatsapp: digits(form.whatsapp) });
      toast.success('Customer added');
      setAdding(false);
      setForm(EMPTY);
      load();
    } catch {
      // error toast shown by apiClient
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const id = toDelete.id;
    setToDelete(null);
    try {
      await apiClient.delete(`/api/customer/delete/${id}`);
      toast.success('Customer deleted');
      setOpen(null);
      load();
    } catch {
      // error toast shown by apiClient
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Customers</Typography>
        {isOwner && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setAdding(true)} sx={{ ml: 'auto' }}>
            Add customer
          </Button>
        )}
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>
        {list ? `${list.length} customer accounts, made on the website's sign-up page${isOwner ? ' or added here' : ''}.` : ' '}
      </Typography>

      {failed && <Alert severity="error">The customers couldn't be loaded. Please refresh the page.</Alert>}
      {!list && !failed && <CircularProgress />}

      {list && (
        <>
          <TextField
            fullWidth
            size="small"
            placeholder="Search name, company, email, country…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, maxWidth: { md: 480 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
          />
          <Paper sx={{ overflow: 'hidden' }}>
            {shown.length === 0 && (
              <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
                <StorefrontOutlined sx={{ fontSize: 40, mb: 1, color: colors.line }} />
                <Typography>{list.length ? 'No customer matches.' : 'No customers yet.'}</Typography>
              </Box>
            )}
            {shown.map((c, i) => (
              <Box
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setOpen(c)}
                onKeyDown={e => e.key === 'Enter' && setOpen(c)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  borderTop: i ? `1px solid ${colors.line}` : 'none',
                  '&:hover': { bgcolor: '#faf8f4' },
                }}
              >
                <Avatar sx={{ bgcolor: colors.goldSoft, color: colors.goldDark, fontWeight: 700, fontSize: '0.9rem' }}>
                  {initials(c.companyName || c.fullName)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap dir="auto">
                    {c.companyName || c.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {[c.companyName && c.fullName, c.country, c.email].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
                {c.savedStones?.length > 0 && (
                  <Chip
                    size="small"
                    label={`${c.savedStones.length} saved stone${c.savedStones.length === 1 ? '' : 's'}`}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  />
                )}
                <ChevronRight sx={{ color: 'text.secondary' }} />
              </Box>
            ))}
          </Paper>
        </>
      )}

      {/* one customer */}
      <Dialog
        open={!!open}
        onClose={() => setOpen(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { '@media (max-width: 599.95px)': { m: 0, maxHeight: '100%', height: '100%', borderRadius: 0, width: '100%' } } }}
      >
        {open && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 3, pb: 2 }}>
              <Avatar sx={{ bgcolor: colors.goldSoft, color: colors.goldDark, fontWeight: 700 }}>
                {initials(open.companyName || open.fullName)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }} dir="auto">
                  {open.companyName || open.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[open.companyName && open.fullName, open.country].filter(Boolean).join(' · ')}
                </Typography>
                {fmtDate(open.createdAt) && (
                  <Typography variant="caption" color="text.secondary">
                    Customer since {fmtDate(open.createdAt)}
                  </Typography>
                )}
              </Box>
              <IconButton aria-label="Close" onClick={() => setOpen(null)}>
                <Close />
              </IconButton>
            </Box>
            <DialogContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
                <Button variant="contained" startIcon={<Email />} href={`mailto:${open.email}`}>
                  Email
                </Button>
                {digits(open.whatsapp || open.phone).length >= 7 && (
                  <Button
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    href={`https://wa.me/${digits(open.whatsapp || open.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: '#1a7f45', borderColor: '#bfe3cc', '&:hover': { borderColor: '#1a7f45', bgcolor: '#eef8f2' } }}
                  >
                    WhatsApp
                  </Button>
                )}
                {digits(open.phone).length >= 7 && (
                  <Button variant="outlined" startIcon={<Phone />} href={`tel:+${digits(open.phone)}`}>
                    Call
                  </Button>
                )}
              </Box>
              <Line label="Name" value={open.fullName} />
              <Line label="Email" value={open.email} href={`mailto:${open.email}`} />
              <Line label="Phone" value={open.phone} />
              <Line label="WhatsApp" value={open.whatsapp} />
              <Line label="Country" value={open.country} />
              <Line label="Address" value={open.address} />
              <Line label="Port" value={open.port} />
              <Line label="Tax ID / RNC" value={open.rnc} />
              {open.savedStones?.length > 0 && (
                <Box sx={{ mt: 2.5 }}>
                  <Typography sx={{ fontWeight: 650, fontSize: '0.9rem', mb: 1 }}>Stones they saved</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {open.savedStones.map(id => (
                      <Chip key={id} label={stones[id] || 'A removed stone'} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            {isOwner && (
              <DialogActions sx={{ px: 3, py: 1.5, borderTop: `1px solid ${colors.line}` }}>
                <Button color="error" startIcon={<DeleteOutline />} onClick={() => setToDelete(open)} sx={{ mr: 'auto' }}>
                  Delete customer
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>

      {/* add */}
      <Dialog open={adding} onClose={() => !saving && setAdding(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add customer</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {FIELDS.map(([k, label, req, md]) => (
              <Grid item xs={12} sm={md} key={k}>
                <TextField
                  fullWidth
                  size="small"
                  label={label}
                  required={req}
                  value={form[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Password for their website account"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                helperText="8–16 characters with a capital letter, a small letter, a number and a symbol. Send it to the customer yourself."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdding(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={add} disabled={saving}>
            {saving ? 'Adding…' : 'Add customer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete this customer?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {toDelete &&
              `${toDelete.companyName || toDelete.fullName} and their website account are deleted for good. They can't log in any more. This cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Delete customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
