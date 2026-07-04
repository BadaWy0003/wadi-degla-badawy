import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Quarries = dynamic(() => import('../../../src/components/Quarries/Quarries'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'quarries.pageTitle', 'Quarries | Wadi Degla'),
    description: t(lang, 'quarries.metaDescription', ''),
    alternates: buildAlternates('/quarries', lang),
  };
}

export default function QuarriesPage() {
  return <Quarries />;
}
