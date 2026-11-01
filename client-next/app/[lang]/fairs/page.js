import { t, buildAlternates } from '../../../src/components/../util/meta';
import Fairs from '../../../src/components/Fairs/Fairs';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'fairs.pageTitle', 'Fairs | Wadi Degla'),
    description: t(lang, 'fairs.metaDescription', ''),
    alternates: buildAlternates('/fairs', lang),
  };
}

export default function FairsPage({ params }) {
  return <Fairs />;
}
