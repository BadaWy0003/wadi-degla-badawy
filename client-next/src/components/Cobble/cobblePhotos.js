// Cobbles photos: the website's own, with the client's changes from the admin panel
// (Website → Cobbles → Photos) on top. Not a client component (content-defaults.json reads the
// defaults).
import { sitePhoto, sitePhotoItems } from '../../util/site-content';

const DIR = '/Assets/Media/Kerb-and-Cobbles/cobble';
const OWN = ['cobble6', 'cobble7', 'cobble8', 'cobble1', 'cobble-hero'].map(
  (n) => `${DIR}/${n}.webp`,
);

export const COBBLE_PHOTOS_DEFAULTS = {
  splitPhoto: OWN[1], // beside "natural split cobbles"
  flamedPhoto: OWN[2], // beside "flamed paving"
  galleryPhotos: OWN,
};

const saved = sitePhotoItems('cobbles', 'galleryPhotos');
export const COBBLE_GALLERY = saved ? saved.map((p) => p.src) : OWN;
export const SPLIT_PHOTO = sitePhoto('cobbles', 'splitPhoto', OWN[1]);
export const FLAMED_PHOTO = sitePhoto('cobbles', 'flamedPhoto', OWN[2]);
