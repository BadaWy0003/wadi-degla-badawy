// "Topic" pages: one page per main search topic ("Egyptian marble", "Egyptian granite"…).
// Each has text from translations (topics.<key>.*), the live list of stones for that topic
// (from the admin panel, at build time), projects that used those stones, questions and
// answers, and links to related pages. Rendered by src/components/Topic/TopicPage.js.
//
// To add a page: add an entry here, its texts under topics.<key> in all 12 translation
// files, a wrapper app/[lang]/<slug>/page.js (copy an existing one), and the path to
// STATIC_PAGES in app/sitemap.js.

export const TOPIC_PAGES = {
  egyptianMarble: {
    slug: 'egyptian-marble',
    hero: '/Assets/Media/Hero/quarries-hero.webp',
    products: (p) => p.type === 'Egyptian Marble',
    related: ['galalaMarble', 'egyptianGranite', 'importedMarble', 'buyGuide'],
  },
  egyptianGranite: {
    slug: 'egyptian-granite',
    hero: '/Assets/Media/Hero/products-hero-2.webp',
    products: (p) => p.type === 'Egyptian Granite',
    related: ['egyptianMarble', 'importedGranite', 'kerbstone', 'cobbles', 'buyGuide'],
  },
  importedMarble: {
    slug: 'imported-marble',
    hero: '/Assets/Media/Hero/inspo-hero.webp',
    products: (p) => p.type === 'Imported Marble',
    related: ['egyptianMarble', 'importedGranite', 'buyGuide'],
  },
  importedGranite: {
    slug: 'imported-granite',
    hero: '/Assets/Media/Hero/products-hero.webp',
    products: (p) => p.type === 'Imported Granite',
    related: ['egyptianGranite', 'importedMarble', 'buyGuide'],
  },
  galalaMarble: {
    slug: 'galala-marble',
    hero: '/Assets/Media/Hero/quarries-home.webp',
    products: (p) => /^galala/i.test(String(p.name).trim()),
    related: ['egyptianMarble', 'quarries', 'history', 'buyGuide'],
  },
  buyGuide: {
    slug: 'buy-marble-from-egypt',
    hero: '/Assets/Media/Hero/exports-hero.webp',
    products: null, // no stone list: links to the category pages instead
    related: [
      'egyptianMarble',
      'egyptianGranite',
      'importedMarble',
      'importedGranite',
      'packing',
      'exports',
    ],
  },
};

// Other pages a topic page can link to (path + translation key of its name).
export const OTHER_LINKS = {
  kerbstone: { path: '/kerbstone', label: 'navigation.kerbstone' },
  cobbles: { path: '/cobbles', label: 'navigation.cobbles' },
  quarries: { path: '/quarries', label: 'navigation.quarries' },
  history: { path: '/history', label: 'navigation.history' },
  packing: { path: '/packing', label: 'navigation.packing' },
  exports: { path: '/exports', label: 'navigation.exports' },
};

// Firestore category -> its topic page (used by the products list and product pages).
export const CATEGORY_TOPIC = {
  'Egyptian Marble': 'egyptian-marble',
  'Egyptian Granite': 'egyptian-granite',
  'Imported Marble': 'imported-marble',
  'Imported Granite': 'imported-granite',
};
