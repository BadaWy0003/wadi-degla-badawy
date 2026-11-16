// The site's menus, shared by the Navbar (dropdowns) and the Footer (columns), so both always
// list the same pages. `label` is a translation key. Page addresses never change here: moving
// a link between menus doesn't affect SEO.

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
        { href: '/egyptian-marble', label: 'visualizer.egyptianMarble' },
        { href: '/egyptian-limestone', label: 'visualizer.egyptianLimestone' },
        { href: '/egyptian-granite', label: 'visualizer.egyptianGranite' },
        { href: '/imported-marble', label: 'visualizer.importedMarble' },
        { href: '/imported-granite', label: 'visualizer.importedGranite' },
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
        { href: '/fairs', label: 'navigation.fairs' },
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
