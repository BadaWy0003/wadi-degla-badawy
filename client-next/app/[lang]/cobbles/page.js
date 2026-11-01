import { t, buildAlternates } from '../../../src/components/../util/meta';
import Cobble from '../../../src/components/Cobble/Cobble';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'cobbles.pageTitle', 'Cobble | Wadi Degla'),
    description: t(lang, 'cobbles.metaDescription', ''),
    alternates: buildAlternates('/cobbles', lang),
  };
}

export default function CobblePage({ params }) {
  return <Cobble />;
}
