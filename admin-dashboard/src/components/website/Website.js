import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { loadBlocks, timeAgo } from '../../util/website';
import PublishPanel from '../publish/PublishPanel';

// "Website" menu: one card per editable part of the website. ADMIN / SUPER_ADMIN only.
export default function Website() {
  const [blocks, setBlocks] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadBlocks()
      .then(setBlocks)
      .catch(() => setFailed(true));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
        Website content
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 760 }}>
        Change the website's texts, numbers and contact details here. Changes are saved here first; press <b>Publish to website</b> to put them on the
        live site (about 10 minutes). Every save can be undone from the page's History.
      </Typography>

      <PublishPanel />

      {failed && <Alert severity="error">The website pages couldn't be loaded. Please refresh the page.</Alert>}
      {!blocks && !failed && <CircularProgress />}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, mt: 2 }}>
        {(blocks || []).map(b => (
          <Card key={b.id} variant="outlined" sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {b.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                {b.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                {(b.usedOn || []).map(u => (
                  <Chip key={u} label={u} size="small" />
                ))}
              </Box>
              <Typography variant="body2">
                {b.changedFields ? `${b.changedFields} of ${b.totalFields} items changed` : "Nothing changed yet (the website's original content)"}
              </Typography>
              {b.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  Last saved {timeAgo(b.updatedAt)}
                  {b.updatedBy ? ` by ${b.updatedBy}` : ''}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button variant="contained" startIcon={<EditIcon />} component={RouterLink} to={`/website/${b.id}`}>
                Edit
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
