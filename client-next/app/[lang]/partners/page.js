import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Partners = dynamic(() => import('../../../src/components/Partners/Partners'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'partners.pageTitle', 'Partners | Wadi Degla'),
    description: t(lang, 'partners.metaDescription', ''),
    alternates: buildAlternates('/partners'),
  };
}

export default function PartnersPage() {
  return <Partners />;
}
