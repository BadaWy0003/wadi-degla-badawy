import { t, buildAlternates } from '../../../src/util/meta';
import Inspiration from '../../../src/components/Inspiration/Inspiration';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'inspiration.pageTitle', 'Inspiration | Wadi Degla'),
    description: t(lang, 'inspiration.metaDescription', ''),
    alternates: buildAlternates('/inspiration', lang),
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
