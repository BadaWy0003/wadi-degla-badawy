import { t, buildAlternates } from '../../../src/util/meta';
import Quarries from '../../../src/components/Quarries/Quarries';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'quarries.pageTitle', 'Quarries | Wadi Degla'),
    description: t(lang, 'quarries.metaDescription', ''),
    alternates: buildAlternates('/quarries', lang),
  };
}

export default function QuarriesPage({ params }) {
  return (
    <>
      <HeroPreload page="quarries" />
      <Quarries />
      <RelatedPages lang={params.lang} page="quarries" />
    </>
  );
}
