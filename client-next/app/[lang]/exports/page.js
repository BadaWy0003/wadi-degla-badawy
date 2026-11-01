import { t, buildAlternates } from '../../../src/util/meta';
import Exports from '../../../src/components/Exports/Exports';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'exports.pageTitle', 'Exports | Wadi Degla'),
    description: t(lang, 'exports.metaDescription', ''),
    alternates: buildAlternates('/exports', lang),
  };
}

export default function ExportsPage() {
  return <Exports />;
}
