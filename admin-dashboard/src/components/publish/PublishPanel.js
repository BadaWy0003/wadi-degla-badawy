import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Link, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import apiClient from '../../util/client';

const timeAgo = ms => {
  if (!ms) return '';
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return new Date(ms).toLocaleDateString();
};

// A publish was started but GitHub has not reported the new run yet (it takes a few
// seconds), or the run is still going.
const isUpdating = status => {
  if (!status) return false;
  const run = status.run;
  const startedMs = run?.startedAt ? new Date(run.startedAt).getTime() : 0;
  const waitingForRun = status.lastPublishAt && Date.now() - status.lastPublishAt < 10 * 60000 && startedMs < status.lastPublishAt - 5000;
  return !!waitingForRun || (!!run && run.status !== 'completed');
};

// "Publish to website", shared by the News and Projects pages: one website rebuild (about
// 5 minutes) publishes everything saved in both. refreshKey: change it after a save so the
// panel re-reads whether there are unpublished changes.
export default function PublishPanel({ refreshKey }) {
  const [status, setStatus] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/api/publish');
      setStatus(data.data);
    } catch {
      // error toast shown by apiClient
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // While the website is being rebuilt, refresh the status every 20 seconds.
  useEffect(() => {
    if (!isUpdating(status)) return undefined;
    const timer = setInterval(load, 20000);
    return () => clearInterval(timer);
  }, [status, load]);

  const publish = async () => {
    setPublishing(true);
    try {
      await apiClient.post('/api/publish');
    } catch {
      // error toast shown by apiClient
    }
    setPublishing(false);
    load();
  };

  if (!status) return null;
  const run = status.run;
  const running = isUpdating(status);
  const failed = run && run.status === 'completed' && run.conclusion !== 'success';
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 260 }}>
        {!status.configured ? (
          <Alert severity="warning">Publishing is not set up yet (the GitHub key is missing on the server). Saved changes are kept safely.</Alert>
        ) : running ? (
          <Alert severity="info" icon={<CircularProgress size={18} />}>
            The website is being updated{status.lastPublishAt ? ` (started ${timeAgo(status.lastPublishAt)})` : ''}. It takes 5 to 10 minutes.
          </Alert>
        ) : status.unpublishedChanges ? (
          <Alert severity="warning">There are saved changes that are not on the website yet.</Alert>
        ) : failed ? (
          <Alert severity="error">
            The last website update did not finish.{' '}
            <Link href={run.url} target="_blank" rel="noreferrer">
              Details
            </Link>
          </Alert>
        ) : (
          <Alert severity="success">
            The website is up to date{status.lastPublishAt ? ` (last published ${timeAgo(status.lastPublishAt)})` : ''}.
          </Alert>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={publishing ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
        disabled={!status.configured || publishing || running}
        onClick={publish}
      >
        Publish to website
      </Button>
    </Paper>
  );
}
