import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Quarries from '../../../src/components/Quarries/Quarries';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'quarries.pageTitle', 'Quarries | Wadi Degla');
  const description = t(lang, 'quarries.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/quarries', lang),
    ...buildSocial({ title, description, path: '/quarries', lang }),
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
