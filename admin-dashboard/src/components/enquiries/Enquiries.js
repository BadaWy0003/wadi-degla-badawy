import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download, Email, WhatsApp, WarningAmber, AttachFile, Search, Close, Phone, InboxOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';
import { colors } from '../../theme';

// Enquiries inbox (redesign step 5, 2026-11-24): every message from the website's contact form,
// sample-request and quote-request forms, saved by the server before the email is sent
// (server/src/services/enquiries.service.js). The list is on the left and the open enquiry on
// the right (phones: full screen); a status is saved with one tap. ADMIN / SUPER_ADMIN only.

export const STATUSES = [
  { id: 'new', label: 'New', color: 'warning' },
  { id: 'replied', label: 'Replied', color: 'info' },
  { id: 'won', label: 'Won', color: 'success' },
  { id: 'lost', label: 'Lost', color: 'default' },
  { id: 'spam', label: 'Spam', color: 'default' },
];
const STATUS = Object.fromEntries(STATUSES.map(s => [s.id, s]));
const DOT = { new: '#ed6c02', replied: '#0288d1', won: '#2e7d32', lost: '#9e9e9e', spam: '#9e9e9e' };
const KIND = { contact: 'Contact form', sample: 'Sample request', quote: 'Quote request' };

// Where the buyer found the website (sent by the website with each enquiry since 2026-11-21).
const CHANNEL = {
  search: 'Google / search',
  ai: 'AI assistant',
  social: 'Social media',
  email: 'Email',
  ads: 'Ads',
  campaign: 'Campaign link',
  website: 'Other website',
  direct: 'Direct',
};
const sourceGroup = e => (e.source?.channel ? CHANNEL[e.source.channel] || e.source.channel : 'Not recorded');
const sourceText = e => {
  const s = e.source;
  if (!s?.channel) return '';
  if (s.channel === 'direct') return 'Direct (typed the address or a bookmark)';
  return [s.detail || CHANNEL[s.channel], s.campaign && `campaign "${s.campaign}"`].filter(Boolean).join(' · ');
};

const fmtDate = ms =>
  ms ? new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
// "14:05" today, "Mon" this week, else "12 Nov"
const shortDate = ms => {
  if (!ms) return '';
  const d = new Date(ms);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (now - d < 6 * 864e5) return d.toLocaleDateString('en-GB', { weekday: 'short' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(d.getFullYear() !== now.getFullYear() && { year: 'numeric' }) });
};
const digits = s => String(s || '').replace(/[^\d]/g, '');
const stone = e =>
  e.items?.length ? `${e.items.length} stone${e.items.length === 1 ? '' : 's'}` : [e.product, e.finish].filter(Boolean).join(' · ');
const itemLines = e => (e.items || []).map(i => [i.name, i.finish, i.size, i.quantity].filter(Boolean).join(' – ')).join('\n');
const initials = name =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

// Excel opens a UTF-8 CSV with a BOM correctly (Arabic names included).
const toCsv = rows => {
  const cols = [
    ['Date', e => fmtDate(e.createdAt)],
    ['Type', e => KIND[e.kind] || e.kind],
    ['Status', e => STATUS[e.status]?.label || e.status],
    ['Name', e => e.name],
    ['Email', e => e.email],
    ['Phone', e => e.phone],
    ['WhatsApp', e => e.whatsapp],
    ['Company', e => e.company],
    ['Country', e => e.country],
    ['Port', e => e.port],
    ['Address', e => e.address],
    ['Stone', e => (e.items?.length ? itemLines(e) : e.product)],
    ['Finish', e => e.finish],
    ['Message', e => e.message],
    ['Note', e => e.note],
    ['Language', e => e.lang],
    ['Page', e => e.page],
    ['Came from', e => sourceText(e)],
    ['First page', e => e.source?.landing],
  ];
  const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [cols.map(c => cell(c[0])).join(','), ...rows.map(r => cols.map(c => cell(c[1](r))).join(','))].join('\r\n');
};

