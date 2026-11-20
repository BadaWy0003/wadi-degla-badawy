// Stone finder (Products page, 2026-11-20): turns a stone's details from the admin panel
// (Website details: colour, origin, uses; free text in English) into simple filter values.
// Plain module: used at build time by app/[lang]/products/page.js.

// Colour groups, in the order shown. A stone gets every group named in its main colour
// (the text before "with": "White with grey veins" is white, "Grey-beige" is grey + beige).
export const COLOURS = [
  { id: 'white', swatch: '#efece6', words: ['white'] },
  { id: 'beige', swatch: '#d9c6a3', words: ['beige', 'cream', 'honey', 'amber'] },
  { id: 'grey', swatch: '#9a9892', words: ['grey', 'gray', 'silver'] },
  { id: 'black', swatch: '#1f1e1c', words: ['black', 'dark'] },
  { id: 'brown', swatch: '#7a5638', words: ['brown'] },
  { id: 'red', swatch: '#a9473f', words: ['red', 'pink', 'purple', 'burgundy'] },
  { id: 'gold', swatch: '#c9a24a', words: ['gold', 'yellow'] },
  { id: 'green', swatch: '#4f6b4a', words: ['green'] },
];

// Same order as the stone page (product-seo.js); names are productDetails.use_<id>.
export const USES = [
  'flooring',
  'wallCladding',
  'exteriorCladding',
  'staircases',
  'windowSills',
  'countertops',
  'landscaping',
];

// Country names in the origin text -> ISO codes (shown with Intl.DisplayNames).
const COUNTRIES = {
  egypt: 'EG',
  italy: 'IT',
  spain: 'ES',
  turkey: 'TR',
  iran: 'IR',
  china: 'CN',
  india: 'IN',
  greece: 'GR',
  norway: 'NO',
  finland: 'FI',
  brazil: 'BR',
  portugal: 'PT',
  oman: 'OM',
  pakistan: 'PK',
  vietnam: 'VN',
};

export function stoneColours(colourText) {
  const main = String(colourText || '')
    .toLowerCase()
    .split(/\swith\s/)[0];
  return COLOURS.filter((c) => c.words.some((w) => new RegExp(`\\b${w}`).test(main))).map(
    (c) => c.id,
  );
}

export function stoneOrigins(originText, category) {
  const text = String(originText || '').toLowerCase();
  const found = Object.keys(COUNTRIES)
    .filter((name) => new RegExp(`\\b${name}\\b`).test(text))
    .map((name) => COUNTRIES[name]);
  if (!found.length && /^Egyptian/.test(category || '')) found.push('EG');
  return found;
}

// { colours, uses, origins } for one stone (empty lists when nothing was written).
export function stoneFacets(details, category) {
  return {
    colours: stoneColours(details?.colour?.en),
    uses: USES.filter((u) => details?.uses?.includes(u)),
    origins: stoneOrigins(details?.origin?.en, category),
  };
}
