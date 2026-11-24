import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Chip, CircularProgress, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Search, ChevronRight, Close } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { fieldId, initialValues, loadBlock, loadBlocks, timeAgo } from '../../util/website';
import { colors } from '../../theme';
import PublishPanel from '../publish/PublishPanel';
import UnusedPhotos from './UnusedPhotos';

// "Pages & texts" (redesign step 4, 2026-11-24): the website's editable parts grouped by area,
// and a search that finds a page by name or ANY text on the website (it loads every page's
// fields the first time, ~33 small requests) and opens the page at that field
// (/website/<id>?field=<fieldId>, BlockEditor.js scrolls to it). ADMIN / SUPER_ADMIN only.

const GROUPS = [
  { title: 'Whole website', ids: ['company', 'site', 'google'] },
  { title: 'Main pages', ids: ['home', 'about', 'contactPage'] },
  {
    title: 'Stones & products',
    ids: ['productsList', 'stonePage', 'visualizerPage', 'inspiration', 'gallery', 'stoneCreations', 'cobbles', 'kerbstone', 'patterns'],
  },
  { title: 'Stone guides', prefix: 'topic' },
  { title: 'Company pages', ids: ['history', 'quarries', 'machinery', 'packing', 'exports', 'certificates', 'fairs', 'partners'] },
  { title: 'Projects & news', ids: ['projectsPage', 'newsPage'] },
];

const norm = s =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ًͯ-ٟ]/g, ''); // accents and Arabic vowel marks

// every piece of text inside a value (list items, {en, ar}…), photo addresses left out
const textsIn = v => {
  if (v == null) return [];
  if (typeof v === 'string' || typeof v === 'number') return [String(v)];
  if (Array.isArray(v)) return v.flatMap(textsIn);
  if (typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => (['src', 'id', 'width', 'height'].includes(k) ? [] : textsIn(x)));
  return [];
};

const snippet = (text, q) => {
  const i = norm(text).indexOf(q);
  if (i < 0) return null;
  const start = Math.max(0, i - 40);
  return {
    before: (start ? '…' : '') + text.slice(start, i),
    match: text.slice(i, i + q.length),
    after: text.slice(i + q.length, i + q.length + 60) + (text.length > i + q.length + 60 ? '…' : ''),
  };
};

function Row({ b, onOpen, first }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        borderTop: first ? 'none' : `1px solid ${colors.line}`,
        '&:hover': { bgcolor: '#faf8f4' },
        '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: -2 },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600 }}>{b.title}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {(b.usedOn || []).join(' · ')}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        {b.changedFields ? (
          <Chip size="small" label={`${b.changedFields} changed`} sx={{ bgcolor: colors.goldSoft, color: colors.goldDark, fontWeight: 600 }} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Original
          </Typography>
        )}
        {b.updatedAt && (
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, mt: 0.25 }}>
            saved {timeAgo(b.updatedAt)}
            {b.updatedBy ? ` by ${String(b.updatedBy).split('@')[0]}` : ''}
          </Typography>
        )}
      </Box>
      <ChevronRight sx={{ color: 'text.secondary' }} />
    </Box>
  );
}

