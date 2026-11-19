// The Gallery page's groups. Which photos go in a group is chosen in the admin panel
// (Website → Gallery → Photo groups, saved as Gallery photo ids); until then, the photos whose
// name (the number typed when uploading) is in `names`. A photo in no group is shown under
// "More photos". Not a client component: content-defaults.json reads the defaults.
import { siteData } from '../../util/site-content';

export const GALLERY_GROUPS = [
  {
    id: 'factory',
    field: 'groupFactory',
    link: '/machinery',
    names: ['25', '6', '18', '7', '2', '8', '1', '11', '19', '15', '32'],
  },
  {
    id: 'yard',
    field: 'groupYard',
    link: '/quarries',
    names: ['28', '3', '4', '27', '22', '26'],
  },
  {
    id: 'packing',
    field: 'groupPacking',
    link: '/packing',
    names: ['24', '29', '30', '31', '21'],
  },
];

// The client's photo ids for a group, or null (use the names).
export const chosenIds = (group) => {
  const v = siteData('gallery')[group.field];
  return Array.isArray(v) && v.length ? v.map(String) : null;
};

// { groupFactory: [ids], ... } for the admin panel's originals, from the gallery items' names.
export const galleryGroupsDefaults = (items) => {
  const byName = new Map(items.map((it) => [String(it.name || '').trim(), String(it.id)]));
  return Object.fromEntries(
    GALLERY_GROUPS.map((g) => [g.field, g.names.map((n) => byName.get(n)).filter(Boolean)]),
  );
};
