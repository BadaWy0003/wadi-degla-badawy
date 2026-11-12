// Product categories as stored in Firestore -> translation keys of their names
// (the same keys the Visualizer's category tabs use). The order is the order of the tabs.
export const PRODUCT_TYPE_KEYS = {
  'Egyptian Marble': 'visualizer.egyptianMarble',
  'Egyptian Limestone': 'visualizer.egyptianLimestone',
  'Egyptian Granite': 'visualizer.egyptianGranite',
  'Imported Marble': 'visualizer.importedMarble',
  'Imported Granite': 'visualizer.importedGranite',
};

export const PRODUCT_CATEGORIES = Object.keys(PRODUCT_TYPE_KEYS);

// Categories are typed in the admin panel, so some stones arrive with a stray space
// ("Egyptian Limestone ") or a one-off category. Owner's choice (2026-11-12): Emperador and
// the Egyptian alabasters belong to Egyptian Marble.
const TYPE_ALIASES = {
  'Egyptian Emperador': 'Egyptian Marble',
  'Egyptian Onyx': 'Egyptian Marble',
};

export function normalizeType(type) {
  const t = String(type ?? '').trim();
  return TYPE_ALIASES[t] || t;
}

// Apply to every product list read from the API (build time and browser).
export const normalizeProducts = (list) =>
  Array.isArray(list) ? list.map((p) => (p ? { ...p, type: normalizeType(p.type) } : p)) : list;
