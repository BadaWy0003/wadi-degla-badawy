import { useRef, useState } from 'react';
import { Alert, Box, Button, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import { AddPhotoAlternateOutlined, DeleteOutline, SwapHoriz, CloudUpload } from '@mui/icons-material';
import imageCompression from 'browser-image-compression';
import { colors } from '../../theme';
import { FINISHES, ROOMS, isRoom, finishLabel } from './stone-fields';

// The stone's photos: finish close-ups as cards, then the two room photos. Photos can be
// dropped on a card or chosen with a click; they are made smaller (WebP, 1920 px) in the
// browser before they are saved. Nothing is uploaded until the editor's Save.
const ACCEPT = 'image/jpeg,image/png,image/webp';

const compress = file => imageCompression(file, { maxWidthOrHeight: 1921, initialQuality: 0.82, useWebWorker: true, fileType: 'image/webp' });

const firstImage = list => Array.from(list || []).find(f => /^image\/(jpeg|png|webp)$/.test(f.type));

function DropArea({ onFile, children, sx, label }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => input.current?.click()}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
      onDragOver={e => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={e => {
        e.preventDefault();
        setOver(false);
        const f = firstImage(e.dataTransfer.files);
        if (f) onFile(f);
      }}
      sx={{
        border: `2px dashed ${over ? colors.gold : colors.line}`,
        bgcolor: over ? colors.goldSoft : colors.lightGray,
        borderRadius: 3,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'text.secondary',
        transition: 'all .15s',
        '&:hover, &:focus-visible': { borderColor: colors.gold, outline: 'none' },
        ...sx,
      }}
    >
      {children}
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={e => {
          const f = firstImage(e.target.files);
          e.target.value = '';
          if (f) onFile(f);
        }}
      />
    </Box>
  );
}

function PhotoCard({ item, title, onReplace, onRemove, wide }) {
  const replaceInput = useRef(null);
  const src = item.preview || item.thumb || item.link;
  return (
    <Box sx={{ border: `1px solid ${colors.line}`, borderRadius: 3, overflow: 'hidden', bgcolor: '#fff', alignSelf: 'start' }}>
      <Box
        component="img"
        src={src}
        alt=""
        sx={{ width: '100%', aspectRatio: wide ? '1920 / 810' : '4 / 3', objectFit: 'cover', display: 'block', bgcolor: colors.lightGray }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.75 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }} noWrap>
            {title}
          </Typography>
          {item.file && (
            <Typography variant="caption" sx={{ color: colors.goldDark }}>
              New – saved when you press Save
            </Typography>
          )}
        </Box>
        <Tooltip title="Replace photo">
          <IconButton size="small" aria-label={`Replace ${title}`} onClick={() => replaceInput.current?.click()}>
            <SwapHoriz fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove photo">
          <IconButton size="small" aria-label={`Remove ${title}`} onClick={onRemove} sx={{ '&:hover': { color: 'error.main' } }}>
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Tooltip>
        <input
          ref={replaceInput}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={e => {
            const f = firstImage(e.target.files);
            e.target.value = '';
            if (f) onReplace(f);
          }}
        />
      </Box>
    </Box>
  );
}

