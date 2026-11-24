import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  EditOutlined,
  OpenInNew,
  VisibilityOffOutlined,
  VisibilityOutlined,
  DeleteOutline,
  WarningAmberRounded,
  ImageNotSupportedOutlined,
} from '@mui/icons-material';
import apiClient from '../../util/client';
import { SITE_URL } from '../../util/news';
import { colors } from '../../theme';
import StoneEditor from './StoneEditor';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import SmallPhotosButton from './SmallPhotosButton';
import { CATEGORIES, mainPhoto, missingOf, stoneSlug } from './stone-fields';

// Stones (redesign step 2, 2026-11-24): a list with photos, category filters, search and
// "missing" marks; a click opens the stone's editor (StoneEditor.js). Hide/show, view on the
// website and delete (hidden stones only) are in each row's ⋯ menu.

const rowsKey = 'wd-products-rows';
const readRows = () => {
  try {
    return Number(localStorage.getItem(rowsKey)) || 25;
  } catch {
    return 25;
  }
};

export default function Products() {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState(null); // {id: details} of the stones visible on the website
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all'); // a category, 'hidden' or 'missing'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(readRows);
  const [editor, setEditor] = useState({ open: false, stone: null });
  const [menu, setMenu] = useState(null); // {anchor, stone}
  const [toDelete, setToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data: res } = await apiClient.get('/api/storage/admin/all');
      setData(res.data || []);
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
    apiClient
      .get('/api/storage/details')
      .then(({ data: res }) => setDetails(res.data || {}))
      .catch(() => setDetails(null));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const stones = useMemo(() => data.filter(p => String(p.type || '').trim() !== 'Gallery'), [data]);
  const withMarks = useMemo(
    () =>
      stones
        .map(s => ({ ...s, type: String(s.type || '').trim(), missing: missingOf(s, s.hidden || !details ? undefined : details[s.id] || null) }))
        .sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [stones, details],
  );

  const counts = useMemo(() => {
    const c = { all: withMarks.length, hidden: 0, missing: 0 };
    withMarks.forEach(s => {
      c[s.type] = (c[s.type] || 0) + 1;
      if (s.hidden) c.hidden += 1;
      if (s.missing.length) c.missing += 1;
    });
    return c;
  }, [withMarks]);
  const otherCategories = Object.keys(counts).filter(k => !['all', 'hidden', 'missing', ...CATEGORIES].includes(k));

  const shown = withMarks.filter(s => {
    if (category === 'hidden' && !s.hidden) return false;
    if (category === 'missing' && !s.missing.length) return false;
    if (!['all', 'hidden', 'missing'].includes(category) && s.type !== category) return false;
    const q = query.trim().toLowerCase();
    return !q || String(s.name).toLowerCase().includes(q);
  });

  useEffect(() => setPage(0), [query, category]);
  const lastPage = Math.max(0, Math.ceil(shown.length / rowsPerPage) - 1);
  const shownPage = Math.min(page, lastPage);
  const pageRows = shown.slice(shownPage * rowsPerPage, (shownPage + 1) * rowsPerPage);

  const toggleHidden = async stone => {
    setMenu(null);
    try {
      await apiClient.put(`/api/storage/product/${stone.id}/visibility`, { hidden: !stone.hidden });
    } catch {
      return; // error toast shown by apiClient
    }
    fetchProducts();
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/api/storage/product/${toDelete}`);
    } catch {
      // error toast shown by apiClient
    }
    setToDelete(null);
    fetchProducts();
  };

  const filters = [
    ['all', 'All'],
    ...CATEGORIES.map(c => [c, c]),
    ...otherCategories.map(c => [c, `${c} (not on website)`]),
    ['hidden', 'Hidden'],
    ['missing', 'Needs work'],
  ].filter(([k]) => k === 'all' || counts[k]);

  const open = stone => setEditor({ open: true, stone });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Stones</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => open(null)} sx={{ ml: 'auto' }}>
          Add stone
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2.5 }}>
        {loading
          ? ' '
          : `${counts.all} stones${counts.hidden ? ` · ${counts.hidden} hidden from the website` : ''}. Click a stone to edit its photos, description and specifications.`}
      </Typography>

      <SmallPhotosButton products={data} onDone={fetchProducts} />

      {failed && (
        <Alert severity="error" sx={{ mb: 2 }}>
          The stones couldn’t be loaded. Please refresh the page.
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: { xs: 1.5, sm: 2 } }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search stones by name"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5, maxWidth: { md: 420 } }}
        />
        <Box
          sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'nowrap', md: 'wrap' }, overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 0.5, md: 0 } }}
        >
          {filters.map(([k, label]) => (
            <Chip
              key={k}
              label={`${label} ${counts[k] ?? 0}`}
              onClick={() => setCategory(k)}
              color={category === k ? 'primary' : 'default'}
              variant={category === k ? 'filled' : 'outlined'}
              icon={k === 'missing' ? <WarningAmberRounded /> : undefined}
              sx={{ flexShrink: 0, ...(category !== k && { bgcolor: '#fff' }) }}
            />
          ))}
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          {pageRows.length === 0 && (
            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
              No stones match.
            </Typography>
          )}
          {pageRows.map((s, i) => {
            const photo = mainPhoto(s);
            const finishCount = (s.finishes || []).length;
            return (
              <Box
                key={s.id}
                onClick={() => open(s)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && open(s)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  px: { xs: 1.5, sm: 2 },
                  py: 1.25,
                  cursor: 'pointer',
                  borderTop: i ? `1px solid ${colors.line}` : 'none',
                  '&:hover': { bgcolor: '#faf8f4' },
                  '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: -2 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 52, sm: 64 },
                    height: { xs: 52, sm: 64 },
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexShrink: 0,
                    bgcolor: colors.lightGray,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: s.hidden ? 0.5 : 1,
                  }}
                >
                  {photo ? (
                    <Box component="img" src={photo} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageNotSupportedOutlined sx={{ color: 'text.disabled' }} />
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontWeight: 650 }} noWrap>
                      {s.name}
                    </Typography>
                    {s.hidden && <Chip size="small" label="Hidden" icon={<VisibilityOffOutlined />} sx={{ height: 22 }} />}
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {s.type} · {finishCount} photo{finishCount === 1 ? '' : 's'}
                  </Typography>
                  {s.missing.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {s.missing.map(m => (
                        <Box
                          key={m}
                          component="span"
                          sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#8a5a00', bgcolor: '#fff4e0', borderRadius: 1, px: 0.75, py: 0.1 }}
                        >
                          {m}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditOutlined />}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, flexShrink: 0 }}
                  onClick={e => {
                    e.stopPropagation();
                    open(s);
                  }}
                >
                  Edit
                </Button>
                <Tooltip title="More">
                  <IconButton
                    aria-label={`More actions for ${s.name}`}
                    onClick={e => {
                      e.stopPropagation();
                      setMenu({ anchor: e.currentTarget, stone: s });
                    }}
                    onKeyDown={e => e.stopPropagation()}
                  >
                    <MoreVert />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
          <TablePagination
            component="div"
            count={shown.length}
            page={shownPage}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Per page:"
            sx={{ borderTop: `1px solid ${colors.line}`, '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', justifyContent: 'flex-end' } }}
            onRowsPerPageChange={e => {
              const n = Number(e.target.value);
              setRowsPerPage(n);
              setPage(0);
              try {
                localStorage.setItem(rowsKey, String(n));
              } catch {
                /* private browsing: not remembered */
              }
            }}
          />
        </Paper>
      )}

      <Menu
        anchorEl={menu?.anchor}
        open={!!menu}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menu && [
          <MenuItem
            key="edit"
            onClick={() => {
              open(menu.stone);
              setMenu(null);
            }}
          >
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>,
          !menu.stone.hidden && (
            <MenuItem
              key="view"
              component="a"
              href={`${SITE_URL}/en/products/${stoneSlug(menu.stone.name)}/`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenu(null)}
            >
              <ListItemIcon>
                <OpenInNew fontSize="small" />
              </ListItemIcon>
              View on website
            </MenuItem>
          ),
          <MenuItem key="hide" onClick={() => toggleHidden(menu.stone)}>
            <ListItemIcon>{menu.stone.hidden ? <VisibilityOutlined fontSize="small" /> : <VisibilityOffOutlined fontSize="small" />}</ListItemIcon>
            {menu.stone.hidden ? 'Show on website' : 'Hide from website'}
          </MenuItem>,
          menu.stone.hidden ? (
            <MenuItem
              key="delete"
              onClick={() => {
                setToDelete(menu.stone.id);
                setMenu(null);
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteOutline fontSize="small" color="error" />
              </ListItemIcon>
              Delete permanently
            </MenuItem>
          ) : (
            <MenuItem key="delete-info" disabled sx={{ whiteSpace: 'normal', maxWidth: 260, fontSize: '0.8rem' }}>
              To delete a stone, hide it first.
            </MenuItem>
          ),
        ]}
      </Menu>

      <StoneEditor
        open={editor.open}
        stone={editor.stone}
        allStones={stones}
        onClose={() => setEditor({ open: false, stone: null })}
        onSaved={fetchProducts}
      />

      <DeleteConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} singleDelete count={1} />
    </Box>
  );
}