function Line({ label, value, dir, href }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 0.75, borderBottom: `1px solid ${colors.line}` }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 110, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        dir={dir}
        component={href ? 'a' : 'p'}
        href={href}
        sx={{ wordBreak: 'break-word', color: href ? colors.goldDark : undefined }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// The open enquiry: contact buttons, status (saved at once), details, message, private note
function EnquiryView({ enquiry, onSaved, onClose }) {
  const [note, setNote] = useState(enquiry.note || '');
  const [busy, setBusy] = useState(false);
  useEffect(() => setNote(enquiry.note || ''), [enquiry.id, enquiry.note]);

  const phone = enquiry.whatsapp || enquiry.phone;
  const subject =
    enquiry.kind === 'sample'
      ? `Your sample request: ${stone(enquiry)}`
      : enquiry.kind === 'quote'
        ? 'Your quote request to Wadi Degla'
        : 'Your enquiry to Wadi Degla';

  const save = async (patch, message) => {
    setBusy(true);
    try {
      const { data } = await apiClient.put(`/api/enquiries/admin/${enquiry.id}`, { status: enquiry.status, note: enquiry.note || '', ...patch });
      onSaved(data.data);
      toast.success(message);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Couldn't save. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    try {
      const res = await apiClient.get(`/api/enquiries/admin/${enquiry.id}/attachment`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = enquiry.attachment.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Couldn't open the file.");
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
        <Avatar sx={{ bgcolor: colors.goldSoft, color: colors.goldDark, fontWeight: 700 }}>{initials(enquiry.name)}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.3 }} dir="auto">
            {enquiry.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {[KIND[enquiry.kind], enquiry.company, enquiry.country].filter(Boolean).join(' · ')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fmtDate(enquiry.createdAt)}
          </Typography>
        </Box>
        {onClose && (
          <IconButton aria-label="Close" onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </Box>

      {enquiry.emailSent === false && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          The email for this enquiry could not be sent. It is only here: please answer it from this page.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
        <Button variant="contained" startIcon={<Email />} href={`mailto:${enquiry.email}?subject=${encodeURIComponent(subject)}`}>
          Reply by email
        </Button>
        {digits(phone).length >= 7 && (
          <Button
            variant="outlined"
            startIcon={<WhatsApp />}
            href={`https://wa.me/${digits(phone)}`}
            target="_blank"
            rel="noreferrer"
            sx={{ color: '#1a7f45', borderColor: '#bfe3cc', '&:hover': { borderColor: '#1a7f45', bgcolor: '#eef8f2' } }}
          >
            WhatsApp
          </Button>
        )}
        {digits(enquiry.phone).length >= 7 && (
          <Button variant="outlined" startIcon={<Phone />} href={`tel:+${digits(enquiry.phone)}`}>
            Call
          </Button>
        )}
      </Box>

      <Typography sx={{ fontWeight: 650, mb: 1, fontSize: '0.9rem' }}>Status</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
        {STATUSES.map(s => (
          <Chip
            key={s.id}
            label={s.label}
            disabled={busy}
            color={enquiry.status === s.id ? s.color : 'default'}
            variant={enquiry.status === s.id ? 'filled' : 'outlined'}
            onClick={() => enquiry.status !== s.id && save({ status: s.id }, `Marked as ${s.label}`)}
            sx={{ bgcolor: enquiry.status === s.id ? undefined : '#fff' }}
          />
        ))}
      </Box>

      {enquiry.message && (
        <Box sx={{ p: 2, bgcolor: colors.lightGray, borderRadius: 2, mb: 2.5 }}>
          <Typography variant="body2" dir="auto" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {enquiry.message}
          </Typography>
        </Box>
      )}

      {enquiry.items?.length > 0 && (
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontWeight: 650, mb: 0.5, fontSize: '0.9rem' }}>Stones ({enquiry.items.length})</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Stone</TableCell>
                <TableCell>Finish</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiry.items.map((i, n) => (
                <TableRow key={n}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.finish}</TableCell>
                  <TableCell dir="auto">{i.size || '—'}</TableCell>
                  <TableCell dir="auto">{i.quantity || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Line label="Email" value={enquiry.email} href={`mailto:${enquiry.email}`} />
      <Line label="Phone" value={enquiry.phone} />
      <Line label="WhatsApp" value={enquiry.whatsapp} />
      <Line label="Company" value={enquiry.company} dir="auto" />
      <Line label="Country" value={enquiry.country} />
      <Line label="Port" value={enquiry.port} dir="auto" />
      <Line label="Address" value={enquiry.address} dir="auto" />
      {!enquiry.items?.length && <Line label="Stone" value={stone(enquiry)} />}
      <Line label="Came from" value={sourceText(enquiry)} />
      <Line label="First page" value={enquiry.source?.landing} />
      <Line label="Sent from" value={[enquiry.page, enquiry.lang && `(${enquiry.lang.toUpperCase()})`].filter(Boolean).join(' ')} />

      {enquiry.attachment && (
        <Button sx={{ mt: 2 }} startIcon={<AttachFile />} onClick={download}>
          {enquiry.attachment.name}
        </Button>
      )}

      <TextField
        label="Private note (only seen here)"
        value={note}
        onChange={e => setNote(e.target.value)}
        multiline
        minRows={2}
        fullWidth
        sx={{ mt: 3 }}
        inputProps={{ maxLength: 2000 }}
      />
      {note !== (enquiry.note || '') && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
          <Button onClick={() => setNote(enquiry.note || '')} disabled={busy}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => save({ note }, 'Note saved')} disabled={busy}>
            Save note
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function Enquiries() {
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('lg'));
  const [list, setList] = useState(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState('new');
  const [kind, setKind] = useState('all');
  const [from, setFrom] = useState('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    apiClient
      .get('/api/enquiries/admin')
      .then(({ data }) => setList(data.data))
      .catch(() => setFailed(true));
  }, []);

  const counts = useMemo(() => {
    const c = { all: 0 };
    for (const e of list || []) {
      c[e.status] = (c[e.status] || 0) + 1;
      if (e.status !== 'spam') c.all += 1;
    }
    return c;
  }, [list]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (list || []).filter(
      e =>
        (tab === 'all' ? e.status !== 'spam' : e.status === tab) &&
        (kind === 'all' || e.kind === kind) &&
        (from === 'all' || sourceGroup(e) === from) &&
        (!q || [e.name, e.email, e.company, e.country, e.product, e.phone, e.message, e.note].join(' ').toLowerCase().includes(q)),
    );
  }, [list, tab, kind, from, search]);

  const fromCounts = useMemo(() => {
    const c = {};
    for (const e of list || []) if (e.status !== 'spam') c[sourceGroup(e)] = (c[sourceGroup(e)] || 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [list]);

  // the open enquiry stays open after its status changes (even if it leaves this tab)
  const open = (list || []).find(e => e.id === openId) || null;
  // wide screens: open the first one
  useEffect(() => {
    if (wide && !openId && shown.length) setOpenId(shown[0].id);
  }, [wide, openId, shown]);

  const saved = updated => {
    setList(l => l.map(e => (e.id === updated.id ? { ...e, ...updated } : e)));
    window.dispatchEvent(new Event('wd:enquiries-changed')); // menu badge
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(shown)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const listPane = (
    <Paper sx={{ overflow: 'hidden' }}>
      {shown.length === 0 ? (
        <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
          <InboxOutlined sx={{ fontSize: 40, mb: 1, color: colors.line }} />
          <Typography>{(list || []).length ? 'No enquiries here.' : 'No enquiries yet. New messages from the website will appear here.'}</Typography>
        </Box>
      ) : (
        shown.map((e, i) => {
          const active = open?.id === e.id && wide;
          const isNew = e.status === 'new';
          return (
            <Box
              key={e.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpenId(e.id)}
              onKeyDown={ev => ev.key === 'Enter' && setOpenId(e.id)}
              sx={{
                display: 'flex',
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                borderTop: i ? `1px solid ${colors.line}` : 'none',
                borderLeft: `3px solid ${active ? colors.gold : 'transparent'}`,
                bgcolor: active ? colors.goldSoft : 'transparent',
                '&:hover': { bgcolor: active ? colors.goldSoft : '#faf8f4' },
              }}
            >
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Avatar sx={{ width: 38, height: 38, fontSize: '0.85rem', bgcolor: colors.lightGray, color: colors.ink, fontWeight: 700 }}>
                  {initials(e.name)}
                </Avatar>
                <Box
                  title={STATUS[e.status]?.label}
                  sx={{
                    position: 'absolute',
                    right: -1,
                    bottom: -1,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: DOT[e.status] || '#9e9e9e',
                    border: '2px solid #fff',
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontWeight: isNew ? 700 : 500, flex: 1, minWidth: 0 }} noWrap dir="auto">
                    {e.name}
                  </Typography>
                  {e.emailSent === false && (
                    <Tooltip title="The email was not sent: answer it from here">
                      <WarningAmber color="warning" sx={{ fontSize: 18 }} />
                    </Tooltip>
                  )}
                  {e.attachment && <AttachFile sx={{ fontSize: 16, color: 'text.secondary' }} />}
                  <Typography
                    variant="caption"
                    sx={{ color: isNew ? colors.goldDark : 'text.secondary', fontWeight: isNew ? 700 : 400, flexShrink: 0 }}
                  >
                    {shortDate(e.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {[KIND[e.kind], stone(e), e.country].filter(Boolean).join(' · ')}
                </Typography>
                {(e.message || e.note) && (
                  <Typography variant="body2" color="text.secondary" noWrap dir="auto" sx={{ opacity: 0.8 }}>
                    {e.message || `Note: ${e.note}`}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })
      )}
    </Paper>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Enquiries</Typography>
        <Button variant="outlined" startIcon={<Download />} onClick={exportCsv} disabled={!list || !shown.length} sx={{ ml: 'auto' }}>
          Export to Excel
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>
        Every message from the website's contact form, sample and quote requests (also emailed as before). Mark each one as you go, so nothing is
        forgotten.
      </Typography>

      {failed && <Alert severity="error">The enquiries couldn't be loaded. Please refresh the page.</Alert>}
      {!list && !failed && <CircularProgress />}

      {list && (
        <>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, mb: 1.5 }}>
              {[...STATUSES, { id: 'all', label: 'All' }].map(s => (
                <Chip
                  key={s.id}
                  label={`${s.label} ${counts[s.id] || 0}`}
                  onClick={() => {
                    setTab(s.id);
                    if (wide) setOpenId(null);
                  }}
                  color={tab === s.id ? 'primary' : 'default'}
                  variant={tab === s.id ? 'filled' : 'outlined'}
                  sx={{ flexShrink: 0, fontWeight: 600, ...(tab !== s.id && { bgcolor: '#fff' }) }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search name, email, company, message…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 220, flex: '1 1 260px' }}
              />
              <TextField
                size="small"
                select
                label="Type"
                value={kind}
                onChange={e => setKind(e.target.value)}
                sx={{ minWidth: 160, flex: { xs: '1 1 140px', sm: '0 0 auto' } }}
              >
                <MenuItem value="all">All types</MenuItem>
                <MenuItem value="contact">Contact form</MenuItem>
                <MenuItem value="sample">Sample request</MenuItem>
                <MenuItem value="quote">Quote request</MenuItem>
              </TextField>
              <TextField
                size="small"
                select
                label="Came from"
                value={from}
                onChange={e => setFrom(e.target.value)}
                sx={{ minWidth: 170, flex: { xs: '1 1 140px', sm: '0 0 auto' } }}
              >
                <MenuItem value="all">All sources</MenuItem>
                {fromCounts.map(([name, n]) => (
                  <MenuItem key={name} value={name}>
                    {name} ({n})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Paper>

          {wide ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: 2, alignItems: 'start' }}>
              {listPane}
              <Paper sx={{ p: 3, position: 'sticky', top: 88, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                {open ? (
                  <EnquiryView enquiry={open} onSaved={saved} />
                ) : (
                  <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                    Choose an enquiry to read it.
                  </Typography>
                )}
              </Paper>
            </Box>
          ) : (
            <>
              {listPane}
              <Dialog
                open={!!open}
                onClose={() => setOpenId(null)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                  sx: {
                    p: { xs: 2, sm: 3 },
                    '@media (max-width: 599.95px)': { m: 0, maxHeight: '100%', height: '100%', borderRadius: 0, width: '100%' },
                  },
                }}
              >
                {open && <EnquiryView enquiry={open} onSaved={saved} onClose={() => setOpenId(null)} />}
              </Dialog>
            </>
          )}
        </>
      )}
    </Box>
  );
}
