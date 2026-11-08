import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Inspiration from '../../../src/components/Inspiration/Inspiration';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'inspiration.pageTitle', 'Inspiration | Wadi Degla');
  const description = t(lang, 'inspiration.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/inspiration', lang),
    ...buildSocial({ title, description, path: '/inspiration', lang }),
  };
}

export default function InspirationPage() {
  return (
    <>
      <HeroPreload page="inspiration" />
      <Inspiration />
    </>
  );
}
