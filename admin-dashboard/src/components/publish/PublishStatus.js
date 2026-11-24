import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Link, Popover, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import apiClient from '../../util/client';

// "Publish to website" for the whole panel (redesign step 1, 2026-11-24): one button in the
// top bar instead of a panel on 5 pages. One website rebuild (5 to 10 minutes) publishes
// everything saved: news, projects, website texts and photos, stone changes.

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

const PublishContext = createContext({ status: null, refresh: () => {} });
export const usePublish = () => useContext(PublishContext);

export function PublishProvider({ enabled, children }) {
  const [status, setStatus] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const { data } = await apiClient.get('/api/publish');
      setStatus(data.data);
    } catch {
      // error toast shown by apiClient
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // While the website is being rebuilt, refresh the status every 20 seconds.
  useEffect(() => {
    if (!isUpdating(status)) return undefined;
    const timer = setInterval(refresh, 20000);
    return () => clearInterval(timer);
  }, [status, refresh]);

  const publish = async () => {
    setPublishing(true);
    try {
      await apiClient.post('/api/publish');
    } catch {
      // error toast shown by apiClient
    }
    setPublishing(false);
    refresh();
  };

  return <PublishContext.Provider value={{ status: enabled ? status : null, refresh, publish, publishing }}>{children}</PublishContext.Provider>;
}

// What the status means, for the button and its details box.
export const publishState = status => {
  if (!status) return null;
  const run = status.run;
  if (!status.configured) return 'off';
  if (isUpdating(status)) return 'running';
  if (status.unpublishedChanges) return 'changes';
  if (run && run.status === 'completed' && run.conclusion !== 'success') return 'failed';
  return 'ok';
};

const LABEL = {
  off: 'Publishing off',
  running: 'Updating website…',
  changes: 'Publish changes',
  failed: 'Last update failed',
  ok: 'Website up to date',
};

// The top-bar button; a click shows the details and the Publish button.
export function PublishButton({ compact }) {
  const { status, publish, publishing } = usePublish();
  const [anchor, setAnchor] = useState(null);
  const state = publishState(status);
  if (!state) return null;
  const icon = {
    off: <CloudOffIcon />,
    running: <CircularProgress size={16} color="inherit" />,
    changes: <CloudUploadIcon />,
    failed: <ErrorOutlineIcon />,
    ok: <CheckCircleIcon />,
  }[state];
  const run = status.run;
  return (
    <>
      <Button
        onClick={e => setAnchor(e.currentTarget)}
        variant={state === 'changes' ? 'contained' : 'outlined'}
        color={state === 'failed' ? 'error' : 'primary'}
        startIcon={compact ? null : icon}
        aria-label={LABEL[state]}
        sx={{
          whiteSpace: 'nowrap',
          minWidth: compact ? 40 : undefined,
          px: compact ? 1 : 2,
          ...(state === 'ok' || state === 'off' ? { color: 'text.secondary', borderColor: 'divider' } : {}),
        }}
      >
        {compact ? icon : LABEL[state]}
      </Button>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2.5, width: 340, maxWidth: 'calc(100vw - 24px)', mt: 1 } } }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 650, mb: 1 }}>
          Website
        </Typography>
        <Box sx={{ mb: 2 }}>
          {state === 'off' && (
            <Alert severity="warning">Publishing is not set up yet (the GitHub key is missing on the server). Saved changes are kept safely.</Alert>
          )}
          {state === 'running' && (
            <Alert severity="info" icon={<CircularProgress size={18} />}>
              The website is being updated{status.lastPublishAt ? ` (started ${timeAgo(status.lastPublishAt)})` : ''}. It takes 5 to 10 minutes.
            </Alert>
          )}
          {state === 'changes' && <Alert severity="warning">There are saved changes that are not on the website yet.</Alert>}
          {state === 'failed' && (
            <Alert severity="error">
              The last website update did not finish.{' '}
              <Link href={run.url} target="_blank" rel="noreferrer">
                Details
              </Link>
            </Alert>
          )}
          {state === 'ok' && (
            <Alert severity="success">
              The website is up to date{status.lastPublishAt ? ` (last published ${timeAgo(status.lastPublishAt)})` : ''}.
            </Alert>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Publishing puts everything you saved (stones, news, projects, website texts and photos) on the live website in one update.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          startIcon={publishing ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
          disabled={state === 'off' || state === 'running' || publishing}
          onClick={async () => {
            await publish();
          }}
        >
          Publish to website
        </Button>
      </Popover>
    </>
  );
}
