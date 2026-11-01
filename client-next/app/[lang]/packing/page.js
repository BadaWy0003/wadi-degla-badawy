import { t, buildAlternates } from '../../../src/util/meta';
import Packing from '../../../src/components/Packing/Packing';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'packing.pageTitle', 'Packing | Wadi Degla'),
    description: t(lang, 'packing.metaDescription', ''),
    alternates: buildAlternates('/packing', lang),
  };
}

export default function PackingPage() {
  return <Packing />;
}
