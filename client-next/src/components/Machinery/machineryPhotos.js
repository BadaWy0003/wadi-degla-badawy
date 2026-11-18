// Each machine's photos: the client's list from the admin panel ("Website" → "Machinery",
// fields photos_<machine>), else the website's own (MachineryData.js). The first photo is shown
// on the machine's card; all of them open in the zoom viewer.
import { generalUseData, mngBlocksData, mngSlabsData, mngTilesData } from './MachineryData';
import { siteData } from '../../util/site-content';

// "machinery.blocks.gangsaws" <-> admin field "photos_gangsaws"
export const photosField = (titleKey) => `photos_${titleKey.split('.').pop()}`;

const saved = siteData('machinery');
const withSaved = (list) =>
  list.map((item) => {
    const own = saved[photosField(item.titleKey)];
    return Array.isArray(own) && own.length ? { ...item, images: own.map((p) => p.src) } : item;
  });

export const GENERAL_USE = withSaved(generalUseData);
export const BLOCKS_STAGE = withSaved(mngBlocksData);
export const SLABS_STAGE = withSaved(mngSlabsData);
export const TILES_STAGE = withSaved(mngTilesData);

// The website's own photos, by admin field (for content-defaults.json).
export const MACHINERY_PHOTOS_DEFAULTS = Object.fromEntries(
  [...generalUseData, ...mngBlocksData, ...mngSlabsData, ...mngTilesData].map((item) => [
    photosField(item.titleKey),
    item.images,
  ]),
);
