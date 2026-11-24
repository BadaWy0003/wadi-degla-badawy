// Shared lists for the Stones page and the stone editor (redesign step 2, 2026-11-24).

// The website shows these categories (client-next/src/util/product-types.js). Any other
// category is saved, but the stone appears nowhere on the website.
export const CATEGORIES = ['Egyptian Marble', 'Egyptian Limestone', 'Egyptian Granite', 'Imported Marble', 'Imported Granite'];

// Finish photos (a close-up of the stone's surface). The saved value is the English name
// the website translates (client-next/src/util/finishes.js).
export const FINISHES = ['Polished', 'Honed', 'Antique', 'Brushed', 'Bush Hammered', 'Flamed', 'Leather', 'Rough', 'Sand blasted', 'Split Face'];

// Room photos are stored as finishes with these names (the website's Visualizer and the
// stone page's "See it in a space" use them).
export const ROOMS = [
  {
    value: 'indoorMockup',
    label: 'Room photo – interior',
    hint: '1920 × 810: floor on the left, wall on the right',
  },
  {
    value: 'outdoorMockup',
    label: 'Room photo – exterior',
    hint: '1920 × 810: tower on the left, façade on the right',
  },
];
export const ROOM_VALUES = ['indoorMockup', 'outdoorMockup', 'mockup'];
export const isRoom = name => ROOM_VALUES.includes(name);

// Friendly name of a saved finish
export const finishLabel = name =>
  ({ indoorMockup: 'Room photo – interior', outdoorMockup: 'Room photo – exterior', mockup: 'Room photo (old)' })[name] || name;

export const FORMS = [
  ['slabs', 'Slabs'],
  ['tiles', 'Tiles (cut to size)'],
  ['blocks', 'Blocks'],
];
export const USES = [
  ['flooring', 'Flooring'],
  ['wallCladding', 'Wall cladding'],
  ['exteriorCladding', 'Exterior cladding / facades'],
  ['staircases', 'Staircases'],
  ['windowSills', 'Window sills'],
  ['countertops', 'Countertops'],
  ['landscaping', 'Landscaping / outdoor paving'],
];
export const TECH = [
  ['density', 'Density', 'kg/m³'],
  ['waterAbsorption', 'Water absorption', '%'],
  ['compressiveStrength', 'Compressive strength', 'MPa'],
  ['flexuralStrength', 'Flexural strength', 'MPa'],
  ['abrasionResistance', 'Abrasion resistance', 'Ha'],
  ['modulusOfRupture', 'Modulus of rupture', 'MPa'],
];
// Floor traffic the stone is rated for (server: product-details.service.js TRAFFIC)
export const TRAFFIC = [
  ['', 'Not set'],
  ['heavy', 'Heavy traffic (busy public floors)'],
  ['light', 'Light traffic (homes, offices, hotel rooms)'],
];
export const OTHER_LANGS = ['fr', 'es', 'de', 'it', 'ro', 'ko', 'sq', 'ru', 'ja', 'zh'];

export const EMPTY_DETAILS = {
  description: { en: '', ar: '' },
  otherNames: [],
  origin: { en: '', ar: '' },
  colour: { en: '', ar: '' },
  forms: [],
  thicknesses: '',
  sizes: '',
  uses: [],
  traffic: '',
  tech: Object.fromEntries(TECH.map(([k]) => [k, ''])),
};

export const detailsFromServer = d => ({
  description: { en: d?.description?.en || '', ar: d?.description?.ar || '' },
  otherNames: d?.otherNames || [],
  origin: { en: d?.origin?.en || '', ar: d?.origin?.ar || '' },
  colour: { en: d?.colour?.en || '', ar: d?.colour?.ar || '' },
  forms: d?.forms || [],
  thicknesses: d?.thicknesses || '',
  sizes: d?.sizes || '',
  uses: d?.uses || [],
  traffic: d?.traffic || '',
  tech: Object.fromEntries(TECH.map(([k]) => [k, d?.tech?.[k] ?? ''])),
});

// The stone's main photo for the list: Polished, else Honed, else the first finish photo
export const mainPhoto = stone => {
  const f = stone.finishes || [];
  const pick = f.find(x => x.finish === 'Polished') || f.find(x => x.finish === 'Honed') || f.find(x => !isRoom(x.finish));
  return pick ? pick.mini || pick.thumb || pick.link : '';
};

// Same as the website's product address (client-next/src/util/product-slugs.js)
export const stoneSlug = name =>
  String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

// What is still missing for a stone, shown on the Stones list ("details" = its website
// details, only known for stones visible on the website)
export const missingOf = (stone, details) => {
  const f = (stone.finishes || []).map(x => x.finish);
  const out = [];
  if (!f.includes('Polished') && !f.includes('Honed')) out.push('No Polished/Honed photo');
  if (!f.some(x => x === 'indoorMockup' || x === 'mockup')) out.push('No room photo');
  if (details !== undefined) {
    if (!details?.description?.en) out.push('No description');
    else if (!details?.description?.ar) out.push('No Arabic description');
  }
  return out;
};
