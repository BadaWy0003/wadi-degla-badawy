// The photos of each quarry and factory: the client's lists from the admin panel
// ("Website" → "Quarries & factories" → Photos), else the website's own (QuarriesImageData.js).
// Each list is in page order: the first 3 make the mosaic (the first one big), all of them open
// in the zoom viewer.
import {
  galalaQuarryImages,
  creamyQuarryImages,
  beigeSinaiPearlQuarryImages,
  firstFactoryImages,
  secondFactoryImages,
  thirdFactoryImages,
} from './QuarriesImageData';
import { siteData } from '../../util/site-content';

export const QUARRY_PHOTOS_DEFAULTS = {
  galalaPhotos: galalaQuarryImages,
  creamyPhotos: creamyQuarryImages,
  beigeSinaiPearlPhotos: beigeSinaiPearlQuarryImages,
  factory2000Photos: firstFactoryImages,
  factory2011Photos: secondFactoryImages,
  factory2015Photos: thirdFactoryImages,
};

const saved = siteData('quarries');
export const QUARRY_PHOTOS = Object.fromEntries(
  Object.entries(QUARRY_PHOTOS_DEFAULTS).map(([name, list]) => [
    name,
    Array.isArray(saved[name]) && saved[name].length ? saved[name].map((p) => p.src) : list,
  ]),
);
