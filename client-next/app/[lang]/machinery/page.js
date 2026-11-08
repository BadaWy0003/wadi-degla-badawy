import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Machinery from '../../../src/components/Machinery/Machinery';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'machinery.pageTitle', 'Machinery | Wadi Degla');
  const description = t(lang, 'machinery.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/machinery', lang),
    ...buildSocial({ title, description, path: '/machinery', lang }),
  };
}

export default function MachineryPage({ params }) {
  return (
    <>
      <HeroPreload page="machinery" />
      <Machinery />
      <RelatedPages lang={params.lang} page="machinery" />
    </>
  );
}
