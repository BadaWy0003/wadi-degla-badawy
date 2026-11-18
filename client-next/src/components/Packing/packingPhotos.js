// Packing photos: the website's own lists, with the client's changes from the admin panel
// (Website → Packing → Photos) on top. Not a client component, so content-defaults.json can
// read PACKING_PHOTOS_DEFAULTS.
import { sitePhoto, sitePhotoItems } from '../../util/site-content';

export const P = (n) => `/Assets/Media/Packing/packing${n}.webp`;
export const E = (n) => `/Assets/Media/Exports/exports${n}.webp`;
// [photo, number of its packing.packingAlt<N> text]
export const PHOTOS = [
  [P(16), 16],
  [P(3), 3],
  [P(7), 7],
  [E(26), 22],
  [P(12), 12],
  [E(29), 25],
  [P(15), 15],
  [E(31), 27],
  [P(13), 13],
  ...[1, 2, 4, 5, 6, 8, 9, 10, 11, 14, 17].map((n) => [P(n), n]),
  ...[22, 23, 24, 25, 27, 28, 30, 32, 33, 34, 35].map((n) => [E(n), n - 4]),
];
export const SHOWN = 9;
export const PACKING_PHOTOS_DEFAULTS = {
  galleryPhotos: PHOTOS.map(([src]) => src),
  photo_woodenBundle: P(16),
  photo_normalPacking: P(10),
  photo_woodenCrates: E(24),
  photo_woodenPallet: P(9),
};
// The client's gallery from the admin panel (Website → Packing → Photos), else the list above
// (uploaded photos have no numbered alt text: they get "<gallery title> <n>").
const SAVED = sitePhotoItems('packing', 'galleryPhotos');
export const GALLERY = SAVED ? SAVED.map((p) => [p.src, null]) : PHOTOS;
// each method's photo can be replaced too (field photo_<method>)
export const methodPhoto = (key, src) => sitePhoto('packing', `photo_${key}`, src);
