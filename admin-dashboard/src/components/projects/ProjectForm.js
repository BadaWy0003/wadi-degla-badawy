import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import apiClient from '../../util/client';
import { photoUrl, uploadProjectPhotos } from '../../util/projects';
import CountryDialog from './CountryDialog';
import ProjectPreview from './ProjectPreview';

const EMPTY = {
  name: { en: '', ar: '' },
  city: { en: '', ar: '' },
  description: { en: '', ar: '' },
  countryId: '',
  thumbnail: '',
  images: [],
  materials: [],
  legacyMaterials: [],
};

// Add or edit one project: name, city and description in English (name required) and
// Arabic (optional), country, materials supplied (picked from the products), photos.
export default function ProjectForm({ open, project, countries, products, onCountryAdded, onClose, onSaved }) {
  const [data, setData] = useState(EMPTY);
  const [tab, setTab] = useState('en');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [countryDialog, setCountryDialog] = useState(null);
  const fileInput = useRef(null);
  const editing = !!project?.id;

  useEffect(() => {
    if (!open) return;
    const known = new Set(products.map(p => p.id));
    const materials = (project?.materials || []).filter(id => known.has(id));
    setData(
      project
        ? {
            name: { en: project.name?.en || '', ar: project.name?.ar || '' },
            city: { en: project.city?.en || '', ar: project.city?.ar || '' },
            description: { en: project.description?.en || '', ar: project.description?.ar || '' },
            countryId: project.countryId || '',
            thumbnail: project.thumbnail || '',
            images: project.images || [],
            materials,
            legacyMaterials: project.legacyMaterials || [],
          }
        : EMPTY,
    );
    setNotice(
      project && materials.length < (project.materials || []).length
        ? 'A material of this project was deleted from the products, so it was taken off the list. Save to confirm.'
        : '',
    );
    setTab('en');
    setError('');
    // products/countries change after a save elsewhere; only reset when the form opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project]);

  const setText = (field, lang, value) => setData(d => ({ ...d, [field]: { ...d[field], [lang]: value } }));
  const altText = () => data.name.en.trim() || 'Wadi Degla project';

  const addPhotos = async files => {
    if (!files?.length) return;
    setError('');
    try {
      setUploading(`Uploading 0 / ${files.length}…`);
      const links = await uploadProjectPhotos(files, (done, total) => setUploading(`Uploading ${done} / ${total}…`));
      setData(d => {
        const images = [...d.images, ...links.map((src, i) => ({ src, alt: `${altText()} image ${d.images.length + i + 1}` }))];
        return { ...d, images, thumbnail: d.thumbnail || links[0] };
      });
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading('');
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const removePhoto = src =>
    setData(d => {
      const images = d.images.filter(i => i.src !== src);
      return { ...d, images, thumbnail: d.thumbnail === src ? images[0]?.src || '' : d.thumbnail };
    });

  const problems = () => {
    if (data.name.en.trim().length < 2) return 'Please write the English name of the project.';
    if (!data.countryId) return 'Please choose the country (tab “Country & materials”).';
    if (!data.thumbnail) return 'Please add at least one photo (the first one becomes the cover).';
    return '';
  };

  const save = async () => {
    const p = problems();
    if (p) return setError(p);
    setSaving(true);
    setError('');
    const body = {
      name: data.name,
      city: data.city,
      description: data.description,
      countryId: data.countryId,
      thumbnail: data.thumbnail,
      images: data.images.map((img, i) => ({ src: img.src, alt: img.alt || `${altText()} image ${i + 1}` })),
      materials: data.materials,
      ...(editing ? { legacyMaterials: data.legacyMaterials } : {}),
    };
    try {
      if (editing) await apiClient.put(`/api/projects/admin/${project.id}`, body);
      else await apiClient.post('/api/projects/admin', body);
      onSaved();
    } catch (e) {
      setError(e.response?.data?.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const busy = saving || !!uploading;
  const country = countries.find(c => c.id === data.countryId);
  const productById = new Map(products.map(p => [p.id, p]));
  // Grouped by category in the picker (groupBy needs the options sorted by group).
  const options = [...products].sort((a, b) => String(a.type).localeCompare(String(b.type)) || a.name.localeCompare(b.name));
  const chosen = data.materials.map(id => productById.get(id)).filter(Boolean);
  const previewProject = { ...data, country: country?.name, materialNames: chosen.filter(p => !p.hidden).map(p => p.name) };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="lg">
      <DialogTitle>{editing ? `Edit project #${project.number}` : 'New project'}</DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable" allowScrollButtonsMobile>
          <Tab label="English" value="en" />
          <Tab label="العربية (Arabic)" value="ar" />
          <Tab label="Country & materials" value="details" />
          <Tab label="Photos" value="photos" />
          <Tab label="Preview" value="preview" />
        </Tabs>

        {notice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}

        {(tab === 'en' || tab === 'ar') && (
          <Box dir={tab === 'ar' ? 'rtl' : 'ltr'}>
            {tab === 'ar' && (
              <Alert severity="info" sx={{ mb: 2 }} dir="ltr">
                Optional. Any field left empty shows the English text on the Arabic website.
              </Alert>
            )}
            <TextField
              fullWidth
              label={tab === 'en' ? 'Project name (required)' : 'اسم المشروع'}
              value={data.name[tab]}
              onChange={e => setText('name', tab, e.target.value)}
              inputProps={{ maxLength: 150 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={tab === 'en' ? 'City (optional)' : 'المدينة'}
              helperText={tab === 'en' ? 'Shown before the country, e.g. “Nairobi - Kenya”.' : ''}
              value={data.city[tab]}
              onChange={e => setText('city', tab, e.target.value)}
              inputProps={{ maxLength: 80 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={6}
              label={tab === 'en' ? 'Description (optional)' : 'الوصف'}
              helperText={
                tab === 'en'
                  ? 'A few sentences about the project (what was supplied, where it was used). Also shown on Google. Leave an empty line between paragraphs.'
                  : 'اترك سطراً فارغاً بين الفقرات.'
              }
              value={data.description[tab]}
              onChange={e => setText('description', tab, e.target.value)}
              inputProps={{ maxLength: 5000 }}
            />
          </Box>
        )}

        {tab === 'details' && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 3 }}>
              <TextField
                select
                fullWidth
                label="Country (required)"
                value={data.countryId}
                onChange={e => setData(d => ({ ...d, countryId: e.target.value }))}
                helperText={editing && project.countryId !== data.countryId ? 'The project moves to the end of the new country’s group.' : ' '}
              >
                {countries.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name.en}
                    {c.name.ar ? ` · ${c.name.ar}` : ''}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="outlined" sx={{ whiteSpace: 'nowrap', mt: 1 }} onClick={() => setCountryDialog({})}>
                + New country
              </Button>
            </Box>

            <Autocomplete
              multiple
              options={options}
              value={chosen}
              onChange={(e, value) => setData(d => ({ ...d, materials: value.map(p => p.id) }))}
              getOptionLabel={p => p.name}
              groupBy={p => p.type}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderOption={(props, p) => (
                <li {...props} key={p.id}>
                  {p.name}
                  {p.hidden && (
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      (hidden product: not shown on the website)
                    </Typography>
                  )}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((p, i) => {
                  const { key, ...rest } = getTagProps({ index: i });
                  return (
                    <Chip
                      key={key}
                      {...rest}
                      label={p.hidden ? `${p.name} (hidden)` : p.name}
                      color={p.hidden ? 'default' : 'primary'}
                      variant="outlined"
                    />
                  );
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label="Materials supplied"
                  placeholder="Type a product name"
                  helperText="Shown as product cards on the project page, linking to each product."
                />
              )}
            />

            {data.legacyMaterials.length > 0 && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  These names came from the old website but match no product, so they are not shown. Pick the right product above, then remove them
                  here.
                </Typography>
                {data.legacyMaterials.map(n => (
                  <Chip
                    key={n}
                    label={n}
                    sx={{ mr: 1 }}
                    onDelete={() => setData(d => ({ ...d, legacyMaterials: d.legacyMaterials.filter(x => x !== n) }))}
                  />
                ))}
              </Alert>
            )}
          </Box>
        )}

        {tab === 'photos' && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Button variant="contained" component="label" disabled={busy}>
                Add photos
                <input
                  ref={fileInput}
                  hidden
                  multiple
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={e => addPhotos(e.target.files)}
                />
              </Button>
              {uploading && (
                <>
                  <CircularProgress size={20} />
                  <Typography variant="body2">{uploading}</Typography>
                </>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The star marks the cover photo (shown on the Projects page). All photos appear in the slider of the project page, in this order.
            </Typography>
            <Grid container spacing={1}>
              {data.images.map(img => (
                <Grid item xs={6} sm={4} md={3} key={img.src}>
                  <Box
                    sx={{
                      position: 'relative',
                      border: img.src === data.thumbnail ? '3px solid #ad9571' : '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={photoUrl(img.src)}
                      alt={img.alt}
                      style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
                    />
                    <Box
                      sx={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 0.5, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 1 }}
                    >
                      <Tooltip title={img.src === data.thumbnail ? 'Cover photo' : 'Use as cover'}>
                        <IconButton size="small" onClick={() => setData(d => ({ ...d, thumbnail: img.src }))}>
                          {img.src === data.thumbnail ? <StarIcon sx={{ color: '#ad9571' }} /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove from this project">
                        <IconButton size="small" color="error" onClick={() => removePhoto(img.src)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {tab === 'preview' && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              English
            </Typography>
            <ProjectPreview project={previewProject} lang="en" />
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Arabic
            </Typography>
            <ProjectPreview project={previewProject} lang="ar" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto', ml: 2 }}>
          Saving does not change the website yet. Use “Publish to website” when you are ready.
        </Typography>
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={busy}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>

      <CountryDialog
        country={countryDialog}
        onClose={() => setCountryDialog(null)}
        onSaved={c => {
          setCountryDialog(null);
          setData(d => ({ ...d, countryId: c.id }));
          onCountryAdded();
        }}
      />
    </Dialog>
  );
}
