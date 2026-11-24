import { useEffect } from 'react';
import { usePublish } from './PublishStatus';

// Pages that save website content render <PublishPanel refreshKey={…} />: since the redesign
// (step 1, 2026-11-24) the Publish button lives in the top bar (PublishStatus.js), so this only
// asks it to re-check for unpublished changes after a save. It shows nothing.
export default function PublishPanel({ refreshKey }) {
  const { refresh } = usePublish();
  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);
  return null;
}
