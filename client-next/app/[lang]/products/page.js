import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import { getProducts, productSlug } from '../../../src/util/product-slugs';
import Products from '../../../src/components/Products/Products';

const BASE = 'https://www.wadidegla-eg.com';

// Built from the live product list (it used to be a hand-written copy that had drifted:
// 88 entries, one pointing to a page that doesn't exist, six products missing).
function buildItemListSchema(lang, products) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Wadi Degla Natural Stone Products — Egyptian Marble, Granite & Limestone',
    description:
      'Complete catalog of Egyptian marble, Egyptian granite, Egyptian limestone, imported marble, and imported granite available as slabs, tiles, and blocks from Wadi Degla.',
    url: `${BASE}/${lang}/products/`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      description: `${p.name} — premium ${String(p.type).toLowerCase()} available as slabs, tiles, and blocks. Exported worldwide by Wadi Degla, Egyptian natural stone supplier.`,
      url: `${BASE}/${lang}/products/${productSlug(p.name)}/`,
    })),
  };
}

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'products.pageTitle', 'Egyptian Marble & Granite | Wadi Degla');
  const description = t(lang, 'products.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/products', lang),
    ...buildSocial({ title, description, path: '/products', lang }),
  };
}

// The product list is fetched at build time so the product cards (names, photos, links to
// each product page) are in the static HTML. Products refreshes it in the browser.
export default async function ProductsPage({ params }) {
  const lang = params?.lang || 'en';
  const products = (await getProducts()) || [];
  // Only what a card shows (its Honed or Polished photo, and how many finishes it has): the
  // full list with every finish is ~75 KB and would be embedded twice in each page's HTML.
  // The browser refresh loads it all.
  const ROOM = ['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'];
  const cards = products.map(({ id, name, type, finishes = [] }) => ({
    id,
    name,
    type,
    finishCount: finishes.filter((f) => !ROOM.includes(f.finish)).length,
    finishes: finishes.filter((f) => f.finish === 'Honed' || f.finish === 'Polished'),
  }));
  return (
    <>
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListSchema(lang, products)) }}
        />
      )}
      <Products initialProducts={cards} />
    </>
  );
}
