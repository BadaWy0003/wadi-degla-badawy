// How many of each machine: the website's own numbers, with the client's changes from the admin
// panel ("Website" → "Machinery", fields count_<machine>) on top. The translated machine names
// also contain a number, which the page strips (machineName() in Machinery.js).
import { siteData } from '../../util/site-content';

export const COUNTS_DEFAULTS = {
  'machinery.generalUse.cranes': 6,
  'machinery.generalUse.forklifts': 2,
  'machinery.blocks.gangsaws': 9,
  'machinery.blocks.blocksCutters': 4,
  'machinery.blocks.monofilos': 6,
  'machinery.slabs.polishingLines': 3,
  'machinery.slabs.risinLine': 1,
  'machinery.tiles.bridgeCutters': 6,
  'machinery.tiles.tumblingMachine': 1,
  'machinery.tiles.splittingStrips': 3,
};

// "machinery.blocks.gangsaws" <-> admin field "count_gangsaws"
const fieldOf = (key) => `count_${key.split('.').pop()}`;
const saved = siteData('machinery');

export const COUNTS = Object.fromEntries(
  Object.entries(COUNTS_DEFAULTS).map(([key, n]) => [
    key,
    Number.isInteger(saved[fieldOf(key)]) ? saved[fieldOf(key)] : n,
  ]),
);

// The defaults in the admin panel's shape (for content-defaults.json).
export const countsForAdmin = () =>
  Object.fromEntries(Object.entries(COUNTS_DEFAULTS).map(([key, n]) => [fieldOf(key), n]));
