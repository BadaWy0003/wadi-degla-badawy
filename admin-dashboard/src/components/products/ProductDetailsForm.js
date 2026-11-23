import { useEffect, useState } from 'react';
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
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import apiClient from '../../util/client';

// Stone details shown on the product's website page (description, other names, origin,
// sizes, uses, technical data). Stored separately from the product (server:
// product-details.service.js). Everything is optional.
export const FORMS = [
  ['slabs', 'Slabs'],
  ['tiles', 'Tiles (cut to size)'],
  ['blocks', 'Blocks'],
];
export const USES = [
  ['flooring', 'Flooring'],
  ['wallCladding', 'Wall cladding'],
  ['exteriorCladding', 'Exterior cladding / facades'],
  ['staircases', 'Staircases'],
  ['windowSills', 'Window sills'],
  ['countertops', 'Countertops'],
  ['landscaping', 'Landscaping / outdoor paving'],
];
const TECH = [
  ['density', 'Density', 'kg/m³'],
  ['waterAbsorption', 'Water absorption', '%'],
  ['compressiveStrength', 'Compressive strength', 'MPa'],
  ['flexuralStrength', 'Flexural strength', 'MPa'],
  ['abrasionResistance', 'Abrasion resistance', 'Ha'],
  ['modulusOfRupture', 'Modulus of rupture', 'MPa'],
];
const OTHER_LANGS = ['fr', 'es', 'de', 'it', 'ro', 'ko', 'sq', 'ru', 'ja', 'zh'];

const EMPTY = {
  description: { en: '', ar: '' },
  otherNames: [],
  origin: { en: '', ar: '' },
  colour: { en: '', ar: '' },
  forms: [],
  thicknesses: '',
  sizes: '',
  uses: [],
  tech: Object.fromEntries(TECH.map(([k]) => [k, ''])),
};

const fromServer = d => ({
  description: { en: d.description?.en || '', ar: d.description?.ar || '' },
  otherNames: d.otherNames || [],
  origin: { en: d.origin?.en || '', ar: d.origin?.ar || '' },
  colour: { en: d.colour?.en || '', ar: d.colour?.ar || '' },
  forms: d.forms || [],
  thicknesses: d.thicknesses || '',
  sizes: d.sizes || '',
  uses: d.uses || [],
  tech: Object.fromEntries(TECH.map(([k]) => [k, d.tech?.[k] ?? ''])),
});

