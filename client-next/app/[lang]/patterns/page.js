import { t, buildAlternates } from '../../../src/components/../util/meta';
import Patterns from '../../../src/components/Patterns/Patterns';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'patterns.pageTitle', 'Patterns | Wadi Degla'),
    description: t(lang, 'patterns.metaDescription', ''),
    alternates: buildAlternates('/patterns', lang),
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
