// The archive photos of "A living legacy": the client's list from the admin panel
// (Website → History → Photos), else the website's own (HistoryImages.js with the sizes in
// historySizes.js). Each item is { src, width, height }: every photo on this page is shown
// whole at its own shape. Not a client component (content-defaults.json reads the defaults).
import { HistoryImages } from './HistoryImages';
import { HISTORY_SIZES } from './historySizes';
import { sitePhotoItems } from '../../util/site-content';

const sizeOf = (src) => HISTORY_SIZES[src.split('/').pop().replace(/\.webp$/, '')];

export const HISTORY_PHOTOS_DEFAULTS = { archivePhotos: HistoryImages };

export const ARCHIVE = (
  sitePhotoItems('history', 'archivePhotos') ||
  HistoryImages.map((src) => {
    const s = sizeOf(src);
    return s ? { src, width: s[0], height: s[1] } : { src };
  })
).map(({ src, width, height }) => ({ src, width, height }));
