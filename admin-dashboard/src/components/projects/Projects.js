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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import apiClient from '../../util/client';
import { useGlobalState } from '../GlobalStateContext';
import { canManageProjects, photoUrl, projectUrl } from '../../util/projects';
import PublishPanel from '../publish/PublishPanel';
import ProjectForm from './ProjectForm';
import CountryDialog from './CountryDialog';

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
                <Box sx={{ ml: 'auto', whiteSpace: 'nowrap' }}>
                  <Tooltip title="Move this country up on the Projects page">
                    <span>
                      <IconButton
                        disabled={busy || ci === 0}
                        onClick={() => act(() => apiClient.put(`/api/projects/admin/countries/${country.id}/move`, { direction: 'up' }))}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move this country down">
                    <span>
                      <IconButton
                        disabled={busy || ci === countries.length - 1}
                        onClick={() => act(() => apiClient.put(`/api/projects/admin/countries/${country.id}/move`, { direction: 'down' }))}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Rename country">
                    <IconButton color="primary" onClick={() => setCountryDialog(country)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {list.length === 0 && (
                    <Tooltip title="Delete country (it has no projects)">
                      <IconButton
                        color="error"
                        disabled={busy}
                        onClick={() => act(() => apiClient.delete(`/api/projects/admin/countries/${country.id}`))}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              {list.length === 0 ? (
                <Typography color="text.secondary" sx={{ p: 2 }}>
                  No projects yet. This country is not shown on the website until it has one.
                </Typography>
              ) : (
                // Phones: cover, city and Arabic columns hidden (city shown under the name); the table
                // scrolls inside its box if it is still too wide
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ '& td, & th': { px: { xs: 1, sm: 2 } } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Cover</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>City</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Arabic</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((p, pi) => (
                        <TableRow key={p.id} sx={p.hidden ? { opacity: 0.6 } : undefined}>
                          <TableCell sx={{ width: 96, display: { xs: 'none', sm: 'table-cell' } }}>
                            <img src={photoUrl(p.thumbnail)} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 4 }} />
                          </TableCell>
                          <TableCell>
                            {p.name.en}
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              #{p.number}
                            </Typography>
                            {p.hidden && <Chip size="small" label="Hidden from website" sx={{ ml: 1 }} />}
                            {p.legacyMaterials?.length > 0 && (
                              <Tooltip
                                title={`Not linked to a product: ${p.legacyMaterials.join(', ')}. Open the project to choose the right product.`}
                              >
                                <Chip size="small" color="warning" label="Material to check" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                            {p.city?.en && (
                              <Box component="span" sx={{ display: { xs: 'block', sm: 'none' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                                {p.city.en}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{p.city?.en}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {p.name.ar || p.description?.ar ? (
                              'Yes'
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                English shown
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ whiteSpace: { xs: 'normal', sm: 'nowrap' } }}>
                            <Tooltip title="Move up">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={busy || pi === 0}
                                  onClick={() => act(() => apiClient.put(`/api/projects/admin/${p.id}/move`, { direction: 'up' }))}
                                >
                                  <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Move down">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={busy || pi === list.length - 1}
                                  onClick={() => act(() => apiClient.put(`/api/projects/admin/${p.id}/move`, { direction: 'down' }))}
                                >
                                  <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton color="primary" onClick={() => openForm(p)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={p.hidden ? 'Show on website' : 'Hide from website'}>
                              <IconButton
                                color="primary"
                                disabled={busy}
                                onClick={() => act(() => apiClient.put(`/api/projects/admin/${p.id}/visibility`, { hidden: !p.hidden }))}
                              >
                                {p.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open on the website (after publishing)">
                              <IconButton component="a" href={projectUrl(p.id)} target="_blank" rel="noreferrer">
                                <OpenInNewIcon />
                              </IconButton>
                            </Tooltip>
                            {p.hidden && (
                              <Tooltip title="Delete permanently">
                                <IconButton color="error" onClick={() => setToDelete(p)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          );
        })
      )}

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
