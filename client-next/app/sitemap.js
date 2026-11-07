// Generates /sitemap.xml at build time (replaces the hand-written public/sitemap.xml).
// Every public page in all 12 languages, each with hreflang alternates.
import { SUPPORTED_LANGS } from '../src/util/supported-langs';
import { getProductSlugs } from '../src/util/product-slugs';
import { getProjectIds, getProjectIndexedLangs } from '../src/util/projects-data';
import { getNewsSlugs, getNewsIndexedLangs } from '../src/util/news-data';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.wadidegla-eg.com';

// Public pages under app/[lang]/ ('' = home). Login, signup, my-account and the
// 404 pages are left out on purpose: they shouldn't appear in search results.
const STATIC_PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly' },
  // Topic pages (src/util/topic-pages.js)
  { path: '/egyptian-marble', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/egyptian-granite', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/imported-marble', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/imported-granite', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/galala-marble', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/buy-marble-from-egypt', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/quarries', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/exports', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/news', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/machinery', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/packing', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/certificates', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/history', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/partners', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/inspiration', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/patterns', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/stone-creations', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/kerbstone', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/cobbles', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/visualizer', priority: 0.5, changeFrequency: 'monthly' },
];

const url = (lang, path) => `${BASE_URL}/${lang}${path}/`;

export default async function sitemap() {
  const lastModified = new Date();
  const productSlugs = [...new Set(await getProductSlugs())];
  const newsSlugs = await getNewsSlugs(); // from the admin panel
  const projectIds = await getProjectIds(); // from the admin panel

  const pages = [
    ...STATIC_PAGES,
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
    ...(await Promise.all(
      newsSlugs.map(async (slug) => ({
        path: `/news/${slug}`,
        priority: 0.6,
        changeFrequency: 'yearly',
        langs: await getNewsIndexedLangs(slug),
      })),
    )),
  ];

  return pages.flatMap(({ path, priority, changeFrequency, langs = SUPPORTED_LANGS }) => {
    const languages = Object.fromEntries(langs.map((l) => [l, url(l, path)]));
    languages['x-default'] = url('en', path);
    return langs.map((lang) => ({
      url: url(lang, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
