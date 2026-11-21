import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import About from '../../../src/components/About/About';
import HeroPreload from '../../../src/components/HeroPreload';
import { sitePhoto } from '../../../src/util/site-content';

export async function generateMetadata(props) {
  const params = await props.params;
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
      <HeroPreload page="about" src={sitePhoto('about', 'heroPhoto', undefined)} />
      <About />
    </>
  );
}
