import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Exports = dynamic(() => import('../../../src/components/Exports/Exports'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'exports.pageTitle', 'Exports | Wadi Degla'),
    description: t(lang, 'exports.metaDescription', ''),
    alternates: buildAlternates('/exports'),
  };
}

export default function ExportsPage() {
  return <Exports />;
}
