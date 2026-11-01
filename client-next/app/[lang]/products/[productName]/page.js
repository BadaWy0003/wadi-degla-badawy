import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import { getProductSlugs, getProductBySlug } from '../../../../src/util/product-slugs';
import ProductDetails from '../../../../src/components/Products/ProductDetails';
import { PRODUCT_TYPE_KEYS } from '../../../../src/util/product-types';

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return SUPPORTED_LANGS.flatMap((lang) => slugs.map((productName) => ({ lang, productName })));
}

const slugToName = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export async function generateMetadata({ params }) {
  const { lang, productName } = params;
  const product = await getProductBySlug(productName);
  const displayName = product?.name || slugToName(productName);
  const titleTemplate = t(lang, 'productDetails.pageTitle', '{{name}} | Wadi Degla');
  const descTemplate = t(lang, 'productDetails.metaDescription', '');
  return {
    title: titleTemplate.replace('{{name}}', displayName),
    description: descTemplate
      .replace(/\{\{name\}\}/g, displayName)
      .replace(/\{\{type\}\}/g, PRODUCT_TYPE_KEYS[product?.type] ? t(lang, PRODUCT_TYPE_KEYS[product.type]) : 'natural stone'),
    alternates: buildAlternates(`/products/${productName}`, lang),
  };
}

// The product is fetched at build time so its name, category, photo and finishes are in
// the static HTML (for Google). ProductDetails still refreshes it from the API in the
// browser, so admin-panel changes show up without a redeploy.
export default async function ProductDetailsPage({ params }) {
  const product = await getProductBySlug(params.productName);
  return <ProductDetails initialProduct={product} />;
}
