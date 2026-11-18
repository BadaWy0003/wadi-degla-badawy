// The photos of each Inspiration style: the client's lists from the admin panel
// (Website → Inspiration → Photos), else the website's own (InspirationImageData.js). The
// FIRST photo of a list is the big photo; the others make the row under it. The website's own
// lists are given with their big photo first, so the page looks the same as before.
// Not a client component (content-defaults.json reads the defaults).
import { ancientImageData, interiorImageData, exteriorImageData } from './InspirationImageData';
import { sitePhotoItems } from '../../util/site-content';

const coverFirst = (list, cover) => [list[cover], ...list.filter((_, i) => i !== cover)];

export const INSPIRATION_PHOTOS_DEFAULTS = {
  interiorPhotos: coverFirst(interiorImageData, 7),
  exteriorPhotos: coverFirst(exteriorImageData, 2),
  ancientPhotos: coverFirst(ancientImageData, 3),
};

export const INSPIRATION_PHOTOS = Object.fromEntries(
  Object.entries(INSPIRATION_PHOTOS_DEFAULTS).map(([name, list]) => {
    const saved = sitePhotoItems('inspiration', name);
    return [name, saved ? saved.map((p) => p.src) : list];
  }),
);
