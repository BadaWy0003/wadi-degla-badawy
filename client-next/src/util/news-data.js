// News articles come from the admin panel (server: GET /api/news) and are read at BUILD
// time, so every article page is static and readable by Google. A change in the admin
// panel reaches the site with "Publish to website" (a rebuild).
//
// If the API can't be reached, the build FAILS on purpose: the live site then keeps its
// last good version instead of being deployed with an empty news section.

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'https://server-withered-wildflower-1595.fly.dev';

let cache = null;

async function fetchArticles() {
  if (cache) return cache;
  let res;
  try {
    res = await fetch(`${API_BASE}/api/news`, { cache: 'force-cache' });
  } catch (e) {
    throw new Error(
      `[news] News API unreachable at build time (${e?.cause?.code || e?.message}); stopping the build so the live site keeps its current news.`,
    );
  }
  if (!res.ok)
    throw new Error(
      `[news] News API answered ${res.status}; stopping the build so the live site keeps its current news.`,
    );
  const json = await res.json();
  cache = Array.isArray(json?.data) ? json.data : [];
  return cache;
}

// Arabic site: Arabic text when it was written, otherwise English. Other languages: English.
const pick = (field, lang) => (lang === 'ar' && field?.ar?.trim() ? field.ar : field?.en || '');

// Same display as before ("June 2025"), with the month name in the page's language.
export const formatNewsDate = (year, month, lang) => {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, {
      month: 'long',
      year: 'numeric',
    }).format(new Date(Date.UTC(year, month - 1, 15)));
  } catch {
    return `${year}-${String(month).padStart(2, '0')}`;
  }
};

const shorten = (text, max = 160) => {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

// Articles in the shape the News components use, already in display order
// (pinned first, then newest; the server sorts them).
export async function getNewsArticles(lang = 'en') {
  // Pinned first, then newest; articles from the same month by English title, so their
  // order never changes between builds.
  const list = [...(await fetchArticles())].sort(
    (a, b) =>
      Number(!!b.pinned) - Number(!!a.pinned) ||
      b.year * 100 + b.month - (a.year * 100 + a.month) ||
      String(a.title?.en || '').localeCompare(String(b.title?.en || '')),
  );
  return list.map((a) => {
    const content = pick(a.content, lang);
    return {
      id: a.id,
      slug: a.slug,
      title: pick(a.title, lang),
      content,
      excerpt: pick(a.excerpt, lang) || shorten(content),
      date: formatNewsDate(a.year, a.month, lang),
      year: a.year,
      month: a.month,
      thumbnail: a.thumbnail,
      author: a.author,
      pinned: !!a.pinned,
      images: (a.images || []).map((img) => ({ src: img.src, alt: img.alt })),
    };
  });
}

// The languages an article is really written in: English, plus Arabic when its Arabic title
// and text exist. The other language pages show the English text, so they are noindex and
// not in the sitemap (duplicate content); they stay visible to visitors.
export async function getNewsIndexedLangs(slug) {
  const a = (await fetchArticles()).find((x) => x.slug === slug);
  if (!a) return [];
  return a.title?.ar?.trim() && a.content?.ar?.trim() ? ['en', 'ar'] : ['en'];
}

export async function getNewsSlugs() {
  return (await fetchArticles()).map((a) => a.slug);
}

export async function getNewsArticle(slug, lang) {
  return (await getNewsArticles(lang)).find((a) => a.slug === slug) || null;
}
