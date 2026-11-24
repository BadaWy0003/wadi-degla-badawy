import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, OpenInNew } from '@mui/icons-material';
import apiClient from '../../util/client';
import { SITE_URL } from '../../util/news';
import { colors } from '../../theme';
import StonePhotos from './StonePhotos';
import { CATEGORIES, FORMS, USES, TECH, TRAFFIC, OTHER_LANGS, EMPTY_DETAILS, detailsFromServer, stoneSlug } from './stone-fields';

// One page for everything about a stone (redesign step 2, 2026-11-24): Photos, Description
// (English + Arabic) and Specifications & uses, with one Save. Replaces the old Add, Edit,
// "More info" and "Website details" dialogs. Server: PUT/POST /api/storage/product and
// PUT /api/storage/admin/details/:id (only the parts that changed are sent).

const basicsOf = stone => ({
  name: stone?.name || '',
  type: (stone?.type || '').trim(),
  finishes: (stone?.finishes || []).map(f => ({ ...f })),
});

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function StoneEditor({ open, stone, onClose, onSaved, allStones }) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  const isNew = !stone;

  const [tab, setTab] = useState('photos');
  const [basics, setBasics] = useState(basicsOf(stone));
  const [savedBasics, setSavedBasics] = useState(basicsOf(stone));
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [savedDetails, setSavedDetails] = useState(EMPTY_DETAILS);
  const [translated, setTranslated] = useState(0);
  const [stoneId, setStoneId] = useState(stone?.id || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  useEffect(() => {
    if (!open) return;
    setTab('photos');
    setError('');
    setDone('');
    setBasics(basicsOf(stone));
    setSavedBasics(basicsOf(stone));
    setDetails(EMPTY_DETAILS);
    setSavedDetails(EMPTY_DETAILS);
    setTranslated(0);
    setStoneId(stone?.id || null);
    if (!stone) return;
    setLoading(true);
    apiClient
      .get(`/api/storage/admin/details/${stone.id}`)
      .then(({ data: res }) => {
        const d = detailsFromServer(res.data);
        setDetails(d);
        setSavedDetails(d);
        setTranslated(OTHER_LANGS.filter(l => res.data?.description?.[l]).length);
      })
      .catch(() => setError('The description and specifications could not be loaded. Close and open the stone again.'))
      .finally(() => setLoading(false));
  }, [open, stone]);

  const basicsChanged = !same(basics, savedBasics);
  const detailsChanged = !same(details, savedDetails);
  const changed = basicsChanged || detailsChanged;
  const englishChanged = translated > 0 && details.description.en.trim() !== savedDetails.description.en.trim();

  const nameTaken = useMemo(() => {
    const n = basics.name.trim().toLowerCase();
    return (
      !!n &&
      (allStones || []).some(
        s =>
          s.id !== stoneId &&
          String(s.name || '')
            .trim()
            .toLowerCase() === n,
      )
    );
  }, [basics.name, allStones, stoneId]);

  const problems = [];
  if (!basics.name.trim()) problems.push('Write the stone’s name.');
  if (!basics.type) problems.push('Choose a category.');
  if (!basics.finishes.length) problems.push('Add at least one photo.');
  if (nameTaken) problems.push('Another stone already has this name.');

  const close = () => {
    if (saving) return;
    if (changed && !window.confirm('You have unsaved changes. Close without saving?')) return;
    onClose();
  };

  const setText = (field, lang, value) => setDetails(d => ({ ...d, [field]: { ...d[field], [lang]: value } }));
  const toggle = (field, key) => setDetails(d => ({ ...d, [field]: d[field].includes(key) ? d[field].filter(x => x !== key) : [...d[field], key] }));

  const saveBasics = async () => {
    const form = new FormData();
    form.append('name', basics.name.trim());
    form.append('type', basics.type);
    // finishes with a new photo are sent without a link, followed by their files in the same order
    const list = basics.finishes.map(f => ({ finishName: f.finish, link: f.file ? undefined : f.link }));
    form.append('finishes', JSON.stringify(list));
    basics.finishes.filter(f => f.file).forEach(f => form.append('files', f.file, `${stoneSlug(basics.name) || 'stone'}.webp`));
    if (stoneId) {
      await apiClient.put(`/api/storage/product/${stoneId}`, form);
      return stoneId;
    }
    await apiClient.post('/api/storage/upload', form);
    // the server doesn't return the new id: find the new stone in the list
    const { data: res } = await apiClient.get('/api/storage/admin/all');
    const known = new Set((allStones || []).map(s => s.id));
    const created = (res.data || []).find(s => !known.has(s.id) && String(s.name).trim() === basics.name.trim());
    return created?.id || null;
  };

  const save = async () => {
    if (problems.length) {
      setTab('photos');
      setError(problems.join(' '));
      return;
    }
    setSaving(true);
    setError('');
    setDone('');
    try {
      let id = stoneId;
      if (basicsChanged || !id) {
        id = await saveBasics();
        setStoneId(id);
      }
      if (detailsChanged && id) {
        const { data: res } = await apiClient.put(`/api/storage/admin/details/${id}`, details);
        const d = detailsFromServer(res.data);
        setDetails(d);
        setSavedDetails(d);
        setTranslated(OTHER_LANGS.filter(l => res.data?.description?.[l]).length);
      }
      // the saved photos now have links: reload the stone so a second Save doesn't upload again
      const { data: all } = await apiClient.get('/api/storage/admin/all');
      const fresh = (all.data || []).find(s => s.id === id);
      if (fresh) {
        setBasics(basicsOf(fresh));
        setSavedBasics(basicsOf(fresh));
      } else {
        setSavedBasics(basics);
      }
      setDone('Saved. Press Publish (top right) when you are ready to show it on the website.');
      onSaved?.();
    } catch (e) {
      setError(e.response?.data?.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const title = isNew && !stoneId ? 'New stone' : basics.name || savedBasics.name || 'Stone';
  const liveUrl = stone && !stone.hidden ? `${SITE_URL}/en/products/${stoneSlug(stone.name)}/` : null;
  const dirOf = l => (l === 'ar' ? 'rtl' : 'ltr');

  return (
    <Dialog open={open} onClose={close} fullScreen={phone} fullWidth maxWidth="lg" PaperProps={{
        sx: {
          height: { sm: '90vh' },
          // phones: the whole screen (the theme gives other dialogs an 8 px margin)
          '@media (max-width: 599.95px)': { m: 0, maxHeight: '100%', borderRadius: 0, width: '100%' },
        },
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 2, sm: 3 }, pt: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {basics.type || 'Stone'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.45rem' } }} noWrap>
              {title}
            </Typography>
            {stone?.hidden && <Chip size="small" label="Hidden from website" />}
          </Box>
        </Box>
        {liveUrl && !phone && (
          <Button size="small" variant="outlined" endIcon={<OpenInNew fontSize="small" />} href={liveUrl} target="_blank" rel="noopener noreferrer">
            View on website
          </Button>
        )}
        <IconButton aria-label="Close" onClick={close}>
          <Close />
        </IconButton>
      </Box>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{ px: { xs: 1, sm: 2 }, borderBottom: `1px solid ${colors.line}` }}
      >
        <Tab label="Photos" value="photos" />
        <Tab label="Description" value="text" />
        <Tab label={phone ? 'Specs & uses' : 'Specifications & uses'} value="specs" />
      </Tabs>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        {tab === 'photos' && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stone name"
                  value={basics.name}
                  onChange={e => setBasics(b => ({ ...b, name: e.target.value }))}
                  error={nameTaken}
                  helperText={
                    nameTaken
                      ? 'Another stone already has this name.'
                      : stone
                        ? 'Changing the name changes the stone’s web address.'
                        : 'As it should appear on the website, e.g. Galala'
                  }
                  inputProps={{ maxLength: 80 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={basics.type}
                  onChange={e => setBasics(b => ({ ...b, type: e.target.value }))}
                  helperText={
                    basics.type && !CATEGORIES.includes(basics.type)
                      ? 'The website doesn’t show this category: choose one of the 5.'
                      : 'Where the stone is listed on the website'
                  }
                  error={!!basics.type && !CATEGORIES.includes(basics.type)}
                >
                  {CATEGORIES.map(c => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                  {basics.type && !CATEGORIES.includes(basics.type) && <MenuItem value={basics.type}>{basics.type}</MenuItem>}
                </TextField>
              </Grid>
            </Grid>
            <StonePhotos finishes={basics.finishes} onChange={finishes => setBasics(b => ({ ...b, finishes }))} />
          </Box>
        )}

        {tab !== 'photos' && loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {tab === 'text' && !loading && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Shown on the stone’s page and spec sheet. Everything is optional: leave empty what you don’t know, and write only real facts.
            </Typography>
            {translated > 0 && (
              <Alert severity={englishChanged ? 'warning' : 'success'} sx={{ mb: 2 }}>
                {englishChanged
                  ? `You changed the English description: its ${translated} translations (French, Russian, Chinese…) will be removed when you save, and those languages will show the standard text until it is translated again.`
                  : `The English description is translated into ${translated} other languages.`}
              </Alert>
            )}
            <Grid container spacing={3}>
              {['en', 'ar'].map(l => (
                <Grid item xs={12} md={6} key={l}>
                  <Box dir={dirOf(l)}>
                    <Typography sx={{ fontWeight: 650, mb: 1.5 }}>{l === 'en' ? 'English' : 'العربية'}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={7}
                      label={l === 'en' ? 'Description (3–6 sentences)' : 'الوصف'}
                      helperText={
                        l === 'en'
                          ? 'What it looks like, where it comes from, what it is best for. Leave an empty line between paragraphs.'
                          : 'اختياري. إذا ترك فارغاً يظهر النص العربي العام للحجر.'
                      }
                      value={details.description[l]}
                      onChange={e => setText('description', l, e.target.value)}
                      inputProps={{ maxLength: 4000 }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label={l === 'en' ? 'Origin / quarry area' : 'المنشأ / منطقة المحجر'}
                      placeholder={l === 'en' ? 'e.g. Galala Mountain, Suez' : ''}
                      value={details.origin[l]}
                      onChange={e => setText('origin', l, e.target.value)}
                      inputProps={{ maxLength: 120 }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label={l === 'en' ? 'Colour & pattern' : 'اللون والنقشة'}
                      placeholder={l === 'en' ? 'e.g. Light beige, fine texture, few veins' : ''}
                      helperText={l === 'en' ? 'The website’s colour filter reads the words before “with”.' : ' '}
                      value={details.colour[l]}
                      onChange={e => setText('colour', l, e.target.value)}
                      inputProps={{ maxLength: 160 }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {tab === 'specs' && !loading && (
          <Box>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={details.otherNames}
              onChange={(e, value) =>
                setDetails(d => ({
                  ...d,
                  otherNames: value
                    .map(v => v.trim())
                    .filter(Boolean)
                    .slice(0, 10),
                }))
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...rest } = getTagProps({ index });
                  return <Chip key={key} {...rest} label={option} />;
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label="Other names it is sold under"
                  placeholder="Type a name and press Enter"
                  helperText="Trade names or common spellings, e.g. Egyptian Beige. Shown as “Also known as” and helps people find it on Google."
                />
              )}
              sx={{ mb: 3 }}
            />

            <Typography sx={{ fontWeight: 650 }}>Forms sold</Typography>
            <FormGroup row sx={{ mb: 2 }}>
              {FORMS.map(([k, label]) => (
                <FormControlLabel
                  key={k}
                  control={<Checkbox checked={details.forms.includes(k)} onChange={() => toggle('forms', k)} />}
                  label={label}
                />
              ))}
            </FormGroup>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Thicknesses"
                  placeholder="e.g. 2, 3"
                  InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
                  value={details.thicknesses}
                  onChange={e => setDetails(d => ({ ...d, thicknesses: e.target.value }))}
                  inputProps={{ maxLength: 80 }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Typical sizes"
                  placeholder="e.g. 60x60, 60x120 cm, slabs up to 300x180 cm"
                  helperText="The website adds “Other sizes and thicknesses available upon request.”"
                  value={details.sizes}
                  onChange={e => setDetails(d => ({ ...d, sizes: e.target.value }))}
                  inputProps={{ maxLength: 300 }}
                />
              </Grid>
            </Grid>

            <Typography sx={{ fontWeight: 650 }}>Uses</Typography>
            <Typography variant="body2" color="text.secondary">
              Only the ones that really fit this stone.
            </Typography>
            <FormGroup row sx={{ mb: 3 }}>
              {USES.map(([k, label]) => (
                <FormControlLabel
                  key={k}
                  control={<Checkbox checked={details.uses.includes(k)} onChange={() => toggle('uses', k)} />}
                  label={label}
                />
              ))}
            </FormGroup>

            <TextField
              select
              label="Floor traffic"
              value={details.traffic}
              onChange={e => setDetails(d => ({ ...d, traffic: e.target.value }))}
              helperText="Shown in the stone's Specifications. From the stone's test sheet: granites are usually heavy, marbles and limestones light."
              sx={{ mb: 3, width: { xs: '100%', md: 420 } }}
            >
              {TRAFFIC.map(([v, label]) => (
                <MenuItem key={v || 'none'} value={v}>
                  {label}
                </MenuItem>
              ))}
            </TextField>

            <Typography sx={{ fontWeight: 650 }}>Technical data</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Numbers only, from your lab test reports. Strengths in MPa: the website also shows psi.
            </Typography>
            <Grid container spacing={2}>
              {TECH.map(([k, label, unit]) => (
                <Grid item xs={6} md={4} key={k}>
                  <TextField
                    fullWidth
                    type="number"
                    label={label}
                    InputProps={{ endAdornment: <InputAdornment position="end">{unit}</InputAdornment> }}
                    value={details.tech[k]}
                    onChange={e => setDetails(d => ({ ...d, tech: { ...d.tech, [k]: e.target.value } }))}
                    inputProps={{ min: 0, step: 'any' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5, borderTop: `1px solid ${colors.line}`, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ mr: 'auto', minWidth: 0, flex: { xs: '1 1 auto', sm: '1 1 240px' } }}>
          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : done && !changed ? (
            <Typography variant="body2" sx={{ color: 'success.dark' }}>
              {done}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: changed ? 'block' : 'none', sm: 'block' } }}>
              {changed ? 'Unsaved changes' : 'Saving does not change the website until you Publish.'}
            </Typography>
          )}
        </Box>
        <Button onClick={close} disabled={saving}>
          Close
        </Button>
        <Button variant="contained" onClick={save} disabled={saving || loading || (!changed && !!stoneId)}>
          {saving ? 'Saving…' : isNew && !stoneId ? 'Add stone' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
