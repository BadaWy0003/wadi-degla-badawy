// Build-time data and metadata for the topic pages (see src/util/topic-pages.js).
import { buildAlternates } from './meta';
import { topicText } from './topic-content';
import { TOPIC_PAGES } from './topic-pages';
import { getProducts } from './product-slugs';
import { getProjects } from './projects-data';

const BASE = 'https://www.wadidegla-eg.com';

export function topicMetadata(lang, key) {
  const page = TOPIC_PAGES[key];
  return {
    title: topicText(lang, `${key}.pageTitle`),
    description: topicText(lang, `${key}.metaDescription`),
    alternates: buildAlternates(`/${page.slug}`, lang),
  };
}

const cardFinish = (p) =>
  p.finishes?.find((f) => f.finish === 'Honed') || p.finishes?.find((f) => f.finish === 'Polished');

// The stones of this topic (card data only: name, category, Honed/Polished photo) and up to
// 8 projects that used one of them.
export async function topicData(lang, key) {
  const page = TOPIC_PAGES[key];
  if (!page.products) return { products: [], projects: [] };
  const [all, projects] = await Promise.all([getProducts(), getProjects(lang)]);
  const products = (all || [])
    .filter(page.products)
    .filter(cardFinish)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({ id: p.id, name: p.name, type: p.type, finishes: [cardFinish(p)] }));
  const ids = new Set(products.map((p) => p.id));
  const used = projects
    .filter((p) => p.materials.some((m) => ids.has(m.id)))
    .slice(0, 8)
    .map(({ id, name, city, country, thumbnail }) => ({ id, name, city, country, thumbnail }));
  return { products, projects: used };
}

// Home > (Products >) Topic, for Google's breadcrumb display.
export function topicBreadcrumb(lang, key) {
  const page = TOPIC_PAGES[key];
  const items = [{ name: topicText(lang, 'common.breadcrumbHome'), item: `${BASE}/${lang}/` }];
  if (page.products) {
    items.push({
      name: topicText(lang, 'common.breadcrumbProducts'),
      item: `${BASE}/${lang}/products/`,
    });
  }
  items.push({ name: topicText(lang, `${key}.heading`), item: `${BASE}/${lang}/${page.slug}/` });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })),
  };
}
