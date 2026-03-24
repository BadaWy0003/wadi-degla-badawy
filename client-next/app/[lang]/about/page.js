import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const About = dynamic(() => import('../../../src/components/About/About'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'navigation.about', 'About | Wadi Degla'),
    description: t(lang, 'home.metaDescription', ''),
    alternates: buildAlternates('/about'),
  };
}

export default function AboutPage() {
  return <About />;
}
