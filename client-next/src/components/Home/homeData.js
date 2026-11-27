// The home page's photos and featured stones: the website's own, with the client's changes
// from the admin panel ("Website" → "Home page") on top. Its texts are home.* translations,
// changed through t() like every other text.
import { siteData } from '../../util/site-content';

const HERO = '/Assets/Media/Hero';
const img = (name, width, height) => ({ src: `${HERO}/${name}.webp`, width, height });

export const HOME_PHOTOS_DEFAULTS = {
  heroDesktop: img('home-hero-4', 1536, 1024),
  // phones: the owner's stockyard photo, shown at full width at the top (HomePage.css)
  heroPhone: img('home-hero-yard-window-m', 900, 1125),
  tileEgyptianMarble: img('stone-tile-egyptian-marble-2', 480, 640),
  tileEgyptianGranite: img('stone-tile-egyptian-granite', 480, 640),
  tileImportedMarble: img('stone-tile-imported-marble', 480, 640),
  tileImportedGranite: img('stone-tile-imported-granite', 480, 640),
  quarriesPhoto: img('quarries-home-card', 900, 450),
  projectsPhoto: img('projects-hero-card', 900, 998),
  inspirationPhoto: img('inspo-home-hero-card', 700, 933),
  visualizerPhoto: img('visualizer-home-card', 900, 1021),
};

const saved = siteData('home');
export const HOME_PHOTOS = Object.fromEntries(
  Object.entries(HOME_PHOTOS_DEFAULTS).map(([k, v]) => [k, saved[k]?.src ? saved[k] : v]),
);
// Whether the client replaced the header photos (the page then preloads theirs).
export const HERO_CHANGED = !!(saved.heroDesktop?.src || saved.heroPhone?.src);

// The stones of the "showroom", by name (the website's own list); the admin panel saves
// product ids instead (they don't change when a stone is renamed).
// Owner, 2026-11-27: own-quarry Egyptian stones with full data first, one imported stone last.
export const FEATURED_DEFAULT_NAMES = [
  'Galala',
  'Creamy White Pearl',
  'Beige Sinai Pearl',
  'Sunny Light',
  'Emperador',
  'Red Aswan',
  'Halayeb',
  'Calacatta Italy',
];
export const FEATURED_IDS = Array.isArray(saved.featured) ? saved.featured : null;
