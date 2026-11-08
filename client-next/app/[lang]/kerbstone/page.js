import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Kerbstone from '../../../src/components/Kerbstone/Kerbstone';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'kerbstone.pageTitle', 'Kerbstone | Wadi Degla');
  const description = t(lang, 'kerbstone.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/kerbstone', lang),
    ...buildSocial({ title, description, path: '/kerbstone', lang }),
  };
}

export default function KerbstonePage({ params }) {
  return (
    <>
      <HeroPreload page="kerbstone" />
      <Kerbstone />
      <RelatedPages lang={params.lang} page="kerbstone" />
    </>
  );
}
