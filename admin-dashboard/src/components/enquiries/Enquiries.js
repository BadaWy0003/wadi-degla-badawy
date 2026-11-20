import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Download, Email, WhatsApp, WarningAmber, AttachFile } from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';

// Enquiries inbox: every message from the website's contact form and sample-request form,
// saved by the server before the email is sent (server/src/services/enquiries.service.js).
// ADMIN / SUPER_ADMIN only, like Website, News and Projects.

export const STATUSES = [
  { id: 'new', label: 'New', color: 'warning' },
  { id: 'replied', label: 'Replied', color: 'info' },
  { id: 'won', label: 'Won', color: 'success' },
  { id: 'lost', label: 'Lost', color: 'default' },
  { id: 'spam', label: 'Spam', color: 'default' },
];
const STATUS = Object.fromEntries(STATUSES.map(s => [s.id, s]));
const KIND = { contact: 'Contact form', sample: 'Sample request', quote: 'Quote request' };

const fmtDate = ms =>
  ms ? new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
const digits = s => String(s || '').replace(/[^\d]/g, '');
const stone = e =>
  e.items?.length ? `${e.items.length} stone${e.items.length === 1 ? '' : 's'}` : [e.product, e.finish].filter(Boolean).join(' · ');
// A quote request's stones as one line each (Excel export).
const itemLines = e => (e.items || []).map(i => [i.name, i.finish, i.quantity].filter(Boolean).join(' – ')).join('\n');

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
  ];
  const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [cols.map(c => cell(c[0])).join(','), ...rows.map(r => cols.map(c => cell(c[1](r))).join(','))].join('\r\n');
};

function Detail({ label, value, dir }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" dir={dir} sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  );
}

