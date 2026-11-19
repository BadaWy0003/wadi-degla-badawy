import { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UploadIcon from '@mui/icons-material/Upload';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';
import { photoUrl } from '../../util/news';
import { COUNTRY_CODES, checkAny, newItemId, uploadWebsitePhotos } from '../../util/website';

// Inputs for the field types used in lists and photos (Field.js handles the simple ones).

const countryName = (() => {
  let names = null;
  try {
    names = new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    names = null;
  }
  return code => names?.of(code) || code;
})();

// width/height of a photo once it has loaded
const photoSize = src =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = photoUrl(src);
  });

// Upload 1+ photos (compressed to WebP in the browser), returning [{ src, width, height }].
const uploadPhotos = async files => {
  const links = await uploadWebsitePhotos(files);
  const out = [];
  for (const src of links) {
    const size = await photoSize(src);
    if (size) out.push({ src, ...size });
  }
  return out;
};

function UploadButton({ multiple, label, onUploaded }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async e => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    try {
      const photos = await uploadPhotos(files);
      if (photos.length) onUploaded(photos);
      else toast.error('The photo could not be read. Please try another file.');
    } catch {
      // error toast shown by apiClient
    }
    setBusy(false);
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} hidden onChange={pick} />
      <Button
        variant="outlined"
        size="small"
        startIcon={busy ? <CircularProgress size={16} /> : <UploadIcon />}
        disabled={busy}
        onClick={() => ref.current?.click()}
      >
        {busy ? 'Uploading…' : label}
      </Button>
    </>
  );
}

const Thumb = ({ photo, size = 120, children }) => (
  <Box sx={{ position: 'relative', width: size, flexShrink: 0 }}>
    <Box
      component="img"
      src={photoUrl(photo.src)}
      alt=""
      sx={{ width: size, height: size, objectFit: 'contain', bgcolor: '#2b2824', borderRadius: 1, display: 'block' }}
    />
    {children}
  </Box>
);