export default function ProductDetailsForm({ product, onClose }) {
  const [data, setData] = useState(EMPTY);
  const [translated, setTranslated] = useState(0);
  const [savedEnglish, setSavedEnglish] = useState('');
  const [tab, setTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!product) return;
    setTab('en');
    setError('');
    setDone(false);
    setLoading(true);
    apiClient
      .get(`/api/storage/admin/details/${product.id}`)
      .then(({ data: res }) => {
        setData(fromServer(res.data));
        setSavedEnglish(res.data.description?.en || '');
        setTranslated(OTHER_LANGS.filter(l => res.data.description?.[l]).length);
      })
      .catch(() => setError('Could not load the details. Please try again.'))
      .finally(() => setLoading(false));
  }, [product]);

  const setText = (field, lang, value) => setData(d => ({ ...d, [field]: { ...d[field], [lang]: value } }));
  const toggle = (field, key) => setData(d => ({ ...d, [field]: d[field].includes(key) ? d[field].filter(x => x !== key) : [...d[field], key] }));

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const { data: res } = await apiClient.put(`/api/storage/admin/details/${product.id}`, data);
      setSavedEnglish(res.data.description?.en || '');
      setTranslated(OTHER_LANGS.filter(l => res.data.description?.[l]).length);
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const englishChanged = translated > 0 && data.description.en.trim() !== savedEnglish.trim();

  return (
    <Dialog open={!!product} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>Website details – {product?.name}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Shown on this stone's page on the website. Everything is optional: leave empty what you don't know. Please write only real facts.
            </Alert>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable" allowScrollButtonsMobile>
              <Tab label="English" value="en" />
              <Tab label="العربية (Arabic)" value="ar" />
              <Tab label="Specifications & uses" value="specs" />
            </Tabs>

            {(tab === 'en' || tab === 'ar') && (
              <Box dir={tab === 'ar' ? 'rtl' : 'ltr'}>
                {tab === 'en' && translated > 0 && (
                  <Alert severity={englishChanged ? 'warning' : 'success'} sx={{ mb: 2 }}>
                    {englishChanged
                      ? `You changed the English description: its ${translated} translations (French, Russian, Chinese…) will be removed when you save, and those languages will show the standard text until the new description is translated.`
                      : `This description is translated into ${translated} other languages.`}
                  </Alert>
                )}
                {tab === 'ar' && (
                  <Alert severity="info" sx={{ mb: 2 }} dir="ltr">
                    Optional. If left empty, the Arabic website shows the standard Arabic text for this stone.
                  </Alert>
                )}
                <TextField
                  fullWidth
                  multiline
                  minRows={6}
                  label={tab === 'en' ? 'Description (3-6 sentences)' : 'الوصف'}
                  helperText={
                    tab === 'en'
                      ? 'What the stone looks like, where it comes from, what it is best used for. Leave an empty line between paragraphs.'
                      : 'اترك سطراً فارغاً بين الفقرات.'
                  }
                  value={data.description[tab]}
                  onChange={e => setText('description', tab, e.target.value)}
                  inputProps={{ maxLength: 4000 }}
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={tab === 'en' ? 'Origin / quarry area' : 'المنشأ / منطقة المحجر'}
                      placeholder={tab === 'en' ? 'e.g. Galala Mountain, Suez' : ''}
                      value={data.origin[tab]}
                      onChange={e => setText('origin', tab, e.target.value)}
                      inputProps={{ maxLength: 120 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={tab === 'en' ? 'Colour & pattern' : 'اللون والنقشة'}
                      placeholder={tab === 'en' ? 'e.g. Light beige, fine texture, few veins' : ''}
                      value={data.colour[tab]}
                      onChange={e => setText('colour', tab, e.target.value)}
                      inputProps={{ maxLength: 160 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {tab === 'specs' && (
              <Box>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={data.otherNames}
                  onChange={(e, value) =>
                    setData(d => ({
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
                      helperText="Trade names or common spellings, e.g. Egyptian Beige. Shown as “Also known as” and helps people find the stone on Google."
                    />
                  )}
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle2">Forms sold</Typography>
                <FormGroup row sx={{ mb: 2 }}>
                  {FORMS.map(([k, label]) => (
                    <FormControlLabel
                      key={k}
                      control={<Checkbox checked={data.forms.includes(k)} onChange={() => toggle('forms', k)} />}
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
                      value={data.thicknesses}
                      onChange={e => setData(d => ({ ...d, thicknesses: e.target.value }))}
                      inputProps={{ maxLength: 80 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Typical sizes"
                      placeholder="e.g. 60x60, 60x120 cm, slabs up to 300x180 cm"
                      value={data.sizes}
                      onChange={e => setData(d => ({ ...d, sizes: e.target.value }))}
                      inputProps={{ maxLength: 300 }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2">Uses (only the ones that really fit this stone)</Typography>
                <FormGroup row sx={{ mb: 3 }}>
                  {USES.map(([k, label]) => (
                    <FormControlLabel
                      key={k}
                      control={<Checkbox checked={data.uses.includes(k)} onChange={() => toggle('uses', k)} />}
                      label={label}
                    />
                  ))}
                </FormGroup>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Technical data (numbers only, from your test reports; strengths in MPa, the website adds psi)
                </Typography>
                <Grid container spacing={2}>
                  {TECH.map(([k, label, unit]) => (
                    <Grid item xs={6} md={4} key={k}>
                      <TextField
                        fullWidth
                        type="number"
                        label={`${label} (${unit})`}
                        value={data.tech[k]}
                        onChange={e => setData(d => ({ ...d, tech: { ...d.tech, [k]: e.target.value } }))}
                        inputProps={{ min: 0, step: 'any' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {done && !error && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Saved. Press “Publish to website” (News or Projects page) to show it on the website.
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto', ml: 2 }}>
          Saving does not change the website yet. Use “Publish to website” when you are ready.
        </Typography>
        <Button onClick={onClose} disabled={saving}>
          Close
        </Button>
        <Button variant="contained" onClick={save} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
