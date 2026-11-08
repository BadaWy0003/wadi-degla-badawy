import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import About from '../../../src/components/About/About';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'about.pageTitle', 'About | Wadi Degla');
  const description = t(lang, 'about.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/about', lang),
    ...buildSocial({ title, description, path: '/about', lang }),
  };
}

export default function AboutPage() {
  return (
    <>
      <HeroPreload page="about" />
      <About />
    </>
  );
}
