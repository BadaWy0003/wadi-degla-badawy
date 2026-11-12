import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Inspiration from '../../../src/components/Inspiration/Inspiration';
import { getProducts } from '../../../src/util/product-slugs';
import { PRODUCT_CATEGORIES } from '../../../src/util/product-types';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'inspiration.pageTitle', 'Inspiration | Wadi Degla');
  const description = t(lang, 'inspiration.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/inspiration', lang),
    ...buildSocial({ title, description, path: '/inspiration', lang }),
  };
}

// The number of stones on the site is counted at build time (same rule as the products list:
// only the five categories are shown).
export default async function InspirationPage() {
  const stones = (await getProducts()).filter((p) => PRODUCT_CATEGORIES.includes(p.type));
  return <Inspiration stoneCount={stones.length} />;
}