export function ImageInput({ value, onChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {value?.src ? <Thumb photo={value} size={140} /> : <Typography color="text.secondary">No photo yet</Typography>}
      <Box>
        <UploadButton label={value?.src ? 'Replace photo' : 'Upload photo'} onUploaded={photos => onChange(photos[0])} />
        {value?.src && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {value.width} × {value.height} px
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function ImagesInput({ value, onChange, field }) {
  const list = value || [];
  const move = (i, d) => {
    const next = [...list];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
        {list.map((p, i) => (
          <Thumb key={`${p.src}-${i}`} photo={p} size={110}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <IconButton size="small" aria-label="Move left" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Remove photo" onClick={() => onChange(list.filter((_, k) => k !== i))}>
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Move right" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </Box>
            {i === 0 && (
              <Typography
                variant="caption"
                color="primary"
                sx={{ position: 'absolute', top: 4, left: 6, bgcolor: '#fff', px: 0.5, borderRadius: 0.5 }}
              >
                Main
              </Typography>
            )}
          </Thumb>
        ))}
      </Box>
      {list.length < (field.max || 30) && (
        <UploadButton multiple label="Add photos" onUploaded={photos => onChange([...list, ...photos].slice(0, field.max || 30))} />
      )}
    </Box>
  );
}

export function I18nInput({ value, onChange, field }) {
  const max = field.max || (field.multiline ? 5000 : 500);
  const common = { fullWidth: true, multiline: !!field.multiline, minRows: field.multiline ? 2 : undefined, size: 'small' };
  const v = value || { en: '', ar: '' };
  return (
    <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <TextField
        {...common}
        label="English"
        value={v.en || ''}
        onChange={e => onChange({ ...v, en: e.target.value })}
        helperText={`${(v.en || '').length} / ${max}`}
        inputProps={{ maxLength: max }}
      />
      <TextField
        {...common}
        label="العربية (Arabic)"
        value={v.ar || ''}
        onChange={e => onChange({ ...v, ar: e.target.value })}
        helperText={!v.ar?.trim() ? 'Empty: the Arabic page shows the English text' : `${(v.ar || '').length} / ${max}`}
        inputProps={{ maxLength: max, dir: 'rtl', lang: 'ar' }}
      />
    </Box>
  );
}

export function SelectInput({ value, onChange, field }) {
  return (
    <TextField select size="small" value={value ?? ''} onChange={e => onChange(e.target.value)} sx={{ minWidth: 220 }}>
      {field.options.map(o => (
        <MenuItem key={String(o.value)} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export function CountryInput({ value, onChange }) {
  const options = COUNTRY_CODES.map(code => ({ code, name: countryName(code) })).sort((a, b) => a.name.localeCompare(b.name));
  const selected = options.find(o => o.code === value) || null;
  return (
    <Autocomplete
      size="small"
      options={options}
      value={selected}
      onChange={(e, o) => onChange(o?.code || '')}
      getOptionLabel={o => o.name}
      isOptionEqualToValue={(a, b) => a.code === b.code}
      renderInput={params => <TextField {...params} placeholder="Type a country" />}
      sx={{ maxWidth: 360 }}
    />
  );
}

// Projects from the admin panel's Projects page, picked by name (saved as their numbers).
let projectsCache = null;
export function ProjectsInput({ value, onChange }) {
  const [projects, setProjects] = useState(projectsCache || []);
  useEffect(() => {
    if (projectsCache) return;
    apiClient
      .get('/api/projects/admin/all')
      .then(({ data }) => {
        projectsCache = (data.data.projects || []).map(p => ({ id: String(p.id), name: `${p.name?.en || 'Project'} (no. ${p.id})` }));
        setProjects(projectsCache);
      })
      .catch(() => {});
  }, []);
  const selected = (value || []).map(id => projects.find(p => p.id === String(id)) || { id: String(id), name: `Project no. ${id}` });
  return (
    <Autocomplete
      multiple
      size="small"
      options={projects}
      value={selected}
      onChange={(e, list) => onChange(list.map(p => p.id))}
      getOptionLabel={p => p.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={params => <TextField {...params} placeholder={selected.length ? '' : 'None'} />}
    />
  );
}

// Stones (products) in a chosen order: a list with arrows to move them, and a search box to add one.
let productsCache = null;
export function ProductsInput({ value, onChange, field }) {
  const [products, setProducts] = useState(productsCache || []);
  useEffect(() => {
    if (productsCache) return;
    apiClient
      .get('/api/storage/admin/all')
      .then(({ data }) => {
        // stones only: this list also holds the gallery photos
        productsCache = (data.data || [])
          .filter(p => p.type && String(p.type).trim() !== 'Gallery')
          .map(p => ({ id: String(p.id), name: String(p.name || '').trim(), type: String(p.type || '').trim(), hidden: !!p.hidden }))
          .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
        setProducts(productsCache);
      })
      .catch(() => {});
  }, []);
  const list = value || [];
  const info = id => products.find(p => p.id === id);
  const move = (i, d) => {
    const next = [...list];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const full = list.length >= (field.max || 50);
  return (
    <Box>
      <Box component="ol" sx={{ m: 0, mb: 1.5, pl: 3 }}>
        {list.map((id, i) => {
          const p = info(id);
          return (
            <Box component="li" key={id} sx={{ py: 0.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ flexGrow: 1, minWidth: 140 }}>
                  {p ? p.name : products.length ? 'Deleted stone (not shown)' : '…'}
                  {p && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}
                      · {p.type}
                      {p.hidden ? ' · hidden, not shown' : ''}
                    </Typography>
                  )}
                </Typography>
                <IconButton size="small" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Remove" onClick={() => onChange(list.filter(x => x !== id))}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Autocomplete
        size="small"
        disabled={full}
        options={products.filter(p => !list.includes(p.id) && !p.hidden)}
        groupBy={p => p.type}
        getOptionLabel={p => p.name}
        value={null}
        blurOnSelect
        onChange={(e, p) => p && onChange([...list, p.id])}
        renderInput={params => <TextField {...params} placeholder={full ? `At most ${field.max} stones` : 'Add a stone…'} sx={{ maxWidth: 420 }} />}
      />
    </Box>
  );
}

// Gallery photos picked into a group (a "products" field with kind: 'gallery'): the chosen
// photos in order (arrows to move, bin to remove), then every gallery photo not chosen yet
// to click and add, except those already in another group of the page (`taken`).
let galleryCache = null;
export function GalleryPhotosInput({ value, onChange, field, taken }) {
  const [photos, setPhotos] = useState(galleryCache || []);
  useEffect(() => {
    if (galleryCache) return;
    apiClient
      .get('/api/storage/admin/all')
      .then(({ data }) => {
        galleryCache = (data.data || [])
          .filter(p => String(p.type || '').trim() === 'Gallery' && p.finishes?.[0]?.link)
          .map(p => ({ id: String(p.id), name: String(p.name || '').trim(), src: p.finishes[0].thumb || p.finishes[0].link }))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        setPhotos(galleryCache);
      })
      .catch(() => {});
  }, []);
  const list = value || [];
  const info = id => photos.find(p => p.id === id);
  const move = (i, d) => {
    const next = [...list];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const full = list.length >= (field.max || 60);
  // photos in no group yet (a photo is in one group only: remove it from the other first)
  const rest = photos.filter(p => !list.includes(p.id) && !(taken || []).includes(p.id));
  const img = (p, size) => (
    <Box
      component="img"
      src={p ? photoUrl(p.src) : ''}
      alt={p ? `Photo ${p.name}` : 'Deleted photo'}
      sx={{ width: size, height: size, objectFit: 'cover', bgcolor: '#2b2824', borderRadius: 1, display: 'block' }}
    />
  );
  return (
    <Box>
      {list.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          No photos in this group.
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        {list.map((id, i) => {
          const p = info(id);
          return (
            <Box key={id} sx={{ width: 110 }}>
              {img(p, 110)}
              <Typography variant="caption" color="text.secondary" component="div" sx={{ textAlign: 'center' }}>
                {p ? `${i === 0 ? 'Big · ' : ''}no. ${p.name}` : photos.length ? 'deleted (not shown)' : '…'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton size="small" aria-label="Move left" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Remove photo" onClick={() => onChange(list.filter(x => x !== id))}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Move right" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
      {rest.length > 0 && !full && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Click a photo to add it to this group (photos already in another group are not listed):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {rest.map(p => (
              <Box
                key={p.id}
                component="button"
                type="button"
                onClick={() => onChange([...list, p.id])}
                title={`No. ${p.name}`}
                sx={{ p: 0, border: 0, background: 'none', cursor: 'pointer' }}
              >
                {img(p, 72)}
                <Typography variant="caption" component="div">
                  {p.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

// A repeatable list (fairs, partners...): each item is a card with its own fields, which can
// be moved up/down, removed, and opened/closed. New items get an id from their name.
export function ListInput({ value, onChange, field, renderInput, showErrors }) {
  const items = value || [];
  const [open, setOpen] = useState(() => new Set());
  const set = (i, item) => onChange(items.map((it, k) => (k === i ? item : it)));
  const move = (i, d) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const add = () => {
    const blank = {
      id: newItemId(
        `new-${field.itemLabel || 'item'}`,
        items.map(it => it.id),
      ),
    };
    for (const sub of field.fields) {
      blank[sub.name] =
        sub.type === 'i18n'
          ? { en: '', ar: '' }
          : sub.type === 'images' || sub.type === 'projects'
            ? []
            : sub.type === 'select'
              ? sub.options[0].value
              : sub.type === 'image'
                ? null
                : '';
    }
    onChange([blank, ...items]);
    setOpen(new Set([...open, blank.id]));
  };
  const remove = i => {
    const name = items[i][field.titleField] || `this ${field.itemLabel || 'item'}`;
    if (window.confirm(`Remove "${name}" from the list? (You can undo it with "Discard" before saving, or from History later.)`)) {
      onChange(items.filter((_, k) => k !== i));
    }
  };
  const toggle = id => {
    const next = new Set(open);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpen(next);
  };

  return (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      <Box>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={add}>
          Add a {field.itemLabel || 'item'}
        </Button>
      </Box>
      {items.map((item, i) => {
        const isOpen = open.has(item.id);
        const problem = field.fields.map(sub => checkAny(sub, item[sub.name])).find(Boolean);
        const cover = field.fields.find(sub => sub.type === 'image' || sub.type === 'images');
        const coverPhoto = cover && (cover.type === 'image' ? item[cover.name] : item[cover.name]?.[0]);
        return (
          <Card key={item.id} variant="outlined" sx={{ borderColor: showErrors && problem ? 'error.main' : 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, pl: 1.5, cursor: 'pointer' }} onClick={() => toggle(item.id)}>
              {coverPhoto?.src ? (
                <Box
                  component="img"
                  src={photoUrl(coverPhoto.src)}
                  alt=""
                  sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1, bgcolor: '#2b2824' }}
                />
              ) : (
                <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: 'action.hover' }} />
              )}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap>
                  {i + 1}. {item[field.titleField] || `New ${field.itemLabel || 'item'}`}
                </Typography>
                {showErrors && problem && (
                  <Typography variant="body2" color="error" noWrap>
                    {problem}
                  </Typography>
                )}
              </Box>
              <Tooltip title="Move up">
                <span>
                  <IconButton
                    size="small"
                    disabled={i === 0}
                    onClick={e => {
                      e.stopPropagation();
                      move(i, -1);
                    }}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down">
                <span>
                  <IconButton
                    size="small"
                    disabled={i === items.length - 1}
                    onClick={e => {
                      e.stopPropagation();
                      move(i, 1);
                    }}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Remove">
                <span>
                  <IconButton
                    size="small"
                    disabled={items.length <= (field.min || 0)}
                    onClick={e => {
                      e.stopPropagation();
                      remove(i);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Collapse in={isOpen} unmountOnExit>
              <CardContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
                {field.fields.map(sub => {
                  const err = checkAny(sub, item[sub.name]);
                  return (
                    <Box key={sub.name}>
                      <Typography component="label" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                        {sub.label}
                        {sub.optional ? (
                          <Typography component="span" color="text.secondary">
                            {' '}
                            (optional)
                          </Typography>
                        ) : null}
                      </Typography>
                      {sub.help && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {sub.help}
                        </Typography>
                      )}
                      {renderInput(sub, item[sub.name], v => set(i, { ...item, [sub.name]: v }))}
                      {showErrors && err && (
                        <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                          {err}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </Box>
  );
}
