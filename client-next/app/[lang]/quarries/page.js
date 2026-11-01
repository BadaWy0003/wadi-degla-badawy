import { t, buildAlternates } from '../../../src/util/meta';
import Quarries from '../../../src/components/Quarries/Quarries';

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
