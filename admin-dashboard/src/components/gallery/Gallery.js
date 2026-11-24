import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import {
  AddPhotoAlternateOutlined,
  MoreVert,
  StarOutline,
  ArrowBack,
  ArrowForward,
  DriveFileMoveOutlined,
  OpenInNew,
  DeleteOutline,
  DragIndicator,
} from '@mui/icons-material';
import imageCompression from 'browser-image-compression';
import apiClient from '../../util/client';
import { canManageNews } from '../../util/news';
import { initialValues, buildSaveBody, loadBlock, saveBlock } from '../../util/website';
import { useGlobalState } from '../GlobalStateContext';
import { usePublish } from '../publish/PublishStatus';
import { colors } from '../../theme';

// Gallery (redesign step 3, 2026-11-24): every Gallery photo in one place. Photos are added by
// dropping them on the page (or "Add photos"); admins also arrange the website's groups here
// (drag a photo, or use its ⋯ menu), saved in the "gallery" website block
// (groupFactory / groupYard / groupPacking, same as Website → Gallery → Photo groups).
// Photos in no group show under "More photos" at the end of the website's Gallery page.

const GROUPS = [
  { field: 'groupFactory', title: 'Factory & machinery' },
  { field: 'groupYard', title: 'Stockyard' },
  { field: 'groupPacking', title: 'Packing & loading' },
];
const NONE = 'none';
const ACCEPT = /^image\/(jpeg|png|webp)$/;

