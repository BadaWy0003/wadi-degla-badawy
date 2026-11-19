// The archive photos of "A living legacy": the client's list from the admin panel
// (Website → History → Photos), else the website's own (HistoryImages.js with the sizes in
// historySizes.js). Each item is { src, width, height }: every photo on this page is shown
// whole at its own shape. Not a client component (content-defaults.json reads the defaults).
import { HistoryImages } from './HistoryImages';
import { HISTORY_SIZES } from './historySizes';
import { siteData, sitePhotoItems } from '../../util/site-content';

const sizeOf = (src) =>
  HISTORY_SIZES[
    src
      .split('/')
      .pop()
      .replace(/\.webp$/, '')
  ];

const PHOTO = (name) => `/Assets/Media/History/${name}.webp`;
const withSize = (src) => {
  const s = sizeOf(src);
  return s ? { src, width: s[0], height: s[1] } : { src };
};

// The timeline's photos (the three generations' portraits and the small photos of today).
const TIMELINE_DEFAULTS = {
  photo1980: PHOTO('history16'),
  photo2000: PHOTO('sameh-ghanam'),
  photoToday: PHOTO('saeed-jr'),
  todayPhotos: ['saeed-jr-2', 'saeed-jr-3', 'saeed-jr-4', 'saeed-jr-5'].map(PHOTO),
};

export const HISTORY_PHOTOS_DEFAULTS = { ...TIMELINE_DEFAULTS, archivePhotos: HistoryImages };

// { src, width, height } each: the client's photo (Website → History → Photos), else ours
const own = (name) => {
  const v = siteData('history')[name];
  return v?.src
    ? { src: v.src, width: v.width, height: v.height }
    : withSize(TIMELINE_DEFAULTS[name]);
};
export const TIMELINE = {
  photo1980: own('photo1980'),
  photo2000: own('photo2000'),
  photoToday: own('photoToday'),
  todayPhotos: (
    sitePhotoItems('history', 'todayPhotos') || TIMELINE_DEFAULTS.todayPhotos.map(withSize)
  ).map(({ src, width, height }) => ({ src, width, height })),
};

export const ARCHIVE = (
  sitePhotoItems('history', 'archivePhotos') ||
  HistoryImages.map((src) => {
    const s = sizeOf(src);
    return s ? { src, width: s[0], height: s[1] } : { src };
  })
).map(({ src, width, height }) => ({ src, width, height }));
