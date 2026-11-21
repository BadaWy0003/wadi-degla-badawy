// Generates /sitemap.xml at build time (replaces the hand-written public/sitemap.xml).
// Every public page in all 12 languages, each with hreflang alternates.
import { SUPPORTED_LANGS } from '../src/util/supported-langs';
import { PRIVACY_UPDATED } from '../src/components/Privacy/privacyTexts';
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
    blocks: ['home'],
    priority: 1.0,
    changeFrequency: 'weekly',
    sections: ['home'],
    files: ['src/components/Home'],
  },
  {
    path: '/products',
    blocks: ['productsList'],
    priority: 0.9,
    changeFrequency: 'weekly',
    sections: ['products'],
  },
  // Topic pages (src/util/topic-pages.js)
  {
    path: '/egyptian-marble',
    blocks: ['topic_egyptianMarble'],
    priority: 0.9,
    changeFrequency: 'monthly',
    topic: 'egyptianMarble',
    files: TOPIC_FILES,
  },
  {
    path: '/egyptian-limestone',
    blocks: ['topic_egyptianLimestone'],
    priority: 0.9,
    changeFrequency: 'monthly',
    topic: 'egyptianLimestone',
    files: TOPIC_FILES,
  },
  {
    path: '/egyptian-granite',
    blocks: ['topic_egyptianGranite'],
    priority: 0.9,
    changeFrequency: 'monthly',
    topic: 'egyptianGranite',
    files: TOPIC_FILES,
  },
  {
    path: '/imported-marble',
    blocks: ['topic_importedMarble'],
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'importedMarble',
    files: TOPIC_FILES,
  },
  {
    path: '/imported-granite',
    blocks: ['topic_importedGranite'],
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'importedGranite',
    files: TOPIC_FILES,
  },
  {
    path: '/galala-marble',
    blocks: ['topic_galalaMarble'],
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'galalaMarble',
    files: TOPIC_FILES,
  },
  {
    path: '/buy-marble-from-egypt',
    blocks: ['topic_buyGuide'],
    priority: 0.8,
    changeFrequency: 'monthly',
    topic: 'buyGuide',
    files: TOPIC_FILES,
  },
  {
    path: '/quarries',
    blocks: ['quarries'],
    priority: 0.8,
    changeFrequency: 'monthly',
    sections: ['quarries'],
  },
  {
    path: '/projects',
    blocks: ['projectsPage'],
    priority: 0.8,
    changeFrequency: 'monthly',
    sections: ['projects'],
  },
  {
    path: '/gallery',
    blocks: ['gallery'],
    priority: 0.7,
    changeFrequency: 'monthly',
    sections: ['gallery'],
  },
  {
    path: '/about',
    blocks: ['about'],
    priority: 0.7,
    changeFrequency: 'monthly',
    sections: ['about'],
  },
  {
    path: '/contact',
    blocks: ['contactPage'],
    priority: 0.7,
    changeFrequency: 'yearly',
    sections: ['contact', 'contactForm', 'contactInfo'],
  },
  {
    path: '/exports',
    blocks: ['exports'],
    priority: 0.7,
    changeFrequency: 'monthly',
    sections: ['exports'],
  },
  {
    path: '/news',
    blocks: ['newsPage'],
    priority: 0.7,
    changeFrequency: 'weekly',
    sections: ['news'],
  },
  {
    path: '/machinery',
    blocks: ['machinery'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['machinery'],
  },
  {
    path: '/packing',
    blocks: ['packing'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['packing'],
  },
  {
    path: '/certificates',
    blocks: ['certificates'],
    priority: 0.6,
    changeFrequency: 'yearly',
    sections: ['certificates'],
  },
  {
    path: '/history',
    blocks: ['history'],
    priority: 0.6,
    changeFrequency: 'yearly',
    sections: ['history'],
  },
  {
    path: '/partners',
    blocks: ['partners'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['partners'],
  },
  {
    path: '/fairs',
    blocks: ['fairs'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['fairs'],
  },
  {
    path: '/inspiration',
    blocks: ['inspiration'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['inspiration'],
  },
  {
    path: '/patterns',
    blocks: ['patterns'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['patterns'],
  },
  {
    path: '/stone-creations',
    blocks: ['stoneCreations'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['stoneCreation'],
  },
  {
    path: '/kerbstone',
    blocks: ['kerbstone'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['kerbstone'],
  },
  {
    path: '/cobbles',
    blocks: ['cobbles'],
    priority: 0.6,
    changeFrequency: 'monthly',
    sections: ['cobbles'],
  },
  {
    path: '/visualizer',
    blocks: ['visualizerPage'],
    priority: 0.5,
    changeFrequency: 'monthly',
    sections: ['visualizer'],
  },
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
    // Privacy page: written in English and Arabic only (the other copies are noindex).
    {
      path: '/privacy',
      priority: 0.2,
      changeFrequency: 'yearly',
      langs: ['en', 'ar'],
      lastModified: () => new Date(PRIVACY_UPDATED),
    },
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