export default function Website() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(null); // [{blockId, blockTitle, section, field, label, texts}]
  const [indexing, setIndexing] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    loadBlocks()
      .then(setBlocks)
      .catch(() => setFailed(true));
  }, []);

  const q = norm(query.trim());

  // the texts of every page: loaded once, the first time someone searches
  useEffect(() => {
    if (q.length < 3 || !blocks || started.current) return;
    started.current = true;
    setIndexing(true);
    Promise.all(
      blocks.map(b =>
        loadBlock(b.id)
          .then(data => {
            const fields = data.block.sections.flatMap(s => s.fields.map(f => ({ f, s })));
            const values = initialValues(
              fields.map(x => x.f),
              data.saved,
              data.defaults,
            );
            return fields.map(({ f, s }) => ({
              blockId: b.id,
              blockTitle: b.title,
              section: s.title,
              field: fieldId(f),
              label: f.label,
              texts: textsIn(values[fieldId(f)]),
            }));
          })
          .catch(() => []),
      ),
    )
      .then(all => setIndex(all.flat()))
      .finally(() => setIndexing(false));
  }, [q, blocks]);

  const pageMatches = useMemo(
    () => (q && blocks ? blocks.filter(b => norm([b.title, b.description, ...(b.usedOn || [])].join(' ')).includes(q)) : []),
    [q, blocks],
  );

  const textMatches = useMemo(() => {
    if (q.length < 3 || !index) return [];
    const out = [];
    for (const it of index) {
      const text = it.texts.find(t => norm(t).includes(q));
      if (text) out.push({ ...it, snip: snippet(text, q) });
      else if (norm(it.label).includes(q)) out.push({ ...it, snip: null });
      if (out.length >= 60) break;
    }
    return out;
  }, [q, index]);

  const grouped = useMemo(() => {
    if (!blocks) return [];
    const used = new Set();
    const out = GROUPS.map(g => {
      const list = g.prefix ? blocks.filter(b => b.id.startsWith(g.prefix)) : g.ids.map(id => blocks.find(b => b.id === id)).filter(Boolean);
      list.forEach(b => used.add(b.id));
      return { title: g.title, list };
    });
    const rest = blocks.filter(b => !used.has(b.id));
    if (rest.length) out.push({ title: 'Other', list: rest });
    return out.filter(g => g.list.length);
  }, [blocks]);

  const open = (id, field) => navigate(field ? `/website/${id}?field=${encodeURIComponent(field)}` : `/website/${id}`);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Pages & texts
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>
        The website's texts, numbers, photos and contact details. Changes are saved here first; press <b>Publish</b> (top right) to put them on the
        live site (about 5 to 10 minutes). Every save can be undone from the page's History.
      </Typography>

      <PublishPanel />

      <TextField
        fullWidth
        placeholder="Search any page or text, e.g. “since 1980”"
        value={query}
        onChange={e => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: query ? (
            <InputAdornment position="end">
              <IconButton aria-label="Clear search" size="small" onClick={() => setQuery('')}>
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{ mb: 3, maxWidth: { md: 640 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
      />

      {failed && <Alert severity="error">The website pages couldn't be loaded. Please refresh the page.</Alert>}
      {!blocks && !failed && <CircularProgress />}

      {q ? (
        <Box>
          {pageMatches.length > 0 && (
            <>
              <Typography sx={{ fontWeight: 650, mb: 1 }}>Pages</Typography>
              <Paper sx={{ overflow: 'hidden', mb: 3 }}>
                {pageMatches.map((b, i) => (
                  <Row key={b.id} b={b} first={!i} onOpen={() => open(b.id)} />
                ))}
              </Paper>
            </>
          )}
          <Typography sx={{ fontWeight: 650, mb: 1 }}>Texts on the website</Typography>
          {q.length < 3 ? (
            <Typography variant="body2" color="text.secondary">
              Type at least 3 letters to search inside the texts.
            </Typography>
          ) : indexing || !index ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
              <CircularProgress size={18} /> Searching every page…
            </Box>
          ) : textMatches.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No text contains “{query.trim()}”.
            </Typography>
          ) : (
            <Paper sx={{ overflow: 'hidden' }}>
              {textMatches.map((m, i) => (
                <Box
                  key={`${m.blockId}-${m.field}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => open(m.blockId, m.field)}
                  onKeyDown={e => e.key === 'Enter' && open(m.blockId, m.field)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    py: 1.25,
                    cursor: 'pointer',
                    borderTop: i ? `1px solid ${colors.line}` : 'none',
                    '&:hover': { bgcolor: '#faf8f4' },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      {m.blockTitle} › {m.section}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.label}</Typography>
                    {m.snip && (
                      <Typography variant="body2" color="text.secondary" dir="auto" sx={{ overflowWrap: 'anywhere' }}>
                        {m.snip.before}
                        <Box component="mark" sx={{ bgcolor: colors.goldSoft, color: colors.ink, fontWeight: 600, px: 0.25, borderRadius: 0.5 }}>
                          {m.snip.match}
                        </Box>
                        {m.snip.after}
                      </Typography>
                    )}
                  </Box>
                  <ChevronRight sx={{ color: 'text.secondary' }} />
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      ) : (
        grouped.map(g => (
          <Box key={g.title} sx={{ mb: 3 }}>
            <Typography
              sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}
            >
              {g.title}
            </Typography>
            <Paper sx={{ overflow: 'hidden' }}>
              {g.list.map((b, i) => (
                <Row key={b.id} b={b} first={!i} onOpen={() => open(b.id)} />
              ))}
            </Paper>
          </Box>
        ))
      )}

      {!q && (
        <Box sx={{ mt: 4 }}>
          <Typography
            sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}
          >
            Tools
          </Typography>
          <UnusedPhotos />
        </Box>
      )}
    </Box>
  );
}