const photoOf = item => item.finishes?.[0] || {};
const nextNumber = items => Math.max(0, ...items.map(i => Number(i.name)).filter(Number.isFinite)) + 1;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function Tile({ item, big, onMenu, draggable, onDragStart, onDropBefore }) {
  const [over, setOver] = useState(false);
  const p = photoOf(item);
  return (
    <Box
      draggable={draggable}
      onDragStart={e => {
        e.dataTransfer.setData('text/wd-photo', item.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.();
      }}
      onDragOver={e => {
        if (!draggable || !e.dataTransfer.types.includes('text/wd-photo')) return;
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={e => {
        const id = e.dataTransfer.getData('text/wd-photo');
        setOver(false);
        if (!id) return;
        e.preventDefault();
        e.stopPropagation();
        onDropBefore(id);
      }}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: colors.lightGray,
        aspectRatio: '1',
        gridColumn: big ? 'span 2' : undefined,
        gridRow: big ? 'span 2' : undefined,
        cursor: draggable ? 'grab' : 'default',
        boxShadow: over ? `-4px 0 0 ${colors.gold}` : 'none',
        '&:hover .wd-tile-tools, &:focus-within .wd-tile-tools': { opacity: 1 },
      }}
    >
      <Box
        component="img"
        src={p.thumb || p.link}
        alt=""
        loading="lazy"
        draggable={false}
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {big && (
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            bottom: 8,
            bgcolor: 'rgba(31,27,22,0.75)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 600,
            px: 1,
            py: 0.25,
            borderRadius: 1,
          }}
        >
          Big photo
        </Box>
      )}
      <Box
        className="wd-tile-tools"
        sx={{
          position: 'absolute',
          inset: '6px 6px auto auto',
          display: 'flex',
          gap: 0.5,
          opacity: { xs: 1, md: 0 },
          transition: 'opacity .15s',
        }}
      >
        {draggable && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1.5, px: 0.25 }}>
            <DragIndicator fontSize="small" sx={{ color: 'text.secondary' }} />
          </Box>
        )}
        <IconButton
          size="small"
          aria-label={`Photo ${item.name}: options`}
          onClick={e => onMenu(e.currentTarget)}
          sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' }, p: { xs: 0.9, md: 0.5 } }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function Gallery() {
  const { globalState } = useGlobalState();
  const isAdmin = canManageNews(globalState.role);
  const { refresh } = usePublish();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [block, setBlock] = useState(null); // the "gallery" website block {block, saved, defaults}
  const [groups, setGroups] = useState(null); // {groupFactory: [ids], ...}
  const [savedGroups, setSavedGroups] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // {severity, text}
  const [upload, setUpload] = useState(null); // {done, total}
  const [dropping, setDropping] = useState(false);
  const [menu, setMenu] = useState(null); // {anchor, item, group}
  const [toDelete, setToDelete] = useState(null);
  const fileInput = useRef(null);

  const loadPhotos = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/api/storage/type/Gallery');
      setItems(Array.isArray(data.data) ? data.data : []);
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGroups = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await loadBlock('gallery');
      const g = Object.fromEntries(GROUPS.map(({ field }) => [field, (data.saved.data[field] ?? data.defaults.data[field] ?? []).map(String)]));
      setBlock(data);
      setGroups(g);
      setSavedGroups(g);
    } catch {
      setMessage({ severity: 'error', text: 'The photo groups could not be loaded. Refresh the page to try again.' });
    }
  }, [isAdmin]);

  useEffect(() => {
    loadPhotos();
    loadGroups();
  }, [loadPhotos, loadGroups]);

  const byId = useMemo(() => new Map(items.map(i => [String(i.id), i])), [items]);
  // newest first in "More photos" (higher numbers were uploaded later)
  const sortedItems = useMemo(() => [...items].sort((a, b) => (Number(b.name) || 0) - (Number(a.name) || 0)), [items]);

  const dirty = !!groups && !same(groups, savedGroups);
  useEffect(() => {
    window.wdUnsavedChanges = dirty;
    const warn = e => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      window.removeEventListener('beforeunload', warn);
      window.wdUnsavedChanges = false;
    };
  }, [dirty]);

  const sections = useMemo(() => {
    if (!groups) return [{ field: NONE, title: 'All photos', ids: sortedItems.map(i => String(i.id)) }];
    const used = new Set(GROUPS.flatMap(g => groups[g.field]));
    return [
      ...GROUPS.map(g => ({ ...g, ids: groups[g.field].filter(id => byId.has(id)) })),
      { field: NONE, title: 'Not in a group', ids: sortedItems.map(i => String(i.id)).filter(id => !used.has(id)) },
    ];
  }, [groups, byId, sortedItems]);

  // move a photo to a group (before another photo, or at the end); NONE = out of every group
  const move = (id, target, beforeId) => {
    setGroups(g => {
      const next = Object.fromEntries(GROUPS.map(({ field }) => [field, g[field].filter(x => x !== id)]));
      if (target !== NONE) {
        const list = next[target];
        const at = beforeId ? list.indexOf(beforeId) : -1;
        if (at >= 0) list.splice(at, 0, id);
        else list.push(id);
      }
      return next;
    });
  };
  const shift = (id, field, by) =>
    setGroups(g => {
      const list = [...g[field]];
      const i = list.indexOf(id);
      const j = i + by;
      if (i < 0 || j < 0 || j >= list.length) return g;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...g, [field]: list };
    });

  const saveGroups = async (toSave = groups) => {
    const empty = GROUPS.filter(g => !toSave[g.field].some(id => byId.has(id)));
    if (empty.length) {
      setMessage({ severity: 'error', text: `Every group needs at least one photo: ${empty.map(g => g.title).join(', ')}.` });
      return false;
    }
    setSaving(true);
    setMessage(null);
    try {
      const fields = block.block.sections.flatMap(s => s.fields);
      const values = initialValues(fields, block.saved, block.defaults);
      // only existing photos are saved
      GROUPS.forEach(({ field }) => {
        values[`d:${field}`] = toSave[field].filter(id => byId.has(id));
      });
      await saveBlock('gallery', buildSaveBody(fields, values, block.defaults));
      await loadGroups();
      refresh();
      setMessage({ severity: 'success', text: 'Groups saved. Press Publish (top right) to show them on the website.' });
      return true;
    } catch (e) {
      setMessage({ severity: 'error', text: e.response?.data?.message || 'Saving failed. Please try again.' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addFiles = async fileList => {
    const files = Array.from(fileList || []).filter(f => ACCEPT.test(f.type));
    if (!files.length) {
      setMessage({ severity: 'warning', text: 'Only JPG, PNG and WebP photos can be added.' });
      return;
    }
    setMessage(null);
    let n = nextNumber(items);
    let done = 0;
    let failedCount = 0;
    setUpload({ done, total: files.length });
    for (const file of files) {
      try {
        const small = await imageCompression(file, { maxWidthOrHeight: 1600, initialQuality: 0.82, useWebWorker: true, fileType: 'image/webp' });
        const name = String(n);
        const form = new FormData();
        form.append('type', 'Gallery');
        form.append('name', name);
        form.append('finishes', JSON.stringify([{ finishName: name }]));
        form.append('files', small, `gallery-${name}.webp`);
        await apiClient.post('/api/storage/upload', form);
        n += 1;
      } catch {
        failedCount += 1;
      }
      done += 1;
      setUpload({ done, total: files.length });
    }
    setUpload(null);
    await loadPhotos();
    refresh();
    const added = files.length - failedCount;
    setMessage(
      failedCount
        ? { severity: 'warning', text: `${added} added, ${failedCount} could not be added. Please try those again.` }
        : {
            severity: 'success',
            text: `${added} photo${added === 1 ? '' : 's'} added${isAdmin ? ' under “Not in a group”: drag them into a group and save' : ''}. Press Publish (top right) to show them on the website.`,
          },
    );
  };

  const confirmDelete = async () => {
    const id = String(toDelete.id);
    setToDelete(null);
    try {
      await apiClient.delete(`/api/storage/product/${id}`);
    } catch {
      return; // error toast shown by apiClient
    }
    const inGroups = groups && GROUPS.some(g => savedGroups[g.field].includes(id));
    await loadPhotos();
    refresh();
    if (inGroups) {
      // take it out of the saved groups too (unless other changes wait to be saved)
      const next = Object.fromEntries(GROUPS.map(({ field }) => [field, groups[field].filter(x => x !== id)]));
      setGroups(next);
      if (!dirty) await saveGroups(next);
    }
  };

  const groupTitle = field => (GROUPS.find(g => g.field === field) || { title: 'Not in a group' }).title;

  return (
    <Box
      onDragOver={e => {
        if (e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          setDropping(true);
        }
      }}
      onDragLeave={e => {
        if (e.currentTarget === e.target) setDropping(false);
      }}
      onDrop={e => {
        if (!e.dataTransfer.files?.length) return;
        e.preventDefault();
        setDropping(false);
        addFiles(e.dataTransfer.files);
      }}
      sx={{ pb: dirty ? 10 : 0 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Gallery</Typography>
        <Button
          variant="contained"
          startIcon={<AddPhotoAlternateOutlined />}
          onClick={() => fileInput.current?.click()}
          disabled={!!upload}
          sx={{ ml: 'auto' }}
        >
          Add photos
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={e => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2.5 }}>
        {loading
          ? ' '
          : `${items.length} photos on the website's Gallery page.${isAdmin ? ' Drag a photo to move it to another group or place; the first photo of a group is the big one.' : ''}`}
      </Typography>

      {failed && (
        <Alert severity="error" sx={{ mb: 2 }}>
          The photos couldn’t be loaded. Please refresh the page.
        </Alert>
      )}
      {message && (
        <Alert severity={message.severity} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box
        role="button"
        tabIndex={0}
        onClick={() => !upload && fileInput.current?.click()}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && !upload && fileInput.current?.click()}
        sx={{
          border: `2px dashed ${dropping ? colors.gold : colors.line}`,
          bgcolor: dropping ? colors.goldSoft : '#fff',
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          mb: 3,
          textAlign: 'center',
          cursor: upload ? 'default' : 'pointer',
          transition: 'all .15s',
          '&:hover': { borderColor: colors.gold },
        }}
      >
        {upload ? (
          <Box sx={{ maxWidth: 360, mx: 'auto' }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Adding photo {Math.min(upload.done + 1, upload.total)} of {upload.total}…
            </Typography>
            <LinearProgress variant="determinate" value={(upload.done / upload.total) * 100} />
          </Box>
        ) : (
          <>
            <AddPhotoAlternateOutlined sx={{ fontSize: 32, color: colors.gold }} />
            <Typography sx={{ fontWeight: 600 }}>Drop photos here, or click to choose</Typography>
            <Typography variant="body2" color="text.secondary">
              Several at once is fine. JPG, PNG or WebP; they are made smaller before uploading.
            </Typography>
          </>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        sections.map(sec => (
          <Paper
            key={sec.field}
            sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5 }}
            onDragOver={e => {
              if (isAdmin && groups && e.dataTransfer.types.includes('text/wd-photo')) e.preventDefault();
            }}
            onDrop={e => {
              const id = e.dataTransfer.getData('text/wd-photo');
              if (!id || !groups) return;
              e.preventDefault();
              e.stopPropagation();
              move(id, sec.field);
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 650, fontSize: '1.05rem' }}>{sec.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {sec.ids.length} photo{sec.ids.length === 1 ? '' : 's'}
                {sec.field === NONE && groups ? ' · shown under “More photos” at the end of the page' : ''}
              </Typography>
            </Box>
            {sec.ids.length === 0 ? (
              <Box sx={{ border: `1px dashed ${colors.line}`, borderRadius: 2, p: 3, textAlign: 'center', color: 'text.secondary' }}>
                {groups ? 'Drag photos here' : 'No photos yet'}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(auto-fill, minmax(140px, 1fr))' },
                  gridAutoFlow: 'dense',
                }}
              >
                {sec.ids.map((id, i) => (
                  <Tile
                    key={id}
                    item={byId.get(id)}
                    big={sec.field !== NONE && i === 0}
                    draggable={!!groups}
                    onMenu={anchor => setMenu({ anchor, item: byId.get(id), group: sec.field, index: i, count: sec.ids.length })}
                    onDropBefore={dragged =>
                      dragged !== id && move(dragged, sec.field === NONE ? NONE : sec.field, sec.field === NONE ? undefined : id)
                    }
                  />
                ))}
              </Box>
            )}
          </Paper>
        ))
      )}

      <Menu anchorEl={menu?.anchor} open={!!menu} onClose={() => setMenu(null)}>
        {menu && [
          groups && menu.group !== NONE && menu.index > 0 && (
            <MenuItem
              key="big"
              onClick={() => {
                move(String(menu.item.id), menu.group, sections.find(s => s.field === menu.group).ids[0]);
                setMenu(null);
              }}
            >
              <ListItemIcon>
                <StarOutline fontSize="small" />
              </ListItemIcon>
              Make it the big photo
            </MenuItem>
          ),
          groups && menu.group !== NONE && menu.index > 0 && (
            <MenuItem
              key="left"
              onClick={() => {
                shift(String(menu.item.id), menu.group, -1);
                setMenu(null);
              }}
            >
              <ListItemIcon>
                <ArrowBack fontSize="small" />
              </ListItemIcon>
              Move earlier
            </MenuItem>
          ),
          groups && menu.group !== NONE && menu.index < menu.count - 1 && (
            <MenuItem
              key="right"
              onClick={() => {
                shift(String(menu.item.id), menu.group, 1);
                setMenu(null);
              }}
            >
              <ListItemIcon>
                <ArrowForward fontSize="small" />
              </ListItemIcon>
              Move later
            </MenuItem>
          ),
          groups &&
            [...GROUPS.map(g => g.field), NONE]
              .filter(f => f !== menu.group)
              .map(f => (
                <MenuItem
                  key={`to-${f}`}
                  onClick={() => {
                    move(String(menu.item.id), f);
                    setMenu(null);
                  }}
                >
                  <ListItemIcon>
                    <DriveFileMoveOutlined fontSize="small" />
                  </ListItemIcon>
                  {f === NONE ? 'Take out of the group' : `Move to ${groupTitle(f)}`}
                </MenuItem>
              )),
          groups && <Divider key="d" />,
          <MenuItem key="open" component="a" href={photoOf(menu.item).link} target="_blank" rel="noopener noreferrer" onClick={() => setMenu(null)}>
            <ListItemIcon>
              <OpenInNew fontSize="small" />
            </ListItemIcon>
            View full size
          </MenuItem>,
          <MenuItem
            key="delete"
            sx={{ color: 'error.main' }}
            onClick={() => {
              setToDelete(menu.item);
              setMenu(null);
            }}
          >
            <ListItemIcon>
              <DeleteOutline fontSize="small" color="error" />
            </ListItemIcon>
            Delete photo
          </MenuItem>,
        ]}
      </Menu>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete this photo?</DialogTitle>
        <DialogContent>
          {toDelete && (
            <Box
              component="img"
              src={photoOf(toDelete).thumb || photoOf(toDelete).link}
              alt=""
              sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 2, mb: 2 }}
            />
          )}
          <DialogContentText>It is removed from the Gallery for good. This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete photo
          </Button>
        </DialogActions>
      </Dialog>

      {dirty && (
        <Paper
          sx={{
            position: 'fixed',
            left: { xs: 8, md: 248 + 32 },
            right: { xs: 8, md: 32 },
            bottom: 16,
            zIndex: 10,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            boxShadow: '0 8px 24px rgba(31,27,22,0.15)',
            border: `1px solid ${colors.gold}`,
          }}
        >
          <Typography sx={{ fontWeight: 600, mr: 'auto', px: 1 }}>You changed the groups</Typography>
          <Button onClick={() => setGroups(savedGroups)} disabled={saving}>
            Undo
          </Button>
          <Button variant="contained" onClick={() => saveGroups()} disabled={saving}>
            {saving ? 'Saving…' : 'Save groups'}
          </Button>
        </Paper>
      )}
    </Box>
  );
}
