// The Patterns page's photos: the client's from the admin panel (Website → Patterns & pavers),
// else the website's own. Not a client component: content-defaults.json reads the defaults.
import { sitePhoto } from '../../util/site-content';

const DIR = '/Assets/Media/Patterns';
const PAVERS = [1, 2, 3, 4];
const SPLITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const PATTERNS_PHOTOS_DEFAULTS = Object.fromEntries([
  ...PAVERS.flatMap((n) => [
    [`paverSample${n}`, `${DIR}/p${n}.webp`],
    [`paverScene${n}`, `${DIR}/pavers${n}.webp`],
  ]),
  ...SPLITS.flatMap((n) => [
    [`splitSample${n}`, `${DIR}/${n}.webp`],
    [`splitScene${n}`, `${DIR}/split-face-${n}.webp`],
  ]),
  ...[1, 2, 3, 4].map((n) => [`pattern${n}`, `${DIR}/pattern${n}.webp`]),
]);

const photo = (name) => sitePhoto('patterns', name, PATTERNS_PHOTOS_DEFAULTS[name]);

export const PAVER_PHOTOS = PAVERS.map((n) => ({
  swatch: photo(`paverSample${n}`),
  scene: photo(`paverScene${n}`),
}));
export const SPLIT_PHOTOS = SPLITS.map((n) => ({
  swatch: photo(`splitSample${n}`),
  scene: photo(`splitScene${n}`),
}));
export const PATTERN_PHOTOS = [1, 2, 3, 4].map((n) => photo(`pattern${n}`));
