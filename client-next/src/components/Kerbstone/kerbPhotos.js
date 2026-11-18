// Each kerb profile's photo and line drawing: the website's own, with the client's changes from
// the admin panel (Website → Kerbstones → Photos: photo_<profile>, drawing_<profile>) on top.
// The transition profile has no drawing. Not a client component (content-defaults.json reads
// the defaults).
import { sitePhoto } from '../../util/site-content';

const DIR = '/Assets/Media/Kerb-and-Cobbles/kerb';
const OWN = [
  { key: 'str', photo: 'str1', drawing: 'str2' },
  { key: 'fullBatter', photo: 'full-batter1', drawing: 'full-batter2' },
  { key: 'bullnose', photo: 'bullnose1', drawing: 'bullnose2' },
  { key: 'roundTop', photo: 'roundtop1', drawing: 'roundtop2' },
  { key: 'channel', photo: 'channel1', drawing: 'channel2' },
  { key: 'transition', photo: 'transition1', drawing: null },
].map((p) => ({
  key: p.key,
  photo: `${DIR}/${p.photo}.webp`,
  drawing: p.drawing && `${DIR}/${p.drawing}.webp`,
}));

export const KERB_PHOTOS_DEFAULTS = Object.fromEntries(
  OWN.flatMap((p) => [
    [`photo_${p.key}`, p.photo],
    ...(p.drawing ? [[`drawing_${p.key}`, p.drawing]] : []),
  ]),
);

export const PROFILES = OWN.map((p) => ({
  ...p,
  photo: sitePhoto('kerbstone', `photo_${p.key}`, p.photo),
  drawing: p.drawing && sitePhoto('kerbstone', `drawing_${p.key}`, p.drawing),
}));
