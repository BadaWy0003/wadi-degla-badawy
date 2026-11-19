// "Topic" pages: one page per main search topic ("Egyptian marble", "Egyptian granite"…).
// Each has text from translations (topics.<key>.*), the live list of stones for that topic
// (from the admin panel, at build time), projects that used those stones, questions and
// answers, and links to related pages. Rendered by src/components/Topic/TopicPage.js.
//
// To add a page: add an entry here, its texts under topics.<key> in all 12 translation
// files, a wrapper app/[lang]/<slug>/page.js (copy an existing one), and the path to
// STATIC_PAGES in app/sitemap.js.

import { sitePhoto } from './site-content';

export const TOPIC_PAGES = {
  egyptianMarble: {
    slug: 'egyptian-marble',
    // Strips of our own stones' photos, made by tools/make-topic-heroes.js (also the next three).
    hero: '/Assets/Media/Hero/egyptian-marble-hero.webp',
    products: (p) => p.type === 'Egyptian Marble',
    // Galala, Sunny, Triesta… are limestone (category "Egyptian Limestone" since 2026-11-12), but
    // the trade and buyers call them Egyptian marble: listed in a second group under their own
    // heading (`<key>.alsoTitle`), with a link to their page (owner's choice, 2026-11-12).
    alsoProducts: (p) => p.type === 'Egyptian Limestone',
    alsoLink: 'egyptianLimestone',
    related: ['egyptianLimestone', 'galalaMarble', 'egyptianGranite', 'importedMarble', 'buyGuide'],
  },
  egyptianLimestone: {
    slug: 'egyptian-limestone',
    hero: '/Assets/Media/Hero/egyptian-limestone-hero.webp',
    products: (p) => p.type === 'Egyptian Limestone',
    related: ['egyptianMarble', 'galalaMarble', 'egyptianGranite', 'buyGuide'],
  },
  egyptianGranite: {
    slug: 'egyptian-granite',
    hero: '/Assets/Media/Hero/egyptian-granite-hero.webp',
    products: (p) => p.type === 'Egyptian Granite',
    related: ['egyptianMarble', 'importedGranite', 'kerbstone', 'cobbles', 'buyGuide'],
  },
  importedMarble: {
    slug: 'imported-marble',
    hero: '/Assets/Media/Hero/imported-marble-hero.webp',
    products: (p) => p.type === 'Imported Marble',
    related: ['egyptianMarble', 'importedGranite', 'buyGuide'],
  },
  importedGranite: {
    slug: 'imported-granite',
    hero: '/Assets/Media/Hero/imported-granite-hero.webp',
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
    hero: '/Assets/Media/Hero/buy-guide-hero.webp', // the client's loading-yard photo (2026-11-15)
    // one photo per ordering step (steps in content/topics), shown beside each step
    stepPhotos: [
      '/Assets/Media/visualizer-home.webp',
      '/Assets/Media/products-hero-1.webp',
      '/Assets/Media/about-expertise.webp',
      '/Assets/Media/Machinery/polishing-line.webp',
      '/Assets/Media/Packing/packing1.webp',
      '/Assets/Media/Exports/exports28.webp',
    ],
    products: null, // no stone list: links to the category pages instead
    related: [
      'egyptianMarble',
      'egyptianLimestone',
      'egyptianGranite',
      'importedMarble',
      'importedGranite',
      'packing',
      'exports',
    ],
  },
};

// The header photo the client set in the admin panel (Website → each stone guide →
// "Header photo"), else the website's own; `defaultHero` keeps the original.
for (const [key, page] of Object.entries(TOPIC_PAGES)) {
  page.defaultHero = page.hero;
  page.hero = sitePhoto(`topic_${key}`, 'heroPhoto', page.hero);
  // the buying guide's step photos (Website → Buying guide → "Step N: photo")
  if (page.stepPhotos) {
    page.defaultStepPhotos = page.stepPhotos;
    page.stepPhotos = page.stepPhotos.map((src, i) =>
      sitePhoto(`topic_${key}`, `stepPhoto${i + 1}`, src),
    );
  }
}

// Other pages a topic page or a RelatedPages block can link to (path + translation key of its name).
export const OTHER_LINKS = {
  kerbstone: { path: '/kerbstone', label: 'navigation.kerbstone' },
  cobbles: { path: '/cobbles', label: 'navigation.cobbles' },
  quarries: { path: '/quarries', label: 'navigation.quarries' },
  history: { path: '/history', label: 'navigation.history' },
  packing: { path: '/packing', label: 'navigation.packing' },
  exports: { path: '/exports', label: 'navigation.exports' },
  machinery: { path: '/machinery', label: 'navigation.machinery' },
  patterns: { path: '/patterns', label: 'navigation.patterns' },
  stoneCreations: { path: '/stone-creations', label: 'navigation.stoneCreations' },
  products: { path: '/products', label: 'navigation.viewAllProducts' },
  projects: { path: '/projects', label: 'navigation.projects' },
  visualizer: { path: '/visualizer', label: 'navigation.materialVisualizer' },
  contact: { path: '/contact', label: 'navigation.contact' },
};

// Firestore category -> its topic page (used by the products list and product pages).
export const CATEGORY_TOPIC = {
  'Egyptian Marble': 'egyptian-marble',
  'Egyptian Limestone': 'egyptian-limestone',
  'Egyptian Granite': 'egyptian-granite',
  'Imported Marble': 'imported-marble',
  'Imported Granite': 'imported-granite',
};
