import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PublicIcon from '@mui/icons-material/Public';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { canManageProjects, photoUrl, projectUrl } from '../../util/projects';
import PublishPanel from '../publish/PublishPanel';
import ProjectForm from './ProjectForm';
import CountryDialog from './CountryDialog';
import { colors } from '../../theme';

// Projects page of the admin panel: the projects grouped by country, in the same order as
// the website's Projects page. Arrows move a country group or a project inside its group.
export default function Projects() {
  const { globalState } = useGlobalState();
  const [data, setData] = useState({ countries: [], projects: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [countryDialog, setCountryDialog] = useState(null); // {} = new, country = rename
  const [toDelete, setToDelete] = useState(null);
  const [menu, setMenu] = useState(null); // {anchor, country, ci, count} or {anchor, p, pi, count}
  const allowed = canManageProjects(globalState.role);

  const load = useCallback(async () => {
    try {
      const { data: res } = await apiClient.get('/api/projects/admin/all');
      setData(res.data);
      setRefreshKey(k => k + 1);
    } catch {
      // error toast shown by apiClient
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  if (!allowed) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Projects can be managed by Admins and Super Admins only.</Alert>
      </Box>
    );
  }

  // One change at a time (avoids double clicks on the arrows), then reload the list.
  const act = async request => {
    if (busy) return;
    setBusy(true);
    try {
      await request();
    } catch {
      setBusy(false);
      return; // error toast shown by apiClient
    }
    await load();
    setBusy(false);
  };

  const run = request => {
    setMenu(null);
    return act(request);
  };

  if (loading) return <Box sx={{ p: 3 }}>Loading…</Box>;

  const { countries, projects } = data;
  const empty = countries.length === 0 && projects.length === 0;
  const openForm = project => {
    setEditing(project);
    setFormOpen(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4">Projects</Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<PublicIcon />} onClick={() => setCountryDialog({})} disabled={empty}>
            Add country
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm(null)} disabled={empty}>
            Add project
          </Button>
        </Box>
      </Box>

      <PublishPanel refreshKey={refreshKey} />

      {empty ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography sx={{ mb: 2 }}>
            There are no projects in the admin panel yet. The 16 projects currently on the website (with their countries, photos and materials) can be
            copied here once, then edited like any new project.
          </Typography>
          <Button variant="outlined" onClick={() => act(() => apiClient.post('/api/projects/admin/import'))} disabled={busy}>
            {busy ? 'Importing…' : 'Import the 16 existing projects'}
          </Button>
        </Paper>
      ) : (
        countries.map((country, ci) => {
          const list = projects.filter(p => p.countryId === country.id);
          return (
            <Paper key={country.id} variant="outlined" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#f7f5f1', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  {country.name.en}
                </Typography>
                <Typography color="text.secondary" dir="rtl">
                  {country.name.ar}
                </Typography>
                <Chip size="small" label={`${list.length} project${list.length === 1 ? '' : 's'}`} sx={{ ml: 1 }} />
                <IconButton
                  aria-label={`More actions for ${country.name.en}`}
                  sx={{ ml: 'auto' }}
                  onClick={e => setMenu({ anchor: e.currentTarget, country, ci, count: list.length })}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {list.length === 0 ? (
                <Typography color="text.secondary" sx={{ p: 2 }}>
                  No projects yet. This country is not shown on the website until it has one.
                </Typography>
              ) : (
                <Box>
                  {list.map((p, pi) => (
                    <Box
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openForm(p)}
                      onKeyDown={e => e.key === 'Enter' && openForm(p)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, sm: 2 },
                        px: { xs: 1.5, sm: 2 },
                        py: 1.25,
                        cursor: 'pointer',
                        borderTop: `1px solid ${colors.line}`,
                        '&:hover': { bgcolor: '#faf8f4' },
                      }}
                    >
                      <Box
                        component="img"
                        src={photoUrl(p.thumbnail)}
                        alt=""
                        sx={{ width: { xs: 64, sm: 88 }, height: { xs: 48, sm: 60 }, objectFit: 'cover', borderRadius: 1.5, flexShrink: 0, opacity: p.hidden ? 0.5 : 1, bgcolor: colors.lightGray }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, lineHeight: 1.35 }}>
                          {p.name.en}{' '}
                          <Typography component="span" variant="body2" color="text.secondary">
                            #{p.number}
                          </Typography>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 0.25 }}>
                          {p.city?.en && (
                            <Typography variant="body2" color="text.secondary">
                              {p.city.en}
                            </Typography>
                          )}
                          {p.hidden && <Chip size="small" icon={<VisibilityOffIcon />} label="Hidden" sx={{ height: 22 }} />}
                          {p.legacyMaterials?.length > 0 && (
                            <Tooltip title={`Not linked to a stone: ${p.legacyMaterials.join(', ')}. Open the project to choose the right stone.`}>
                              <Chip size="small" color="warning" label="Material to check" sx={{ height: 22 }} />
                            </Tooltip>
                          )}
                          {!(p.name.ar || p.description?.ar) && (
                            <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a5a00', bgcolor: '#fff4e0', borderRadius: 1, px: 0.75 }}>
                              No Arabic
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        aria-label={`More actions for ${p.name.en}`}
                        onClick={e => {
                          e.stopPropagation();
                          setMenu({ anchor: e.currentTarget, p, pi, count: list.length });
                        }}
                        onKeyDown={e => e.stopPropagation()}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          );
        })
      )}

      <Menu
        anchorEl={menu?.anchor}
        open={!!menu}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menu?.country && [
          <MenuItem key="up" disabled={busy || menu.ci === 0} onClick={() => run(() => apiClient.put(`/api/projects/admin/countries/${menu.country.id}/move`, { direction: 'up' }))}>
            <ListItemIcon>
              <ArrowUpwardIcon fontSize="small" />
            </ListItemIcon>
            Move country up
          </MenuItem>,
          <MenuItem
            key="down"
            disabled={busy || menu.ci === countries.length - 1}
            onClick={() => run(() => apiClient.put(`/api/projects/admin/countries/${menu.country.id}/move`, { direction: 'down' }))}
          >
            <ListItemIcon>
              <ArrowDownwardIcon fontSize="small" />
            </ListItemIcon>
            Move country down
          </MenuItem>,
          <MenuItem
            key="rename"
            onClick={() => {
              setCountryDialog(menu.country);
              setMenu(null);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Rename country
          </MenuItem>,
          menu.count === 0 ? (
            <MenuItem key="delete" sx={{ color: 'error.main' }} disabled={busy} onClick={() => run(() => apiClient.delete(`/api/projects/admin/countries/${menu.country.id}`))}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              Delete country
            </MenuItem>
          ) : (
            <MenuItem key="delete-info" disabled sx={{ whiteSpace: 'normal', maxWidth: 260, fontSize: '0.8rem' }}>
              A country with projects can't be deleted.
            </MenuItem>
          ),
        ]}
        {menu?.p && [
          <MenuItem
            key="edit"
            onClick={() => {
              openForm(menu.p);
              setMenu(null);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>,
          <MenuItem key="up" disabled={busy || menu.pi === 0} onClick={() => run(() => apiClient.put(`/api/projects/admin/${menu.p.id}/move`, { direction: 'up' }))}>
            <ListItemIcon>
              <ArrowUpwardIcon fontSize="small" />
            </ListItemIcon>
            Move up
          </MenuItem>,
          <MenuItem key="down" disabled={busy || menu.pi === menu.count - 1} onClick={() => run(() => apiClient.put(`/api/projects/admin/${menu.p.id}/move`, { direction: 'down' }))}>
            <ListItemIcon>
              <ArrowDownwardIcon fontSize="small" />
            </ListItemIcon>
            Move down
          </MenuItem>,
          <MenuItem key="hide" disabled={busy} onClick={() => run(() => apiClient.put(`/api/projects/admin/${menu.p.id}/visibility`, { hidden: !menu.p.hidden }))}>
            <ListItemIcon>{menu.p.hidden ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}</ListItemIcon>
            {menu.p.hidden ? 'Show on website' : 'Hide from website'}
          </MenuItem>,
          <MenuItem key="open" component="a" href={projectUrl(menu.p.id)} target="_blank" rel="noreferrer" onClick={() => setMenu(null)}>
            <ListItemIcon>
              <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            View on website
          </MenuItem>,
          menu.p.hidden ? (
            <MenuItem
              key="delete"
              sx={{ color: 'error.main' }}
              onClick={() => {
                setToDelete(menu.p);
                setMenu(null);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              Delete permanently
            </MenuItem>
          ) : (
            <MenuItem key="delete-info" disabled sx={{ whiteSpace: 'normal', maxWidth: 260, fontSize: '0.8rem' }}>
              To delete a project, hide it first.
            </MenuItem>
          ),
        ]}
      </Menu>

      <ProjectForm
        open={formOpen}
        project={editing}
        countries={countries}
        products={data.products}
        onCountryAdded={load}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          load();
        }}
      />

      <CountryDialog
        country={countryDialog}
        onClose={() => setCountryDialog(null)}
        onSaved={() => {
          setCountryDialog(null);
          load();
        }}
      />

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete permanently?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            “{toDelete?.name.en}” and the photos uploaded for it will be deleted for good. This cannot be undone. Its web address (number{' '}
            {toDelete?.number}) will not be reused. To just remove it from the website, hiding it is enough.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              const id = toDelete.id;
              setToDelete(null);
              await act(() => apiClient.delete(`/api/projects/admin/${id}`));
            }}
          >
            Delete permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
