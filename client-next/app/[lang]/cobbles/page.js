import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Cobble from '../../../src/components/Cobble/Cobble';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'cobbles.pageTitle', 'Cobble | Wadi Degla');
  const description = t(lang, 'cobbles.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/cobbles', lang),
    ...buildSocial({ title, description, path: '/cobbles', lang }),
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
