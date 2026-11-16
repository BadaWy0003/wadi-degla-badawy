// The site's menus, shared by the Navbar (dropdowns) and the Footer (columns), so both always
// list the same pages. `label` is a translation key. Page addresses never change here: moving
// a link between menus doesn't affect SEO.

// Small stone photos (96 px) shown next to the stone categories in the header menus.
const MENU_IMG = (name) => `/Assets/Media/Menu/${name}.webp`;

export const COMPANY_MENU = {
  label: 'navigation.wadiDegla',
  groups: [
    {
      items: [
        { href: '/history', label: 'navigation.history' },
        { href: '/about', label: 'navigation.whyChooseUs' },
        { href: '/certificates', label: 'navigation.certificates' },
        { href: '/machinery', label: 'navigation.machinery' },
        { href: '/quarries', label: 'navigation.quarries' },
        { href: '/exports', label: 'navigation.exports' },
        { href: '/packing', label: 'navigation.packing' },
      ],
    },
  ],
};

export const PRODUCTS_MENU = {
  label: 'navigation.products',
  wide: true,
  groups: [
    {
      title: 'navigation.groupStones',
      items: [
        {
          href: '/egyptian-marble',
          label: 'visualizer.egyptianMarble',
          img: MENU_IMG('egyptian-marble'),
        },
        {
          href: '/egyptian-limestone',
          label: 'visualizer.egyptianLimestone',
          img: MENU_IMG('egyptian-limestone'),
        },
        {
          href: '/egyptian-granite',
          label: 'visualizer.egyptianGranite',
          img: MENU_IMG('egyptian-granite'),
        },
        {
          href: '/imported-marble',
          label: 'visualizer.importedMarble',
          img: MENU_IMG('imported-marble'),
        },
        {
          href: '/imported-granite',
          label: 'visualizer.importedGranite',
          img: MENU_IMG('imported-granite'),
        },
      ],
    },
    {
      title: 'navigation.groupStoneProducts',
      items: [
        { href: '/patterns', label: 'navigation.patterns' },
        { href: '/kerbstone', label: 'navigation.kerbstone' },
        { href: '/cobbles', label: 'navigation.cobbles' },
        { href: '/stone-creations', label: 'navigation.stoneCreations' },
      ],
    },
    {
      title: 'navigation.groupTools',
      items: [{ href: '/visualizer', label: 'navigation.materialVisualizer' }],
    },
  ],
  // Shown as a button under the groups
  all: { href: '/products', label: 'navigation.viewAllProducts' },
};

export const RESOURCES_MENU = {
  label: 'navigation.resources',
  groups: [
    {
      items: [
        { href: '/buy-marble-from-egypt', label: 'navigation.buyGuide' },
        { href: '/gallery', label: 'navigation.gallery' },
        { href: '/inspiration', label: 'navigation.inspiration' },
        { href: '/news', label: 'navigation.news' },
        { href: '/partners', label: 'navigation.partners' },
      ],
    },
  ],
};

export const DROPDOWN_MENUS = [COMPANY_MENU, PRODUCTS_MENU, RESOURCES_MENU];

// Every link of a menu, in order (the footer lists them as one column).
export const menuLinks = (menu) => [
  ...menu.groups.flatMap((g) => g.items),
  ...(menu.all ? [menu.all] : []),
];

// Which top-level menu a page belongs to, for the gold "you are here" mark in the header.
// path: the address without the language ('/egyptian-marble', '/products/galala'…).
const EXTRA = {
  [PRODUCTS_MENU.label]: ['/products', '/galala-marble'],
};
export function menuOfPath(path) {
  const clean = `/${String(path || '')
    .split('/')
    .filter(Boolean)
    .join('/')}`;
  const hit = (href) => clean === href || clean.startsWith(`${href}/`);
  if (hit('/projects')) return 'navigation.projects';
  if (hit('/contact')) return 'navigation.contact';
  if (hit('/fairs')) return 'navigation.fairs';
  for (const menu of DROPDOWN_MENUS) {
    const hrefs = menu.groups.flatMap((g) => g.items.map((i) => i.href));
    if ([...hrefs, ...(EXTRA[menu.label] || [])].some(hit)) return menu.label;
  }
  return null;
}