export default function StonePhotos({ finishes, onChange }) {
  const [pending, setPending] = useState(null); // {file, preview, name, custom}
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const used = finishes.map(f => f.finish);
  const finishPhotos = finishes.filter(f => !isRoom(f.finish));
  const free = FINISHES.filter(n => !used.includes(n));

  const prepare = async file => {
    setError('');
    setBusy(true);
    try {
      const small = await compress(file);
      return { file: small, preview: URL.createObjectURL(small) };
    } catch {
      setError('This photo could not be read. Please try another file (JPG, PNG or WebP).');
      return null;
    } finally {
      setBusy(false);
    }
  };

  // put a new photo in place of the finish's current one (or add the finish)
  const setPhoto = (name, photo) => {
    const i = finishes.findIndex(f => f.finish === name);
    const next = { finish: name, ...photo };
    onChange(i >= 0 ? finishes.map((f, j) => (j === i ? next : f)) : [...finishes, next]);
  };
  const remove = name => onChange(finishes.filter(f => f.finish !== name));

  const startAdd = async file => {
    const photo = await prepare(file);
    if (photo) setPending({ ...photo, name: free[0] || '__other', custom: '' });
  };
  const pendingName = pending ? (pending.name === '__other' ? pending.custom.trim() : pending.name) : '';
  const pendingTaken = pendingName && used.some(u => u.toLowerCase() === pendingName.toLowerCase());

  const legacyRoom = finishes.find(f => f.finish === 'mockup');

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 650 }}>
        Finish photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        A close-up of the stone in each finish. The Polished photo (else Honed) is the main photo on the website.
      </Typography>
      {!used.includes('Polished') && !used.includes('Honed') && (
        <Alert severity="warning" sx={{ mb: 1.5 }}>
          Add a Polished or Honed photo: the website uses it as this stone's main photo.
        </Alert>
      )}
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' } }}>
        {finishPhotos.map(f => (
          <PhotoCard
            key={f.finish}
            item={f}
            title={finishLabel(f.finish)}
            onRemove={() => remove(f.finish)}
            onReplace={async file => {
              const photo = await prepare(file);
              if (photo) setPhoto(f.finish, photo);
            }}
          />
        ))}
        {!pending && (
          <DropArea onFile={startAdd} label="Add a finish photo" sx={{ minHeight: 150, p: 2 }}>
            <AddPhotoAlternateOutlined sx={{ fontSize: 32, mb: 0.5, color: colors.gold }} />
            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>{busy ? 'Preparing…' : 'Add finish photo'}</Typography>
            <Typography variant="caption">Drop a photo here or click</Typography>
          </DropArea>
        )}
        {pending && (
          <Box sx={{ border: `2px solid ${colors.gold}`, borderRadius: 3, overflow: 'hidden', bgcolor: '#fff', alignSelf: 'start' }}>
            <Box component="img" src={pending.preview} alt="" sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
            <Box sx={{ p: 1.25, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                select
                size="small"
                label="Which finish?"
                value={pending.name}
                onChange={e => setPending(p => ({ ...p, name: e.target.value }))}
              >
                {free.map(n => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
                <MenuItem value="__other">
                  <em>Other finish…</em>
                </MenuItem>
              </TextField>
              {pending.name === '__other' && (
                <TextField
                  size="small"
                  label="Finish name (English)"
                  value={pending.custom}
                  onChange={e => setPending(p => ({ ...p, custom: e.target.value }))}
                  helperText="Shown in English until it is translated"
                  inputProps={{ maxLength: 40 }}
                  autoFocus
                />
              )}
              {pendingTaken && (
                <Typography variant="caption" color="error">
                  This stone already has that finish. Use “Replace photo” on it instead.
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={() => setPending(null)}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!pendingName || pendingTaken}
                  onClick={() => {
                    setPhoto(pendingName, { file: pending.file, preview: pending.preview });
                    setPending(null);
                  }}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 650, mt: 4 }}>
        Room photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Used by the website's Visualizer and the stone page's “See it in a space”. Keep the same layout as the other stones.
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {ROOMS.map(r => {
          const item = finishes.find(f => f.finish === r.value) || (r.value === 'indoorMockup' && legacyRoom);
          return item ? (
            <PhotoCard
              key={r.value}
              wide
              item={item}
              title={finishLabel(item.finish)}
              onRemove={() => remove(item.finish)}
              onReplace={async file => {
                const photo = await prepare(file);
                if (photo) setPhoto(item.finish, photo);
              }}
            />
          ) : (
            <DropArea
              key={r.value}
              label={`Add ${r.label}`}
              onFile={async file => {
                const photo = await prepare(file);
                if (photo) setPhoto(r.value, photo);
              }}
              sx={{ aspectRatio: '1920 / 810', p: 2 }}
            >
              <CloudUpload sx={{ fontSize: 30, mb: 0.5, color: colors.gold }} />
              <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>{r.label}</Typography>
              <Typography variant="caption">{r.hint}</Typography>
            </DropArea>
          );
        })}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
