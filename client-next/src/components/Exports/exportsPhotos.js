// Exports photos: the website's own lists, with the client's changes from the admin panel
// (Website → Exports → Photos) on top. Not a client component, so content-defaults.json can
// read EXPORTS_PHOTOS_DEFAULTS.
import { sitePhoto, sitePhotoItems } from '../../util/site-content';

export const PHOTO = (n) => `/Assets/Media/Exports/exports${n}.webp`;
// [photo, number of its exports.gallery.galleryAlt<N> text]
export const PHOTOS = [
  [PHOTO(26), 25],
  [PHOTO(3), 3],
  [PHOTO(4), 4],
  [PHOTO(5), 5],
  [PHOTO(9), 8],
  [PHOTO(12), 11],
  [PHOTO(15), 14],
  [PHOTO(20), 19],
  [PHOTO(23), 22],
  ...[24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35].map((n) => [PHOTO(n), n - 1]),
  ['/Assets/Media/Packing/packing3.webp', 1],
  ['/Assets/Media/Packing/packing7.webp', 2],
  [PHOTO(6), 6],
  [PHOTO(8), 7],
  ...[10, 11, 13, 14, 16, 17, 18, 19, 21, 22].map((n) => [PHOTO(n), n - 1]),
];
export const SHOWN = 9;

export const EXPORTS_PHOTOS_DEFAULTS = {
  teamPhoto: PHOTOS[0][0],
  galleryPhotos: PHOTOS.map(([src]) => src),
};
// The client's gallery (uploaded photos have no numbered alt text: "<gallery title> <n>").
const SAVED = sitePhotoItems('exports', 'galleryPhotos');
export const GALLERY = SAVED ? SAVED.map((p) => [p.src, null]) : PHOTOS;
// the photo beside "What our export team handles"
export const TEAM_PHOTO = sitePhoto('exports', 'teamPhoto', PHOTOS[0][0]);
