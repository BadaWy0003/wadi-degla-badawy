import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Products = dynamic(() => import('../../../src/components/Products/Products'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'products.pageTitle', 'Products | Wadi Degla'),
    description: t(lang, 'products.metaDescription', ''),
    alternates: buildAlternates('/products'),
  };
}

export default function ProductsPage({ params }) {
  return <Products />;
}
