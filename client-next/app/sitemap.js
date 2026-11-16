// Generates /sitemap.xml at build time (replaces the hand-written public/sitemap.xml).
// Every public page in all 12 languages, each with hreflang alternates.
import { SUPPORTED_LANGS } from '../src/util/supported-langs';
import { getProductSlugs } from '../src/util/product-slugs';
import { getProjectIds, getProjectIndexedLangs } from '../src/util/projects-data';
import { getNewsArticles, getNewsIndexedLangs } from '../src/util/news-data';
import { pageLastModified } from '../src/util/page-dates';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.wadidegla-eg.com';

// Public pages under app/[lang]/ ('' = home). Login, signup, my-account and the
// 404 pages are left out on purpose: they shouldn't appear in search results.
// <lastmod> (src/util/page-dates.js): the newest git commit of the page's wrapper, the
// component folders it imports, `files`, and its own `sections` of the translation file (or
// its `topic` in content/topics/); left out when git history isn't available.
const TOPIC_FILES = ['src/components/Topic', 'src/util/topic-pages.js', 'src/util/topic-build.js'];
const STATIC_PAGES = [
  {
    path: '',
    priority: 1.0,
    changeFrequency: 'weekly',
    sections: ['home'],
    files: ['src/components/Home'],
  },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly', sections: ['products'] },
  // Topic pages (src/util/topic-pages.js)
  {
    path: '/egyptian-marble',
    priority: 0.9,
    changeFrequency: 'monthly',
    topic: 'egyptianMarble',
    files: TOPIC_FILES,
  },
  {
    path: '/egyptian-limestone',
    priority: 0.9,
    changeFrequency: 'monthly',
    topic: 'egyptianLimestone',
    files: TOPIC_FILES,
  },
  {
    path: '/egyptian-granite',
    priority: 0.9,
    changeFrequency: 'monthly',
    topic: 'egyptianGranite',
    files: TOPIC_FILES,
  },
  {
    path: '/imported-marble',
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'importedMarble',
    files: TOPIC_FILES,
  },
  {
    path: '/imported-granite',
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'importedGranite',
    files: TOPIC_FILES,
  },
  {
    path: '/galala-marble',
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'galalaMarble',
    files: TOPIC_FILES,
  },
  {
    path: '/buy-marble-from-egypt',
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'buyGuide',
    files: TOPIC_FILES,
  },
  { path: '/quarries', priority: 0.8, changeFrequency: 'monthly', sections: ['quarries'] },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly', sections: ['projects'] },
  { path: '/gallery', priority: 0.7, changeFrequency: 'monthly', sections: ['gallery'] },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly', sections: ['about'] },
  {
    path: '/contact',
    priority: 0.7,
    changeFrequency: 'yearly',
    sections: ['contact', 'contactForm', 'contactInfo'],
  },
  { path: '/exports', priority: 0.7, changeFrequency: 'monthly', sections: ['exports'] },
  { path: '/news', priority: 0.7, changeFrequency: 'weekly', sections: ['news'] },
  { path: '/machinery', priority: 0.6, changeFrequency: 'monthly', sections: ['machinery'] },
  { path: '/packing', priority: 0.6, changeFrequency: 'monthly', sections: ['packing'] },
  { path: '/certificates', priority: 0.6, changeFrequency: 'yearly', sections: ['certificates'] },
  { path: '/history', priority: 0.6, changeFrequency: 'yearly', sections: ['history'] },
  { path: '/partners', priority: 0.6, changeFrequency: 'monthly', sections: ['partners'] },
  { path: '/fairs', priority: 0.6, changeFrequency: 'monthly', sections: ['fairs'] },
  { path: '/inspiration', priority: 0.6, changeFrequency: 'monthly', sections: ['inspiration'] },
  { path: '/patterns', priority: 0.6, changeFrequency: 'monthly', sections: ['patterns'] },
  {
    path: '/stone-creations',
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['stoneCreation'],
  },
  { path: '/kerbstone', priority: 0.6, changeFrequency: 'monthly', sections: ['kerbstone'] },
  { path: '/cobbles', priority: 0.6, changeFrequency: 'monthly', sections: ['cobbles'] },
  { path: '/visualizer', priority: 0.5, changeFrequency: 'monthly', sections: ['visualizer'] },
];

const url = (lang, path) => `${BASE_URL}/${lang}${path}/`;

export default async function sitemap() {
  const productSlugs = [...new Set(await getProductSlugs())];
  const news = await getNewsArticles('en'); // from the admin panel
  const projectIds = await getProjectIds(); // from the admin panel

  const pages = [
    ...STATIC_PAGES.map((page) => ({
      ...page,
      lastModified: (lang) => pageLastModified(page, lang),
    })),
    // Products and projects: the API has no "last changed" date for them, so no <lastmod>.
    ...productSlugs.map((slug) => ({
      path: `/products/${slug}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    })),
    // News and projects: only the languages they are written in (English, Arabic when
    // written); the other language copies show English text and are noindex.
    ...(await Promise.all(
      projectIds.map(async (id) => ({
        path: `/projects/${id}`,
        priority: 0.6,
        changeFrequency: 'yearly',
        langs: await getProjectIndexedLangs(id),
      })),
    )),
    // News: the article's own date (year and month, as shown on the page).
    ...(await Promise.all(
      news.map(async (a) => ({
        path: `/news/${a.slug}`,
        priority: 0.6,
        changeFrequency: 'yearly',
        langs: await getNewsIndexedLangs(a.slug),
        lastModified: () =>
          a.year && a.month ? `${a.year}-${String(a.month).padStart(2, '0')}` : null,
      })),
    )),
  ];

  return pages.flatMap(
    ({ path, priority, changeFrequency, langs = SUPPORTED_LANGS, lastModified }) => {
      const languages = Object.fromEntries(langs.map((l) => [l, url(l, path)]));
      languages['x-default'] = url('en', path);
      return langs.map((lang) => {
        const date = lastModified?.(lang);
        return {
          url: url(lang, path),
          ...(date ? { lastModified: date } : {}),
          changeFrequency,
          priority,
          alternates: { languages },
        };
      });
    },
  );
}