function EnquiryDialog({ enquiry, onClose, onSaved }) {
  const [status, setStatus] = useState(enquiry.status);
  const [note, setNote] = useState(enquiry.note || '');
  const [saving, setSaving] = useState(false);
  const changed = status !== enquiry.status || note !== (enquiry.note || '');
  const phone = enquiry.whatsapp || enquiry.phone;
  const subject =
    enquiry.kind === 'sample'
      ? `Your sample request: ${stone(enquiry)}`
      : enquiry.kind === 'quote'
        ? 'Your quote request to Wadi Degla'
        : 'Your enquiry to Wadi Degla';

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await apiClient.put(`/api/enquiries/admin/${enquiry.id}`, { status, note });
      onSaved(data.data);
      toast.success('Saved');
    } catch (e) {
      toast.error(e?.response?.data?.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
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
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {enquiry.name}
        <Typography variant="body2" color="text.secondary">
          {KIND[enquiry.kind]} · {fmtDate(enquiry.createdAt)}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {enquiry.emailSent === false && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            The email for this enquiry could not be sent. It is only here: please answer it from this page.
          </Alert>
        )}
        <Detail label="Email" value={enquiry.email} />
        <Detail label="Phone" value={enquiry.phone} />
        <Detail label="WhatsApp" value={enquiry.whatsapp} />
        <Detail label="Company" value={enquiry.company} dir="auto" />
        <Detail label="Country" value={enquiry.country} />
        <Detail label="Port" value={enquiry.port} dir="auto" />
        <Detail label="Address" value={enquiry.address} dir="auto" />
        {enquiry.items?.length ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Stones ({enquiry.items.length})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Stone</TableCell>
                  <TableCell>Finish</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enquiry.items.map((i, n) => (
                  <TableRow key={n}>
                    <TableCell>{i.name}</TableCell>
                    <TableCell>{i.finish}</TableCell>
                    <TableCell dir="auto">{i.quantity || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Detail label="Stone" value={stone(enquiry)} />
        )}
        <Detail label="Sent from" value={[enquiry.page, enquiry.lang && `(${enquiry.lang.toUpperCase()})`].filter(Boolean).join(' ')} />
        {enquiry.message && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" dir="auto" sx={{ whiteSpace: 'pre-wrap' }}>
              {enquiry.message}
            </Typography>
          </Box>
        )}
        {enquiry.attachment && (
          <Button sx={{ mt: 2 }} startIcon={<AttachFile />} onClick={download}>
            {enquiry.attachment.name}
          </Button>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          <Button variant="outlined" startIcon={<Email />} href={`mailto:${enquiry.email}?subject=${encodeURIComponent(subject)}`}>
            Reply by email
          </Button>
          {digits(phone).length >= 7 && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<WhatsApp />}
              href={`https://wa.me/${digits(phone)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </Button>
          )}
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
          Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <Chip
              key={s.id}
              label={s.label}
              color={status === s.id ? s.color : 'default'}
              variant={status === s.id ? 'filled' : 'outlined'}
              onClick={() => setStatus(s.id)}
            />
          ))}
        </Box>
        <TextField
          label="Private note (only seen here)"
          value={note}
          onChange={e => setNote(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          sx={{ mt: 2 }}
          inputProps={{ maxLength: 2000 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={save} disabled={!changed || saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Enquiries() {
  const [list, setList] = useState(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState('new');
  const [kind, setKind] = useState('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

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
        (!q || [e.name, e.email, e.company, e.country, e.product, e.phone, e.message].join(' ').toLowerCase().includes(q)),
    );
  }, [list, tab, kind, search]);

  const saved = updated => {
    setList(l => l.map(e => (e.id === updated.id ? { ...e, ...updated } : e)));
    setOpen(null);
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
        Enquiries
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 760 }}>
        Every message from the website's contact form, sample requests and quote requests. They are also emailed as before. Mark each one as you go, so nothing is
        forgotten.
      </Typography>

      {failed && <Alert severity="error">The enquiries couldn't be loaded. Please refresh the page.</Alert>}
      {!list && !failed && <CircularProgress />}

      {list && (
        <>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile sx={{ mb: 2 }}>
            {[...STATUSES, { id: 'all', label: 'All' }].map(s => (
              <Tab key={s.id} value={s.id} label={`${s.label} (${counts[s.id] || 0})`} />
            ))}
          </Tabs>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ minWidth: 220, flex: '1 1 220px' }}
            />
            <TextField size="small" select label="Type" value={kind} onChange={e => setKind(e.target.value)} sx={{ minWidth: 170 }}>
              <MenuItem value="all">All types</MenuItem>
              <MenuItem value="contact">Contact form</MenuItem>
              <MenuItem value="sample">Sample request</MenuItem>
              <MenuItem value="quote">Quote request</MenuItem>
            </TextField>
            <Button variant="outlined" startIcon={<Download />} onClick={exportCsv} disabled={!shown.length}>
              Export to Excel
            </Button>
          </Box>

          {shown.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4 }}>
              {list.length ? 'No enquiries here.' : 'No enquiries yet. New messages from the website will appear here.'}
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Type</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Country</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Stone</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shown.map(e => (
                    <TableRow key={e.id} hover onClick={() => setOpen(e)} sx={{ cursor: 'pointer' }}>
                      <TableCell sx={{ whiteSpace: { xs: 'normal', sm: 'nowrap' }, width: { xs: 90, sm: 'auto' } }}>{fmtDate(e.createdAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: e.status === 'new' ? 700 : 400 }} dir="auto">
                            {e.name}
                          </Typography>
                          {e.emailSent === false && (
                            <Tooltip title="The email was not sent: answer it from here">
                              <WarningAmber color="warning" fontSize="small" />
                            </Tooltip>
                          )}
                          {e.attachment && <AttachFile fontSize="small" color="action" />}
                        </Box>
                        <Typography variant="caption" color="text.secondary" dir="auto">
                          {[e.company, e.email].filter(Boolean).join(' · ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', md: 'none' } }}>
                          {[KIND[e.kind], e.country, stone(e)].filter(Boolean).join(' · ')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{KIND[e.kind]}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{e.country}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{stone(e)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={STATUS[e.status]?.label || e.status} color={STATUS[e.status]?.color || 'default'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {open && <EnquiryDialog enquiry={open} onClose={() => setOpen(null)} onSaved={saved} />}
    </Box>
  );
}
