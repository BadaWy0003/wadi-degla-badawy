// Top-of-page ("hero") photos. They are CSS backgrounds, which the browser finds late,
// so each page preloads its hero (see HeroPreload.js). Photos listed in MOBILE_HEROES
// also have a lighter phone version "<name>-m.webp": a square crop framed like the phone
// CSS (made with sharp, quality 62-70), used up to 768px wide via mobile.css / TopicPage.
const DIR = '/Assets/Media/Hero/';

export const MOBILE_HEROES = new Set([
  'quarries-hero',
  'quarries-home',
  'exports-hero',
  'home-hero-4',
  'projects-hero-mobile',
]);

export const PAGE_HEROES = {
  home: { desktop: 'home-hero-4', phone: 'home-hero-4' },
  about: { desktop: 'about-hero' },
  history: { desktop: 'history-hero' },
  quarries: { desktop: 'quarries-hero' },
  products: { desktop: 'products-hero' },
  projects: { desktop: 'projects-hero', phone: 'projects-hero-mobile' },
  kerbstone: { desktop: 'kerb-hero' },
  cobbles: { desktop: 'cobble-hero' },
  machinery: { desktop: 'machinery-hero' },
  inspiration: { desktop: 'inspo-hero' },
  patterns: { desktop: 'patterns-hero' },
  stoneCreations: { desktop: 'stone-creation-hero' },
  news: { desktop: 'news-hero' },
  contact: { desktop: 'contact-hero' },
};

const nameOf = (src) => src.replace(DIR, '').replace(/\.webp$/, '');

// '/Assets/Media/Hero/quarries-hero.webp' -> its phone version when there is one
export function heroPhoneSrc(src) {
  const name = nameOf(src);
  return MOBILE_HEROES.has(name) ? `${DIR}${name}-m.webp` : src;
}

export function heroSrc(name) {
  return `${DIR}${name}.webp`;
}
