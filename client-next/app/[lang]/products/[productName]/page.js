import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import { getProductSlugs } from '../../../../src/util/product-slugs';
const ProductDetails = dynamic(() => import('../../../../src/components/Products/ProductDetails'), { ssr: false });

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return SUPPORTED_LANGS.flatMap((lang) => slugs.map((productName) => ({ lang, productName })));
}

export function generateMetadata({ params }) {
  const { lang, productName } = params;
  const displayName = productName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const titleTemplate = t(lang, 'productDetails.pageTitle', '{{name}} | Wadi Degla');
  const descTemplate = t(lang, 'productDetails.metaDescription', '');
  return {
    title: titleTemplate.replace('{{name}}', displayName),
    description: descTemplate.replace(/\{\{name\}\}/g, displayName).replace(/\{\{type\}\}/g, 'natural stone'),
    alternates: buildAlternates(`/products/${productName}`, lang),
  };
}

export default function ProductDetailsPage({ params }) {
  return <ProductDetails />;
}
