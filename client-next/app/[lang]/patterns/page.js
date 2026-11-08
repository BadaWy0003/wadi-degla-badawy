import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Patterns from '../../../src/components/Patterns/Patterns';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'patterns.pageTitle', 'Patterns | Wadi Degla');
  const description = t(lang, 'patterns.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/patterns', lang),
    ...buildSocial({ title, description, path: '/patterns', lang }),
  };
}

export default function PatternsPage({ params }) {
  return (
    <>
      <HeroPreload page="patterns" />
      <Patterns />
      <RelatedPages lang={params.lang} page="patterns" />
    </>
  );
}
