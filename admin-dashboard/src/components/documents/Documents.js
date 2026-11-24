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
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Search, DeleteOutline, PictureAsPdfOutlined, OpenInNew, DescriptionOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';
import { colors } from '../../theme';

// Documents (redesign step 5, 2026-11-24): the invoices and packing lists made here as PDFs
// (server/src/templates/*.hbs, kept privately in Storage). The list shows each document's
// number, customer and date (it used to show the internal id); "Open PDF" streams it with the
// admin's login (/api/export-pdf/invoice/:id/file).

const TYPE_LABEL = { INVOICE: 'Invoice', 'PACKING-LIST': 'Packing list', 'PRICING-LIST': 'Price list' };
const typeLabel = t => TYPE_LABEL[String(t || '').toUpperCase()] || String(t || 'Document');
const fmtDate = ts => {
  const ms = ts?._seconds ? ts._seconds * 1000 : null;
  return ms ? new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

const EMPTY = {
  documentType: 'INVOICE',
  proformaInvoice: '',
  invoiceDate: '',
  containerId: '',
  invoiceNumber: '',
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  rnc: '',
  notifyContent: '',
  shippingTerm: '',
  PaymentTerms: '',
  items: [{ id: '1', description: '', quantity: '', unitPrice: '', total: '' }],
};
const FORM_FIELDS = [
  ['invoiceNumber', 'Invoice number'],
  ['invoiceDate', 'Date'],
  ['proformaInvoice', 'Proforma invoice'],
  ['containerId', 'Container number'],
  ['customerName', 'Customer name'],
  ['customerAddress', 'Customer address'],
  ['customerPhone', 'Customer phone'],
  ['rnc', 'Tax ID / RNC'],
  ['notifyContent', 'Notify party'],
  ['shippingTerm', 'Shipping terms'],
  ['PaymentTerms', 'Payment terms'],
];

export default function Documents() {
  const [list, setList] = useState(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    apiClient
      .get('/api/export-pdf/all')
      .then(({ data }) => setList(data.data || []))
      .catch(() => setFailed(true));

  useEffect(() => {
    load();
  }, []);

  const types = useMemo(() => [...new Set((list || []).map(d => typeLabel(d.type)))], [list]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (list || [])
      .filter(d => type === 'all' || typeLabel(d.type) === type)
      .filter(
        d => !q || [d.invoiceNumber, d.customerName, d.containerId, d.proformaInvoice, typeLabel(d.type), d.id].join(' ').toLowerCase().includes(q),
      )
      .sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));
  }, [list, query, type]);

  // the tab is opened first (synchronously) so pop-up blockers allow it
  const view = async id => {
    const tab = window.open('', '_blank');
    try {
      const { data } = await apiClient.get(`/api/export-pdf/invoice/${id}/file`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      if (tab) tab.location.href = url;
      else window.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      if (tab) tab.close();
    }
  };

  const create = async () => {
    setSaving(true);
    try {
      await apiClient.post('/api/export-pdf/generate-upload-pdf', form);
      toast.success('Document created');
      setCreating(false);
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
      await apiClient.delete(`/api/export-pdf/invoice/${id}`);
      toast.success('Document deleted');
      load();
    } catch {
      // error toast shown by apiClient
    }
  };

  const setItem = (i, k, v) => setForm(f => ({ ...f, items: f.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Documents</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreating(true)} sx={{ ml: 'auto' }}>
          New document
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>
        {list ? `${list.length} invoices and packing lists, kept privately (only people logged in here can open them).` : ' '}
      </Typography>

      {failed && <Alert severity="error">The documents couldn't be loaded. Please refresh the page.</Alert>}
      {!list && !failed && <CircularProgress />}

      {list && (
        <>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search number, customer, container…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: '1 1 260px', maxWidth: { md: 420 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
            />
            {types.length > 1 &&
              ['all', ...types].map(t => (
                <Chip
                  key={t}
                  label={t === 'all' ? 'All' : t}
                  onClick={() => setType(t)}
                  color={type === t ? 'primary' : 'default'}
                  variant={type === t ? 'filled' : 'outlined'}
                  sx={{ ...(type !== t && { bgcolor: '#fff' }) }}
                />
              ))}
          </Box>

          <Paper sx={{ overflow: 'hidden' }}>
            {shown.length === 0 && (
              <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
                <DescriptionOutlined sx={{ fontSize: 40, mb: 1, color: colors.line }} />
                <Typography>{list.length ? 'No document matches.' : 'No documents yet.'}</Typography>
              </Box>
            )}
            {shown.map((d, i) => (
              <Box
                key={d.id}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderTop: i ? `1px solid ${colors.line}` : 'none' }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: colors.goldSoft,
                    color: colors.goldDark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PictureAsPdfOutlined />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                    {typeLabel(d.type)} {d.invoiceNumber || ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[d.customerName, d.containerId && `Container ${d.containerId}`, fmtDate(d.createdAt)].filter(Boolean).join(' · ') ||
                      'No details'}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OpenInNew fontSize="small" />}
                  onClick={() => view(d.id)}
                  disabled={!d.hasFile}
                  sx={{ flexShrink: 0, display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Open PDF
                </Button>
                <Tooltip title="Open PDF">
                  <span>
                    <IconButton
                      aria-label="Open PDF"
                      onClick={() => view(d.id)}
                      disabled={!d.hasFile}
                      sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    >
                      <OpenInNew />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Delete document">
                  <IconButton aria-label="Delete document" onClick={() => setToDelete(d)} sx={{ '&:hover': { color: 'error.main' } }}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Paper>
        </>
      )}

      <Dialog open={creating} onClose={() => !saving && setCreating(false)} fullWidth maxWidth="md">
        <DialogTitle>New invoice</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Makes an invoice PDF.
          </Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            {FORM_FIELDS.map(([k, label]) => (
              <TextField key={k} size="small" label={label} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            ))}
          </Box>
          <Typography sx={{ fontWeight: 650, mt: 3, mb: 1 }}>Items</Typography>
          {form.items.map((it, i) => (
            <Box key={i} sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr 1fr', sm: '3fr 1fr 1fr 1fr' }, mb: 1 }}>
              <TextField
                size="small"
                label="Description"
                value={it.description}
                onChange={e => setItem(i, 'description', e.target.value)}
                sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
              />
              <TextField size="small" label="Quantity" value={it.quantity} onChange={e => setItem(i, 'quantity', e.target.value)} />
              <TextField size="small" label="Unit price" value={it.unitPrice} onChange={e => setItem(i, 'unitPrice', e.target.value)} />
              <TextField size="small" label="Total" value={it.total} onChange={e => setItem(i, 'total', e.target.value)} />
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<Add />}
            onClick={() =>
              setForm(f => ({
                ...f,
                items: [...f.items, { id: String(f.items.length + 1), description: '', quantity: '', unitPrice: '', total: '' }],
              }))
            }
          >
            Add item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={create} disabled={saving}>
            {saving ? 'Creating PDF…' : 'Create PDF'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete this document?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {toDelete && `${typeLabel(toDelete.type)} ${toDelete.invoiceNumber || ''} and its PDF are deleted for good. This cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
