import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import { MONTHS, photoUrl, uploadNewsPhotos } from '../../util/news';
import NewsPreview from './NewsPreview';

const now = new Date();
const EMPTY = {
  title: { en: '', ar: '' },
  content: { en: '', ar: '' },
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  thumbnail: '',
  images: [],
  pinned: false,
};

// Add or edit one article. Same fields as the website articles: title + text in English
// (required) and Arabic (optional), month/year, cover photo, gallery photos, pin.
export default function NewsForm({ open, article, onClose, onSaved }) {
  const [data, setData] = useState(EMPTY);
  const [tab, setTab] = useState('en');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef(null);
  const editing = !!article?.id;

  useEffect(() => {
    if (!open) return;
    setData(
      article
        ? {
            title: { en: article.title?.en || '', ar: article.title?.ar || '' },
            content: { en: article.content?.en || '', ar: article.content?.ar || '' },
            year: article.year,
            month: article.month,
            thumbnail: article.thumbnail || '',
            images: article.images || [],
            pinned: !!article.pinned,
          }
        : EMPTY,
    );
    setTab('en');
    setError('');
  }, [open, article]);

  const setText = (field, lang, value) => setData(d => ({ ...d, [field]: { ...d[field], [lang]: value } }));

  const altText = () => data.title.en.trim() || 'Wadi Degla news';

  const addPhotos = async files => {
    if (!files?.length) return;
    setError('');
    try {
      setUploading(`Uploading 0 / ${files.length}…`);
      const links = await uploadNewsPhotos(files, (done, total) => setUploading(`Uploading ${done} / ${total}…`));
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
    if (data.title.en.trim().length < 2) return 'Please write the English title.';
    if (data.content.en.trim().length < 2) return 'Please write the English text.';
    if (!data.thumbnail) return 'Please add at least one photo (the first one becomes the cover).';
    return '';
  };

  const save = async () => {
    const p = problems();
    if (p) return setError(p);
    setSaving(true);
    setError('');
    const body = { ...data, images: data.images.map((img, i) => ({ src: img.src, alt: img.alt || `${altText()} image ${i + 1}` })) };
    try {
      if (editing) await apiClient.put(`/api/news/admin/${article.id}`, body);
      else await apiClient.post('/api/news/admin', body);
      onSaved();
    } catch (e) {
      setError(e.response?.data?.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const busy = saving || !!uploading;

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="lg">
      <DialogTitle>{editing ? 'Edit article' : 'New article'}</DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="English" value="en" />
          <Tab label="العربية (Arabic)" value="ar" />
          <Tab label="Photos & date" value="photos" />
          <Tab label="Preview" value="preview" />
        </Tabs>

        {(tab === 'en' || tab === 'ar') && (
          <Box dir={tab === 'ar' ? 'rtl' : 'ltr'}>
            {tab === 'ar' && (
              <Alert severity="info" sx={{ mb: 2 }} dir="ltr">
                Optional. If left empty, the Arabic website shows the English text.
              </Alert>
            )}
            <TextField
              fullWidth
              label={tab === 'en' ? 'Title (required)' : 'العنوان'}
              value={data.title[tab]}
              onChange={e => setText('title', tab, e.target.value)}
              inputProps={{ maxLength: 200 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={12}
              label={tab === 'en' ? 'Text (required)' : 'النص'}
              helperText={tab === 'en' ? 'Leave an empty line between paragraphs.' : 'اترك سطراً فارغاً بين الفقرات.'}
              value={data.content[tab]}
              onChange={e => setText('content', tab, e.target.value)}
              inputProps={{ maxLength: 20000 }}
            />
          </Box>
        )}

        {tab === 'photos' && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} md={3}>
                <TextField select fullWidth label="Month" value={data.month} onChange={e => setData(d => ({ ...d, month: e.target.value }))}>
                  {MONTHS.map((m, i) => (
                    <MenuItem key={m} value={i + 1}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Year"
                  value={data.year}
                  onChange={e => setData(d => ({ ...d, year: Number(e.target.value) }))}
                  inputProps={{ min: 2000, max: 2100 }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox checked={data.pinned} onChange={e => setData(d => ({ ...d, pinned: e.target.checked }))} />}
                  label="Pin to the top of the news page (replaces the currently pinned article)"
                />
              </Grid>
            </Grid>

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
              The star marks the cover photo (shown on the news list and at the top of the article). All photos appear in the gallery at the bottom of
              the article.
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
                      <Tooltip title="Remove from this article">
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
            <NewsPreview article={{ ...data, author: article?.author || 'Wadi Degla Team' }} lang="en" />
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Arabic
            </Typography>
            <NewsPreview article={{ ...data, author: article?.author || 'Wadi Degla Team' }} lang="ar" />
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
    </Dialog>
  );
}
