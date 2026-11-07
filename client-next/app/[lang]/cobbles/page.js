import { t, buildAlternates } from '../../../src/components/../util/meta';
import Cobble from '../../../src/components/Cobble/Cobble';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'cobbles.pageTitle', 'Cobble | Wadi Degla'),
    description: t(lang, 'cobbles.metaDescription', ''),
    alternates: buildAlternates('/cobbles', lang),
  };
}

export default function CobblePage({ params }) {
  return (
    <>
      <HeroPreload page="cobbles" />
      <Cobble />
      <RelatedPages lang={params.lang} page="cobbles" />
    </>
  );
}
