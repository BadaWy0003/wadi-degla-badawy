import { t, buildAlternates } from '../../../src/util/meta';
import About from '../../../src/components/About/About';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'about.pageTitle', 'About | Wadi Degla'),
    description: t(lang, 'about.metaDescription', ''),
    alternates: buildAlternates('/about', lang),
  };
}

export default function AboutPage() {
  return <About />;
}
